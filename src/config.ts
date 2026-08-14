import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { ConfigFile, TerminalConfig } from "./types";

const CONFIG_FILENAME: string = ".terminal-restore.json";

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
      `Terminal Restore: Failed to parse ${CONFIG_FILENAME}`
    );
    return null;
  }
}

function readSettings(): TerminalConfig[] {
  const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("terminalRestore");
  const terminals: TerminalConfig[] = config.get<TerminalConfig[]>("terminals", []);
  return terminals;
}

export function resolveConfig(): TerminalConfig[] {
  const fileConfig: ConfigFile | null = readConfigFile();
  if (fileConfig && fileConfig.terminals.length > 0) {
    return fileConfig.terminals;
  }

  return readSettings();
}
