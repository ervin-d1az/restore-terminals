export interface TerminalConfig {
  name: string;
  command?: string;
  icon?: string;
}

export interface ConfigFile {
  terminals: TerminalConfig[];
}
