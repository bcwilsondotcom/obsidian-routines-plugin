// src/settings-tab.ts

import { PluginSettingTab } from "obsidian";
import type RoutinesPlugin from "./main";

/**
 * A minimal settings tab using pure DOM calls, so we don't rely on Obsidian's unexported 'Setting' class.
 */
export default class RoutinesPluginSettingsTab extends PluginSettingTab {
  plugin: RoutinesPlugin;

  constructor(app: any, plugin: RoutinesPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const container = this.containerEl;
    container.innerHTML = "";

    const heading = document.createElement("h2");
    heading.textContent = "Routines Plugin Settings";
    container.appendChild(heading);

    // Simple debug toggle
    const debugWrap = document.createElement("div");
    debugWrap.style.margin = "1rem 0";

    const debugLabel = document.createElement("label");
    debugLabel.textContent = "Enable Debug Mode?";
    debugWrap.appendChild(debugLabel);

    const debugCheckbox = document.createElement("input");
    debugCheckbox.type = "checkbox";
    debugCheckbox.checked = this.plugin.settings.debugMode;
    debugCheckbox.style.marginLeft = "0.5rem";
    debugCheckbox.addEventListener("change", async () => {
      this.plugin.settings.debugMode = debugCheckbox.checked;
      await this.plugin.saveSettings();
    });
    debugWrap.appendChild(debugCheckbox);

    container.appendChild(debugWrap);

    // You can also list or modify routines here, as you see fit:
    // e.g. "Add Routine" button, or text fields for routine name/path, etc.
  }
}