# Obsidian Routines Plugin

A plugin for [Obsidian](https://obsidian.md) that helps you manage and follow routines directly within your vault. This plugin offers timers, logging, and step-by-step guidance for your routines.

## Features Implemented

- **Routine Creation**: Define multiple routines (e.g., Morning, Evening) with customizable steps.
- Store routines as Markdown files inside the vault.
- **Timer with Visual Feedback**: A circular timer tracks progress for the current step and total routine time.
- **Debug Mode**: Enable debug logs for troubleshooting.

## Feature To-Do List
**Routine Logging**:
  - Log routine progress to Markdown files
  - Integrate with Periodic Notes (write logs to daily notes, weekly notes, etc.)
  - Include details like planned time, actual time, and skipped steps.

**Templater**:
  - Integrate with Templater for dynamic routine templates.

## Installation

1. Download the latest release from the [Releases](https://github.com/bcwilsondotcom/obsidian-routines-plugin/releases) page.
2. Copy the main.js and manifest.json files into your Obsidian vault under `.obsidian/plugins/obsidian-routines-plugin/`.
3. Enable the plugin in Obsidian under **Settings → Community Plugins**.

Note that this plugin is still very new and I haven't submitted it to the official list yet. Planning to do that once I get logging implemented.

## Usage

### 1. Create a Routine
1. Go to the plugin's settings (**Settings → Obsidian Routines Plugin**).
2. Click "Add" and configure the following:
   - **Routine Name**: Name of the routine.
   - **Routine File Location**: Path to the Markdown file containing routine steps.

### 2. Define Steps in the Routine File

Routine files are added as tasks with the following format.

```markdown
- [ ] Step name - HH:MM:SS
```

Example routine (`Templates/Routines/Morning.md`):
```markdown
- [ ] Make bed - 00:10:00
- [ ] Stretch - 00:05:00
- [ ] Meditate - 00:15:00
```

3. Start a Routine
	1.	Open the Routines Panel using the command palette (Cmd/Ctrl + P).
	2.	Select a routine and click the “Start” button.

## Contributing
	1.	Fork the repository.
	2.	Create a new branch for your feature or bugfix.
	3.	Submit a pull request.

## Enjoy the plugin?
Help me focus on future development.
https://buymeacoffee.com/bcwilsondotcom

## License
MIT License © 2025 Brandon Wilson
