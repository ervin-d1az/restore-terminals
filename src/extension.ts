import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

interface TerminalConfig {
  name: string;
  command?: string;
}

interface ConfigFile {
  terminals: TerminalConfig[];
}

const CONFIG_FILENAME = ".restore-terminals.json";
const managedTerminals: vscode.Terminal[] = [];

function getWorkspaceRoot(): string | undefined {
  return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
}

function readConfigFile(): ConfigFile | null {
  const root: string | undefined = getWorkspaceRoot();
  if (!root) {
    return null;
  }

  const configPath: string = path.join(root, CONFIG_FILENAME);
  if (!fs.existsSync(configPath)) {
    return null;
  }

  try {
    const raw: string = fs.readFileSync(configPath, "utf-8");
    const parsed: ConfigFile = JSON.parse(raw);

    if (!Array.isArray(parsed.terminals)) {
      return null;
    }

    return parsed;
  } catch {
    vscode.window.showWarningMessage(
      `Restore Terminals: Failed to parse ${CONFIG_FILENAME}`
    );
    return null;
  }
}

function readSettings(): TerminalConfig[] {
  const config: vscode.WorkspaceConfiguration =
    vscode.workspace.getConfiguration("restoreTerminals");
  const terminals: TerminalConfig[] = config.get<TerminalConfig[]>(
    "terminals",
    []
  );
  return terminals;
}

function resolveConfig(): TerminalConfig[] {
  const fileConfig: ConfigFile | null = readConfigFile();
  if (fileConfig && fileConfig.terminals.length > 0) {
    return fileConfig.terminals;
  }

  return readSettings();
}

function createTerminals(configs: TerminalConfig[]): void {
  for (const config of configs) {
    const terminal: vscode.Terminal = vscode.window.createTerminal({
      name: config.name,
    });

    if (config.command) {
      terminal.sendText(config.command);
    }

    managedTerminals.push(terminal);
  }

  if (configs.length > 0) {
    managedTerminals[0].show(false);
  }
}

function closeManaged(): void {
  for (const terminal of managedTerminals) {
    terminal.dispose();
  }
  managedTerminals.length = 0;
}

function restore(): void {
  const configs: TerminalConfig[] = resolveConfig();

  if (configs.length === 0) {
    vscode.window.showInformationMessage(
      `Restore Terminals: No terminals configured. Add them in settings or create a ${CONFIG_FILENAME} file.`
    );
    return;
  }

  createTerminals(configs);
}

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand("restoreTerminals.restore", () => {
      closeManaged();
      restore();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("restoreTerminals.closeAll", () => {
      closeManaged();
    })
  );

  context.subscriptions.push(
    vscode.window.onDidCloseTerminal((closed: vscode.Terminal) => {
      const idx: number = managedTerminals.indexOf(closed);
      if (idx !== -1) {
        managedTerminals.splice(idx, 1);
      }
    })
  );

  const autoRestore: boolean = vscode.workspace
    .getConfiguration("restoreTerminals")
    .get<boolean>("autoRestore", true);

  if (autoRestore) {
    restore();
  }
}

export function deactivate(): void {}
