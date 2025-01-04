// src/global.d.ts

declare module "obsidian" {
  export interface App {
    workspace: Workspace;
    vault: Vault;
  }

  export interface Workspace {
    getRightLeaf(create: boolean): WorkspaceLeaf | null;
    revealLeaf(leaf: WorkspaceLeaf): void;
    getLeavesOfType(viewType: string): WorkspaceLeaf[];
  }

  export interface WorkspaceLeaf {
    setViewState(state: any): Promise<void>;
  }

  export interface Vault {
    getAbstractFileByPath(path: string): TAbstractFile | null;
    read(file: TFile): Promise<string>;
  }

  export class TAbstractFile {
    path: string;
    name: string;
  }

  export class TFile extends TAbstractFile {}

  export class Notice {
    constructor(message: string);
  }

  export class Plugin {
    app: App;
    onload(): void;
    onunload(): void;

    registerView(
      viewType: string,
      callback: (leaf: WorkspaceLeaf) => ItemView
    ): void;

    addCommand(options: any): void;
    addSettingTab(tab: PluginSettingTab): void;

    loadData(): Promise<any>;
    saveData(data: any): Promise<void>;
  }

  export class ItemView {
    constructor(leaf: WorkspaceLeaf);
    contentEl: HTMLElement;
    getViewType(): string;
    getDisplayText(): string;
    onOpen(): Promise<void>;
    onClose(): Promise<void>;
    icon?: string;
  }

  export class PluginSettingTab {
    plugin: Plugin;
    app: App;
    containerEl: HTMLElement;
    constructor(app: App, plugin: Plugin);
    display(): void;
  }
}

declare module "*.svelte" {
  const SvelteFile: any;
  export default SvelteFile;
}