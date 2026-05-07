import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { ConfigFile, TerminalConfig } from "./types";

const CONFIG_FILENAME = ".restore-terminals.json";

function getWorkspaceRoot(): string | undefined {
  return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
}

function readConfigFile(): ConfigFile | null {
  const root = getWorkspaceRoot();
  if (!root) {
    return null;
  }

  const configPath = path.join(root, CONFIG_FILENAME);
  if (!fs.existsSync(configPath)) {
    return null;
  }

  try {
    const raw = fs.readFileSync(configPath, "utf-8");
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
  const config = vscode.workspace.getConfiguration("restoreTerminals");
  return config.get<TerminalConfig[]>("terminals", []);
}

export function resolveConfig(): TerminalConfig[] {
  const fileConfig = readConfigFile();
  if (fileConfig && fileConfig.terminals.length > 0) {
    return fileConfig.terminals;
  }

  return readSettings();
}
