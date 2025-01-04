# Obsidian Routines Plugin

A plugin for [Obsidian](https://obsidian.md) that helps you manage and follow routines directly within your vault. Inspired by tools like Routinery, this plugin offers timers, logging, and step-by-step guidance for your routines.

## Features Implemented

- **Routine Creation**: Define multiple routines (e.g., Morning, Evening) with customizable steps.
- Store routines as Markdown files inside the vault.
- **Timer with Visual Feedback**: A circular timer tracks progress for the current step and total routine time.
- **Debug Mode**: Enable debug logs for troubleshooting.

## Feature ToDo List
**Routine Logging**:
  - Log routine progress to Markdown files
  - Integrate with Periodic Notes (write logs to daily notes, weekly notes, etc.)
  - Include details like planned time, actual time, and skipped steps.

**Templater**:
  - Integrate with Templater for dynamic routine templates.

## Installation

1. Download the latest release from the [Releases](https://github.com/your-repo-name/releases) page.
2. Copy the files into your Obsidian vault under `.obsidian/plugins/obsidian-routines-plugin/`.
3. Enable the plugin in Obsidian under **Settings → Community Plugins**.

Note that this plugin is still very new and I haven't submitted it to the official list yet. Planning to do that once I get the logging implemented the way I want.

## Usage

### 1. Create a Routine
1. Go to the plugin's settings (**Settings → Obsidian Routines Plugin**).
2. Click "Add Routine" and configure the following:
   - **Routine Name**: Name of the routine.
   - **Template Path**: Path to the Markdown file containing routine steps.
   - **Routine Log**: Choose how logs are stored:
     - None: No logging.
     - File: Logs to a specified Markdown file. (Does not currently work)
     - Periodic: Logs into periodic notes (daily, weekly, etc.). (Does not currently work)
   - **Log File Template**: For file-based logs, specify a path like `Routine Logs/<RoutineName> YYYY-MM-DD.md`.

### 2. Define Steps in the Routine Template

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
	1.	Open the Routines Panel using the command palette (Cmd/Ctrl + P) or the ribbon icon.
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
