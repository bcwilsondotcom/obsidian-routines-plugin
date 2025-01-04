// src/main.ts

import { Notice, Plugin } from "obsidian";
import { RoutinesPanelView, VIEW_TYPE_ROUTINES_PANEL } from "./routines-panel-view";

import RoutinesPluginSettingsTab from "./settings-tab";

//  <== import from separate file

export interface RoutineConfig {
  id: string;
  name: string;
  templateFilePath: string;
}

interface RoutinesPluginSettings {
  routines: RoutineConfig[];
  debugMode: boolean;
}

const DEFAULT_SETTINGS: RoutinesPluginSettings = {
  routines: [],
  debugMode: false,
};

export default class RoutinesPlugin extends Plugin {
  public settings: RoutinesPluginSettings = { ...DEFAULT_SETTINGS };

  async onload() {
    await this.loadSettings();
    this.debugLog("RoutinesPlugin onload after loadSettings.");

    // Register a single "panel" view
    this.registerView(VIEW_TYPE_ROUTINES_PANEL, (leaf) => {
      return new RoutinesPanelView(leaf, this);
    });

    this.addCommand({
      id: "open-routines-panel",
      name: "Open Routines Panel",
      callback: () => {
        const leaf = this.app.workspace.getRightLeaf(false);
        if (!leaf) {
          new Notice("No right leaf available for Routines Panel!");
          return;
        }
        leaf.setViewState({
          type: VIEW_TYPE_ROUTINES_PANEL,
          active: true,
        });
        this.app.workspace.revealLeaf(leaf);
      },
    });

    // Register your separate settings tab
    this.addSettingTab(new RoutinesPluginSettingsTab(this.app, this));
  }

  async onunload() {
    this.debugLog("RoutinesPlugin onunload");
  }

  async loadSettings() {
    const data = await this.loadData();
    Object.assign(this.settings, DEFAULT_SETTINGS, data);
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  public debugLog(msg: string) {
    if (this.settings.debugMode) {
      console.log(`[RoutinesPlugin] DEBUG: ${msg}`);
    }
  }

  public createNewRoutine(): RoutineConfig {
    return {
      id: crypto.randomUUID(),
      name: "New Routine",
      templateFilePath: "",
    };
  }
}