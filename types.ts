/* 
 * Property of 0.tk
 * Developed for private use.
 */

export interface MacroSettings {
  selectedKey: string | null;
  selectButton: string | null;
  delay: number;
  useResetMacro: boolean;
  breakPollingRate: boolean;
}

export interface GamepadState {
  connected: boolean;
  id: string;
  buttons: readonly GamepadButton[];
  axes: readonly number[];
}

export enum AppStatus {
  READY = 'Ready',
  RUNNING = 'Running...',
  STOPPED = 'Stopped',
  ERROR = 'Error'
}

export type HelpKey = 'edit' | 'select' | 'delay' | 'reset' | 'turbo';