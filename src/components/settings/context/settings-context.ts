"use client";

import { createContext } from "react";

// ----------------------------------------------------------------------

export interface SettingsState {
  colorScheme: string;
  direction: string;
  contrast: string;
  navLayout: string;
  primaryColor: string;
  navColor: string;
  compactLayout: boolean;
  fontSize: number;
  fontFamily: string;
}

export interface SettingsContextType {
  state: SettingsState;
  setState: (newState: Partial<SettingsState>) => void;
  setField: (
    field: keyof SettingsState,
    value: SettingsState[keyof SettingsState]
  ) => void;
  canReset: boolean;
  onReset: () => void;
  openDrawer: boolean;
  onCloseDrawer: () => void;
  onToggleDrawer: () => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);
