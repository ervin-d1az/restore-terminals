import * as vscode from "vscode";
import { TerminalConfig } from "./types";

const managedTerminals: vscode.Terminal[] = [];
const SHELL_INTEGRATION_TIMEOUT_MS: number = 3000;

function waitForShellReady(
  terminal: vscode.Terminal
): Promise<vscode.TerminalShellIntegration | undefined> {
  if (terminal.shellIntegration) {
    return Promise.resolve(terminal.shellIntegration);
  }

  return new Promise<vscode.TerminalShellIntegration | undefined>((resolve) => {
    let settled: boolean = false;

    const finish = (integration: vscode.TerminalShellIntegration | undefined): void => {
      if (settled) {
        return;
      }
      settled = true;
      disposable.dispose();
      clearTimeout(timer);
      resolve(integration);
    };

    const disposable: vscode.Disposable = vscode.window.onDidChangeTerminalShellIntegration(
      (event: vscode.TerminalShellIntegrationChangeEvent) => {
        if (event.terminal === terminal) {
          finish(event.shellIntegration);
        }
      }
    );

    const timer: NodeJS.Timeout = setTimeout(async () => {
      try {
        await terminal.processId;
      } catch {
        // best-effort fallback
      }
      finish(undefined);
    }, SHELL_INTEGRATION_TIMEOUT_MS);
  });
}

async function runCommand(terminal: vscode.Terminal, command: string): Promise<void> {
  const integration: vscode.TerminalShellIntegration | undefined =
    await waitForShellReady(terminal);

  if (integration) {
    integration.executeCommand(command);
  } else {
    terminal.sendText(command);
  }
}

export async function createTerminals(configs: TerminalConfig[]): Promise<void> {
  for (const config of configs) {
    const options: vscode.TerminalOptions = { name: config.name };

    if (config.icon) {
      const iconColor: vscode.ThemeColor | undefined = config.color
        ? new vscode.ThemeColor(config.color)
        : undefined;
      options.iconPath = new vscode.ThemeIcon(config.icon, iconColor) as unknown as vscode.Uri;
    }

    if (config.color) {
      options.color = new vscode.ThemeColor(config.color);
    }

    const terminal: vscode.Terminal = vscode.window.createTerminal(options);
    managedTerminals.push(terminal);

    if (config.command) {
      await runCommand(terminal, config.command);
    }
  }

  if (configs.length > 0) {
    managedTerminals[0].show(false);
  }
}

export function closeByName(names: Set<string>): void {
  for (const terminal of vscode.window.terminals) {
    if (terminal.name && names.has(terminal.name)) {
      terminal.dispose();
    }
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
