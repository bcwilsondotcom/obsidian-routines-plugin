Here’s the updated README.md file for your project:

# Obsidian Routines Plugin

A plugin for [Obsidian](https://obsidian.md) that helps you manage and follow routines directly within your vault. Inspired by tools like Routinery, this plugin offers timers, logging, and step-by-step guidance for your routines.

## Features

- **Routine Creation**: Define multiple routines (e.g., Morning, Workout) with customizable steps.
- **Timer with Visual Feedback**: A circular timer tracks progress for the current step and total routine time.
- **Routine Logging**:
  - Log routine progress to Markdown files or integrate with periodic notes.
  - Include details like planned time, actual time, and skipped steps.
- **Obsidian Integration**:
  - Store routines as Markdown files.
  - Use Obsidian's Templater plugin for dynamic routine templates.
- **Debug Mode**: Enable debug logs for troubleshooting.

## Installation

1. Download the latest release from the [Releases](https://github.com/your-repo-name/releases) page.
2. Copy the `dist` folder into your Obsidian vault under `.obsidian/plugins/obsidian-routines-plugin/`.
3. Enable the plugin in Obsidian under **Settings → Community Plugins**.

## Usage

### 1. Create a Routine
1. Go to the plugin's settings (**Settings → Obsidian Routines Plugin**).
2. Click "Add Routine" and configure the following:
   - **Routine Name**: Name of the routine.
   - **Template Path**: Path to the Markdown file containing routine steps.
   - **Routine Log**: Choose how logs are stored:
     - None: No logging.
     - File: Logs to a specified Markdown file.
     - Periodic: Logs into periodic notes (daily, weekly, etc.).
   - **Log File Template**: For file-based logs, specify a path like `Routine Logs/<RoutineName> YYYY-MM-DD.md`.

### 2. Define Steps in the Routine Template
Example template (`Templates/Routines/Morning.md`):
```markdown
- [ ] Make bed - 00:10:00
- [ ] Stretch - 00:05:00
- [ ] Meditate - 00:15:00

3. Start a Routine
	1.	Open the Routines Panel using the command palette (Cmd/Ctrl + P) or the ribbon icon.
	2.	Select a routine and click the “Start” button.

4. Log Your Progress
	•	Logs include:
	•	Steps with planned time, actual time, and skipped status.
	•	Statistics like total planned vs. actual time.
	•	Logs are automatically saved to the specified file or periodic note.

Configuration

Settings
	•	Routines: Manage routines with settings for name, template, and logging.
	•	Debug Mode: Logs additional details to the console for debugging.

File Logging

Logged files contain:

# Routine Name
## Date and Time

- [x] Make bed - Planned: 00:10:00 - Actual: 00:09:30
- [x] Stretch - Planned: 00:05:00 - Actual: 00:05:10
- [ ] Meditate - Planned: 00:15:00 - Actual: Incomplete

### Statistics
- Total Planned: 00:30:00
- Total Actual: 00:14:40

Roadmap
	•	Add logging to periodic notes.
	•	Visual improvements to the timer panel.
	•	Export and import routine configurations.
	•	Integration with Templater variables.

Contributing
	1.	Fork the repository.
	2.	Create a new branch for your feature or bugfix.
	3.	Submit a pull request.

License

MIT License © 2025 Brandon Wilson
