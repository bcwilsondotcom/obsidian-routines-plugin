// src/settings-tab.ts
import { App, PluginSettingTab, Setting } from "obsidian";

import type { RoutineConfig } from "./main";

export default class RoutinesPluginSettingsTab extends PluginSettingTab {
  plugin: any;

  constructor(app: App, plugin: any) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty(); // Clear the container

    // 1) Inject custom CSS directly in TS
    const css = `
      /* Example: remove bottom borders from each Setting inside .routine-box */
      .routine-box .setting-item {
        border: none !important;
        margin-bottom: 0 !important;
        padding-bottom: 0 !important;
      }
      .routine-box {
        /* Add a faint border or any styling you like */
        border: 1px solid var(--background-modifier-border);
        padding: 10px;
        margin-bottom: 15px;
        border-radius: 5px;
      }
    `;
    // Append only once to avoid duplicates
    if (!document.head.querySelector("#routines-plugin-style")) {
      const styleEl = document.createElement("style");
      styleEl.id = "routines-plugin-style";
      styleEl.textContent = css;
      document.head.appendChild(styleEl);
    }

    // 2) Main header
    containerEl.createEl("h1", { text: "Routines" });

    // 3) For each routine, create settings in a new .routine-box
    this.plugin.settings.routines.forEach(
      (routine: RoutineConfig, index: number) => {
        this.createRoutineSetting(containerEl, routine, index);
      }
    );

    // 4) Add New Routine button
    new Setting(containerEl)
      .setName("Add New Routine")
      .addButton((btn) =>
        btn
          .setButtonText("Add")
          .setCta()
          .onClick(async () => {
            const newRoutine: RoutineConfig = {
              id: crypto.randomUUID(),
              name: "New Routine",
              templateFilePath: "",
            };
            this.plugin.settings.routines.push(newRoutine);
            await this.plugin.saveSettings();
            this.display();
          })
      );

    // --- Additional Settings for Audio Alerts ---
    new Setting(containerEl)
      .setName("Enable Alert Audio")
      .setDesc("Play an alert sound when the step time is exceeded.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enableAlertAudio ?? false)
          .onChange(async (value: boolean) => {
            this.plugin.settings.enableAlertAudio = value;
            await this.plugin.saveSettings();
            // Re-render to show/hide the path field
            this.display();
          })
      );

    // Only show audio path field if the toggle is ON
    if (this.plugin.settings.enableAlertAudio) {
      new Setting(containerEl)
        .setName("Alert Audio Path")
        .setDesc("Path to the alert .mp3 file (local or vault path).")
        .addText((text) =>
          text
            .setPlaceholder("./alert.mp3")
            .setValue(this.plugin.settings.alertAudioPath ?? "")
            .onChange(async (value) => {
              this.plugin.settings.alertAudioPath = value;
              await this.plugin.saveSettings();
            })
        );
    }

    // 5) Debug Mode at the bottom
    new Setting(containerEl)
      .setName("Debug Mode")
      .setDesc("If enabled, extra debug logs appear in the console.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.debugMode)
          .onChange(async (value: boolean) => {
            this.plugin.settings.debugMode = value;
            await this.plugin.saveSettings();
            this.display();
          })
      );
  }

  private createRoutineSetting(
    containerEl: HTMLElement,
    routine: RoutineConfig,
    index: number
  ): void {
    // Create a container for each routine’s settings
    const routineBox = (containerEl as unknown as any).createDiv({
      cls: "routine-box",
    });

    // Routine Name + Delete Button
    new Setting(routineBox)
      .setName("Routine Name")
      .addExtraButton((btn) => {
        btn.setIcon("trash").setTooltip("Delete Routine").onClick(async () => {
          this.plugin.settings.routines.splice(index, 1);
          await this.plugin.saveSettings();
          this.display();
        });
      })
      .addText((text) => {
        text.setPlaceholder("Routine Name").setValue(routine.name).onChange(
          async (value) => {
            routine.name = value;
            await this.plugin.saveSettings();
          }
        );
      });

    // Routine File Location
    new Setting(routineBox)
      .setName("Routine File Location")
      .setDesc("Path to a routine markdown file.")
      .addText((text) => {
        text
          .setPlaceholder("Routines/Morning.md")
          .setValue(routine.templateFilePath)
          .onChange(async (value) => {
            routine.templateFilePath = value;
            await this.plugin.saveSettings();
          });
      });
  }
}
