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
    containerEl: HTMLElementWithObsidianMethods;
    constructor(app: App, plugin: Plugin);
    display(): void;
  }

  export interface HTMLElementWithObsidianMethods extends HTMLElement {
    empty(): void;
    createEl<K extends keyof HTMLElementTagNameMap>(
      tagName: K,
      options?: { text?: string; cls?: string }
    ): HTMLElementTagNameMap[K];
    createDiv(cls?: string): HTMLDivElement;
  }

  export class Setting {
    constructor(containerEl: HTMLElementWithObsidianMethods);
    setName(name: string): this;
    setDesc(desc: string): this;
    addText(callback: (text: TextComponent) => void): this;
    addToggle(callback: (toggle: ToggleComponent) => void): this;
    addButton(callback: (button: ButtonComponent) => void): this;
    addExtraButton(callback: (button: ExtraButtonComponent) => void): this;
    addDropdown(callback: (dropdown: DropdownComponent) => void): this;
  }

  export class TextComponent {
    setPlaceholder(placeholder: string): this;
    setValue(value: string): this;
    onChange(callback: (value: string) => void): this;
  }

  export class ToggleComponent {
    setValue(value: boolean): this;
    onChange(callback: (value: boolean) => void): this;
  }

  export class ButtonComponent {
    setButtonText(text: string): this;
    setCta(): this;
    onClick(callback: () => void): this;
  }

  export class ExtraButtonComponent {
    setIcon(icon: string): this;
    setTooltip(tooltip: string): this;
    onClick(callback: () => void): this;
  }

  export class DropdownComponent {
    addOption(value: string, display: string): this;
    setValue(value: string): this;
    onChange(callback: (value: string) => void): this;
  }
}

declare module "*.svelte" {
  const SvelteFile: any;
  export default SvelteFile;
}
