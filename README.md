# Restore Terminals

Automatically create named terminal tabs when you open a workspace in VS Code or Cursor. Configure per-project via settings or a dedicated config file.

## Features

- **Auto-restore terminals** on workspace open
- **Named tabs** for each terminal
- **Startup commands** — run a command when a terminal is created
- **Per-project config** via `.restore-terminals.json` (takes priority over settings)
- **Commands** to manually create or close all managed terminals

## Configuration

### Option 1: `.restore-terminals.json` (recommended)

Create a `.restore-terminals.json` file in your workspace root:

```json
{
  "terminals": [
    { "name": "dev", "command": "npm run dev" },
    { "name": "tests", "command": "npm test -- --watch" },
    { "name": "git" },
    { "name": "shell" }
  ]
}
```

### Option 2: VS Code Settings

Add to your `settings.json` (workspace or user):

```json
{
  "restoreTerminals.terminals": [
    { "name": "dev", "command": "npm run dev" },
    { "name": "shell" }
  ],
  "restoreTerminals.autoRestore": true
}
```

If both exist, `.restore-terminals.json` takes priority.

## Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `restoreTerminals.terminals` | array | `[]` | List of terminals to create. Each item has a `name` and optional `command`. |
| `restoreTerminals.autoRestore` | boolean | `true` | Automatically restore terminals when the workspace opens. |

## Commands

| Command | Description |
|---------|-------------|
| Restore Terminals: Create All Terminals | Close existing managed terminals and recreate them |
| Restore Terminals: Close All Managed Terminals | Close all terminals created by this extension |

## License

[MIT](LICENSE)
