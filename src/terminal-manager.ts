import * as vscode from "vscode";
import { TerminalConfig } from "./types";

const managedTerminals: vscode.Terminal[] = [];

export function createTerminals(configs: TerminalConfig[]): void {
  for (const config of configs) {
    const options: vscode.TerminalOptions = { name: config.name };

    if (config.icon) {
      options.iconPath = new vscode.ThemeIcon(config.icon);
    }

    const terminal: vscode.Terminal = vscode.window.createTerminal(options);

    if (config.command) {
      terminal.sendText(config.command);
    }

    managedTerminals.push(terminal);
  }

  if (configs.length > 0) {
    managedTerminals[0].show(false);
  }
}

export function closeManaged(): void {
  for (const terminal of managedTerminals) {
    terminal.dispose();
  }
  managedTerminals.length = 0;
}

export function removeClosed(closed: vscode.Terminal): void {
  const idx: number = managedTerminals.indexOf(closed);
  if (idx !== -1) {
    managedTerminals.splice(idx, 1);
  }
}
