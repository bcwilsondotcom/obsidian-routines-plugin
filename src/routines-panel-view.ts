// src/routines-panel-view.ts

import { ItemView, WorkspaceLeaf } from "obsidian";

import RoutinesPanel from "./svelte/RoutinesPanel.svelte";
import type RoutinesPlugin from "./main";

export const VIEW_TYPE_ROUTINES_PANEL = "routines-panel-view";

export class RoutinesPanelView extends ItemView {
  private plugin: RoutinesPlugin;
  private component: any = null;

  constructor(leaf: WorkspaceLeaf, plugin: RoutinesPlugin) {
    super(leaf);
    this.plugin = plugin;
    this.icon = "clock";
  }

  getViewType(): string {
    return VIEW_TYPE_ROUTINES_PANEL;
  }

  getDisplayText(): string {
    return "Routines Panel";
  }

  async onOpen(): Promise<void> {
    this.plugin.debugLog("RoutinesPanelView -> onOpen");
    this.contentEl.innerHTML = "";

    // We'll mount a single Svelte component for the UI
    this.component = new RoutinesPanel({
      target: this.contentEl,
      props: {
        plugin: this.plugin,
      },
    });
  }

  async onClose(): Promise<void> {
    this.plugin.debugLog("RoutinesPanelView -> onClose");
    if (this.component) {
      this.component.$destroy();
      this.component = null;
    }
  }
}