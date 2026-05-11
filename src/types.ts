export interface TerminalConfig {
  name: string;
  command?: string;
  icon?: string;
  color?: string;
}

export interface ConfigFile {
  terminals: TerminalConfig[];
}
