<!-- src/svelte/RoutinesPanel.svelte -->

<script lang="ts">
    import type RoutinesPlugin from "../main";
  
    export let plugin: RoutinesPlugin;
  
    /**
     * We'll show one circle at the top (always).
     * If steps are loaded, the arc/time display the current step countdown.
     * Below that, we show step name. Then a row of icon buttons:
     *   [Play/Pause] [Next] [Skip] [Stop]
     * and at the bottom, a routine picker (dropdown).
     */
  
    // State
    let selectedRoutineId = "";
    let steps: Array<{ name: string; plannedMs: number }> = [];
    let currentIndex = 0;
    let currentMsLeft = 0;
    let running = false;
    let intervalId: number | null = null;
  
    let errorMsg = "";
  
    // Parse lines: "- [ ] Step - HH:MM:SS"
    function parseRoutineFile(content: string) {
      const lines = content.split("\n");
      const pattern = /^-\s*\[\s*\]\s*(.+?)\s*-\s*(\d{2}:\d{2}:\d{2})$/;
      const parsed: Array<{ name: string; plannedMs: number }> = [];
  
      for (const line of lines) {
        const match = line.match(pattern);
        if (!match) continue;
        const stepName = match[1].trim();
        const [hh, mm, ss] = match[2].split(":").map(Number);
        parsed.push({
          name: stepName,
          plannedMs: (hh * 3600 + mm * 60 + ss) * 1000,
        });
      }
      return parsed;
    }
  
    // For the circle
    const radius = 70;
    const circumference = 2 * Math.PI * radius; // ~ 439.8
    // If steps are loaded, we do 1 - (currentMsLeft / step's total),
    // else 0 => arc is zero length
    $: progress = steps.length > 0
      ? 1 - (currentMsLeft / steps[currentIndex]?.plannedMs)
      : 0;
    $: dashOffset = circumference * (1 - progress);
  
    function formatMs(ms: number) {
      if (ms <= 0) return "00:00";
      const totalSec = Math.floor(ms / 1000);
      const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
      const ss = String(totalSec % 60).padStart(2, "0");
      return `${mm}:${ss}`;
    }
  
    // Called when user changes routine
    function onSelectRoutine(e: Event) {
      const select = e.target as HTMLSelectElement;
      selectedRoutineId = select.value;
      steps = [];
      stopTimer();
      errorMsg = "";
    }
  
    async function onStartPauseClick() {
      if (!running) {
        // Start
        if (steps.length === 0) {
          // parse if not loaded
          if (!selectedRoutineId) {
            errorMsg = "Please pick a routine first.";
            return;
          }
          const routine = plugin.settings.routines.find(
            (r) => r.id === selectedRoutineId
          );
          if (!routine) {
            errorMsg = `Routine not found: ${selectedRoutineId}`;
            return;
          }
          const file = plugin.app.vault.getAbstractFileByPath(
            routine.templateFilePath
          );
          if (!file || !file.name.endsWith(".md")) {
            errorMsg = `File not found or not markdown: ${routine.templateFilePath}`;
            return;
          }
          const content = await plugin.app.vault.read(file);
          const parsed = parseRoutineFile(content);
          if (parsed.length === 0) {
            errorMsg = "No steps found in that file.";
            return;
          }
          steps = parsed;
          currentIndex = 0;
          currentMsLeft = steps[0].plannedMs;
          errorMsg = "";
        }
        startTimer();
      } else {
        pauseTimer();
      }
    }
  
    function startTimer() {
      running = true;
      if (!intervalId) {
        intervalId = window.setInterval(tick, 1000);
      }
    }
  
    function pauseTimer() {
      running = false;
    }
  
    function stopTimer() {
      running = false;
      if (intervalId) {
        window.clearInterval(intervalId);
        intervalId = null;
      }
      steps = [];
      currentIndex = 0;
      currentMsLeft = 0;
    }
  
    function nextStep() {
      currentIndex++;
      if (currentIndex >= steps.length) {
        stopTimer();
        return;
      }
      currentMsLeft = steps[currentIndex].plannedMs;
    }
  
    function skipStep() {
      // same logic as next, but maybe we differentiate?
      nextStep();
    }
  
    function tick() {
      if (!running) return;
      currentMsLeft -= 1000;
      if (currentMsLeft <= 0) {
        nextStep();
      }
    }
  </script>
  
  <div class="routine-panel">
    <!-- Timer Circle ALWAYS visible, top -->
    <div class="timer-container">
      <svg class="timer-svg" width="160" height="160" viewBox="0 0 160 160">
        <!-- background circle -->
        <circle
          cx="80"
          cy="80"
          r={radius}
          class="circle-bg"
          stroke-width="8"
          fill="none"
        />
        <!-- arc -->
        <circle
          cx="80"
          cy="80"
          r={radius}
          class="circle-arc"
          stroke-width="8"
          fill="none"
          stroke-dasharray={circumference}
          stroke-dashoffset={dashOffset}
          transform="rotate(-90 80 80)"
        />
        <!-- countdown in the center -->
        <text
          x="50%"
          y="50%"
          text-anchor="middle"
          dy=".35em"
          class="timer-text"
        >
          {formatMs(currentMsLeft)}
        </text>
      </svg>
    </div>
  
    {#if steps.length > 0}
      <p class="step-label">
        Step {currentIndex + 1} / {steps.length}:
        {steps[currentIndex].name}
      </p>
    {/if}
  
    <!-- Buttons row (icons, all same size) -->
    <div class="buttons-row">
      <!-- Start/Pause button -->
      <button
        class="icon-btn"
        on:click={onStartPauseClick}
        title={running ? "Pause" : "Start"}
      >
        {#if running}
          <!-- Pause icon -->
          <svg viewBox="0 0 24 24" width="24" height="24">
            <rect x="6" y="4" width="4" height="16"/>
            <rect x="14" y="4" width="4" height="16"/>
          </svg>
        {:else}
          <!-- Play icon -->
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        {/if}
      </button>
  
      <!-- Next button -->
      <button class="icon-btn" on:click={nextStep} title="Next step">
        <!-- 'Step forward' icon -->
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="M8 5v14l6-7zm7 0v14h2V5z"/>
        </svg>
      </button>
  
      <!-- Skip button -->
      <button class="icon-btn" on:click={skipStep} title="Skip step">
        <!-- 'Fast forward' icon -->
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="M5 5v14l7-7zm7 0v14l7-7z"/>
        </svg>
      </button>
  
      <!-- Stop button -->
      <button class="icon-btn" on:click={stopTimer} title="Stop routine">
        <!-- Stop icon -->
        <svg viewBox="0 0 24 24" width="24" height="24">
          <rect x="6" y="6" width="12" height="12"/>
        </svg>
      </button>
    </div>
  
    {#if errorMsg}
      <p class="error-msg">{errorMsg}</p>
    {/if}
  
    {#if plugin.settings.routines.length === 0}
      <p>No routines found in plugin settings.</p>
    {:else}
      <p>Select a routine:</p>
      <select bind:value={selectedRoutineId} on:change={onSelectRoutine}>
        <option value="">Select Routine</option>
        {#each plugin.settings.routines as r}
          <option value={r.id}>{r.name}</option>
        {/each}
      </select>
    {/if}
  </div>
  
  <style>
  .routine-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
  }
  
  .timer-container {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  .timer-svg {
    display: block;
  }
  
  .circle-bg {
    stroke: #ccc;
  }
  
  .circle-arc {
    stroke: orange;
    stroke-linecap: round;
    stroke-dasharray: 440; /* or use {circumference} var if you want */
  }
  
  .timer-text {
    font-size: 1.5rem;
    fill: var(--text-normal);
  }
  
  .step-label {
    font-size: 1rem;
  }
  
  .buttons-row {
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
  }
  
  .icon-btn {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    background: var(--background-secondary);
    cursor: pointer;
  }
  
  .icon-btn:hover {
    background: var(--background-primary);
  }
  
  .icon-btn svg {
    fill: var(--text-normal);
  }
  
  .error-msg {
    color: red;
    font-weight: bold;
  }
  </style>