# Changelog

## [0.1.0] - 2026-08-13

### Added

- Auto-create named terminal tabs on workspace open
- Optional startup command per terminal
- Terminal tab icons via codicons (`icon` property)
- Terminal icon colors via theme colors (`color` property)
- Shell-ready detection — waits for shell initialization before sending commands (shell integration with `processId` fallback)
- Configuration via VS Code `settings.json` (`terminalRestore.terminals`)
- Configuration via `.terminal-restore.json` file (takes priority over settings)
- `autoRestore` setting to disable automatic terminal creation
- Command: "Terminal Restore: Create All Terminals"
- Command: "Terminal Restore: Close All Managed Terminals"

### Fixed

- Close persisted terminals before auto-restore to prevent duplicates
- Hide the terminal panel during restore to prevent flicker
