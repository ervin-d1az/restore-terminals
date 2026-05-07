import * as vscode from "vscode";
import { resolveConfig } from "./config";
import { createTerminals, closeManaged, removeClosed } from "./terminal-manager";

const CONFIG_FILENAME = ".restore-terminals.json";

function restore(): void {
  const configs = resolveConfig();

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
    vscode.window.onDidCloseTerminal((closed) => {
      removeClosed(closed);
    })
  );

  const autoRestore = vscode.workspace
    .getConfiguration("restoreTerminals")
    .get<boolean>("autoRestore", true);

  if (autoRestore) {
    restore();
  }
}

export function deactivate(): void {}
