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
    containerEl.empty(); // Clear the container using Obsidian's empty()

    containerEl.createEl("h1", { text: "Routines" });
    this.plugin.settings.routines.forEach((routine: RoutineConfig, index: number) => {
      this.createRoutineSetting(containerEl, routine, index);
    });

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

  private createRoutineSetting(containerEl: HTMLElement, routine: RoutineConfig, index: number): void {
      const routineDiv = (containerEl as unknown as any).createDiv({ cls: "routine-setting-item" });
      new Setting(routineDiv)
        .setName("Routine Name")
      .addExtraButton((btn) => {
        btn.setIcon("trash").setTooltip("Delete Routine").onClick(async () => {
          this.plugin.settings.routines.splice(index, 1);
          await this.plugin.saveSettings();
          this.display();
        });
      })
      .addText((text) => {
        text
          .setPlaceholder("Routine Name")
          .setValue(routine.name)
          .onChange(async (value) => {
            routine.name = value;
            await this.plugin.saveSettings();
          });
      });

    new Setting(routineDiv)
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
