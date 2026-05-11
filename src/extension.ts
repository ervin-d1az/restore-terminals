import * as vscode from "vscode";
import { TerminalConfig } from "./types";
import { resolveConfig } from "./config";
import { createTerminals, closeManaged, closeAll, removeClosed } from "./terminal-manager";

const CONFIG_FILENAME: string = ".restore-terminals.json";

async function restore(): Promise<void> {
  const configs: TerminalConfig[] = resolveConfig();

  if (configs.length === 0) {
    vscode.window.showInformationMessage(
      `Restore Terminals: No terminals configured. Add them in settings or create a ${CONFIG_FILENAME} file.`
    );
    return;
  }

  await createTerminals(configs);
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
      removeClosed(closed);
    })
  );

  const autoRestore: boolean = vscode.workspace
    .getConfiguration("restoreTerminals")
    .get<boolean>("autoRestore", true);

  if (autoRestore) {
    vscode.commands.executeCommand("workbench.action.closePanel").then(() => {
      closeAll();
      restore();
    });
  }
}

export function deactivate(): void {}
