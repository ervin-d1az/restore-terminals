export interface TerminalConfig {
  name: string;
  command?: string;
}

export interface ConfigFile {
  terminals: TerminalConfig[];
}
