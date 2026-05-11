# Restore Terminals

Automatically create named terminal tabs when you open a workspace in VS Code or Cursor. Configure per-project via settings or a dedicated config file.

## Features

- **Auto-restore terminals** on workspace open
- **Named tabs** for each terminal
- **Startup commands** — run a command when a terminal is created
- **Icons and colors** — customize terminal tabs with [codicons](https://microsoft.github.io/vscode-codicons/dist/codicon.html) and theme colors
- **Shell-ready detection** — waits for the shell to fully initialize before running commands (uses shell integration with `processId` fallback)
- **Per-project config** via `.restore-terminals.json` (takes priority over settings)
- **Commands** to manually create or close all managed terminals

## Configuration

### Option 1: `.restore-terminals.json` (recommended)

Create a `.restore-terminals.json` file in your workspace root:

```json
{
  "terminals": [
    { "name": "dev", "command": "npm run dev", "icon": "play", "color": "terminal.ansiGreen" },
    { "name": "tests", "command": "npm test -- --watch", "icon": "beaker" },
    { "name": "deploy", "icon": "rocket", "color": "terminal.ansiRed" },
    { "name": "git", "icon": "git-merge", "color": "terminal.ansiMagenta" },
    { "name": "shell" }
  ]
}
```

### Option 2: VS Code Settings

Add to your `settings.json` (workspace or user):

```json
{
  "restoreTerminals.terminals": [
    { "name": "dev", "command": "npm run dev", "icon": "play", "color": "terminal.ansiGreen" },
    { "name": "shell" }
  ],
  "restoreTerminals.autoRestore": true
}
```

If both exist, `.restore-terminals.json` takes priority.

## Terminal Options

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | yes | Terminal tab name |
| `command` | string | no | Command to run on terminal creation |
| `icon` | string | no | [Codicon](https://microsoft.github.io/vscode-codicons/dist/codicon.html) name (e.g. `terminal-bash`, `rocket`, `hubot`) |
| `color` | string | no | Theme color for the icon (e.g. `terminal.ansiRed`, `terminal.ansiGreen`, `terminal.ansiBlue`) |

## Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `restoreTerminals.terminals` | array | `[]` | List of terminals to create |
| `restoreTerminals.autoRestore` | boolean | `true` | Automatically restore terminals when the workspace opens |

## Commands

| Command | Description |
|---------|-------------|
| Restore Terminals: Create All Terminals | Close existing managed terminals and recreate them |
| Restore Terminals: Close All Managed Terminals | Close all terminals created by this extension |

## License

[MIT](LICENSE)
