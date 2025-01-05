<!-- src/svelte/RoutinesPanel.svelte -->
<script lang="ts">
  import type RoutinesPlugin from "../main";

  export let plugin: RoutinesPlugin;

  // State
  let selectedRoutineId = "";
  let steps: Array<{ name: string; plannedMs: number }> = [];
  let currentIndex = 0;

  // How much time has elapsed on the current step (in ms).
  let currentMsSpent = 0;

  let running = false;
  let intervalId: number | null = null;

  let errorMsg = "";

  // Audio
  let beepAudio: HTMLAudioElement | null = null;
  let beepPlayed = false;

  /**
   * Helper function for logging debug statements only if debug mode is ON.
   */
  function debugLog(...args: unknown[]) {
    if (plugin.settings.debugMode) {
      console.log("[RoutinesPanel]", ...args);
    }
  }

  // On mount or whenever plugin.settings change, set up beepAudio if enabled
  $: if (plugin.settings.enableAlertAudio) {
    // If user turned on alert audio, create the Audio object from their path
    if (plugin.settings.alertAudioPath) {
      beepAudio = new Audio(plugin.settings.alertAudioPath);
      debugLog("Beep audio set to:", plugin.settings.alertAudioPath);
    } else {
      beepAudio = null;
      debugLog("Alert audio is enabled, but no path provided.");
    }
  } else {
    // If alert audio is disabled, no beep
    beepAudio = null;
  }

  // Parse lines: "- [ ] Step - HH:MM:SS"
  function parseRoutineFile(content: string) {
    debugLog("Parsing routine file content...");
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
    debugLog("Parsed steps:", parsed);
    return parsed;
  }

  // Sizing for the timer circle
  const radius = 70;
  const circumference = 2 * Math.PI * radius; // ~439.8

  /**
   * progress = fraction of planned time used for the current step.
   * 0    => just started
   * 1    => exactly used up planned time
   * >1   => over time
   */
  $: progress = steps.length > 0
    ? currentMsSpent / steps[currentIndex]?.plannedMs
    : 0;

  // For the arc, clamp progress at 1 so the circle doesn't overfill.
  $: arcProgress = progress > 1 ? 1 : progress;
  $: dashOffset = circumference * (1 - arcProgress);

  // Colors:
  //  0–75% => limegreen
  //  75–90% => yellow
  //  90–100% => orange
  //  >=100% => red
  $: color =
    progress < 0.75
      ? "limegreen"
      : progress < 0.9
      ? "yellow"
      : progress < 1
      ? "orange"
      : "red";

  // Display time:
  //  If currentMsSpent < plannedMs => show how much time remains
  //  Else => show how far over we've gone as +MM:SS
  $: displayTime = steps.length > 0
    ? formatDisplayTime(currentMsSpent, steps[currentIndex].plannedMs)
    : "00:00";

  function formatDisplayTime(spent: number, planned: number) {
    const diff = planned - spent;
    if (diff >= 0) {
      return msToMMSS(diff); // under time
    } else {
      return `+ ${msToMMSS(-diff)}`; // over time
    }
  }

  function msToMMSS(ms: number) {
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
    debugLog("Selected routine changed to:", selectedRoutineId);
    steps = [];
    stopTimer();
    errorMsg = "";
  }

  async function onStartPauseClick() {
    if (!running) {
      debugLog("Attempting to start...");
      if (steps.length === 0) {
        debugLog("No steps loaded, trying to parse routine from file...");
        // parse if not loaded
        if (!selectedRoutineId) {
          errorMsg = "Please pick a routine first.";
          debugLog("No routine selected; cannot start.");
          return;
        }
        const routine = plugin.settings.routines.find(
          (r) => r.id === selectedRoutineId
        );
        if (!routine) {
          errorMsg = `Routine not found: ${selectedRoutineId}`;
          debugLog("Routine not found in plugin settings:", selectedRoutineId);
          return;
        }
        const file = plugin.app.vault.getAbstractFileByPath(
          routine.templateFilePath
        );
        if (!file || !file.name.endsWith(".md")) {
          errorMsg = `File not found or not markdown: ${routine.templateFilePath}`;
          debugLog("File not found or not markdown:", routine.templateFilePath);
          return;
        }
        const content = await plugin.app.vault.read(file);
        const parsed = parseRoutineFile(content);
        if (parsed.length === 0) {
          errorMsg = "No steps found in that file.";
          debugLog("Parsed routine file but found 0 steps.");
          return;
        }
        steps = parsed;
        currentIndex = 0;
        currentMsSpent = 0; 
        beepPlayed = false; 
        errorMsg = "";
      }
      startTimer();
    } else {
      debugLog("Pausing timer...");
      pauseTimer();
    }
  }

  function startTimer() {
    running = true;
    debugLog("Timer started.");
    if (!intervalId) {
      intervalId = window.setInterval(tick, 1000);
    }
  }

  function pauseTimer() {
    running = false;
    debugLog("Timer paused.");
  }

  function stopTimer() {
    debugLog("Timer stopped, resetting routine.");
    running = false;
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
    steps = [];
    currentIndex = 0;
    currentMsSpent = 0;
    beepPlayed = false;
  }

  // Move to the next step manually (via UI)
  function nextStep() {
    currentIndex++;
    debugLog("Moving to next step. New index:", currentIndex);
    if (currentIndex >= steps.length) {
      debugLog("No more steps, stopping timer.");
      stopTimer();
      return;
    }
    currentMsSpent = 0; 
    beepPlayed = false; 
  }

  // Skip current step manually
  function skipStep() {
    debugLog("Skipping current step. Current index:", currentIndex);
    nextStep();
  }

  // Called every second if running
  function tick() {
    if (!running) return;
    currentMsSpent += 1000;
    debugLog("Tick:", {
      currentMsSpent,
      plannedMs: steps[currentIndex]?.plannedMs,
    });

    // If we haven't played the beep yet and we've hit or exceeded the planned time
    // Also check if beepAudio is available & user enabled it
    if (
      beepAudio &&
      !beepPlayed &&
      currentMsSpent >= steps[currentIndex].plannedMs
    ) {
      beepPlayed = true;
      debugLog("Time exceeded, playing beep audio:", plugin.settings.alertAudioPath);
      beepAudio.play().catch((err) => {
        console.error("Failed to play beep:", err);
      });
    }
    // No auto-jump to next step. We just keep counting beyond the planned time.
  }
</script>

<div class="routine-panel">
  <div class="timer-container">
    <!-- background circle -->
    <svg class="timer-svg" width="160" height="160" viewBox="0 0 160 160">
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
        stroke={color}
      />

      <!-- countdown in the center -->
      <text
        x="50%"
        y="50%"
        text-anchor="middle"
        dy=".35em"
        class="timer-text"
      >
        {displayTime}
      </text>
    </svg>
  </div>

  {#if steps.length > 0}
    <p class="step-label">
      Step {currentIndex + 1} / {steps.length}: {steps[currentIndex].name}
    </p>
  {/if}

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
    stroke-linecap: round;
    stroke-dasharray: 440; /* or use {circumference} var if you prefer */
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
