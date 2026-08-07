import { use } from "react";

import { SettingsContext, type SettingsContextType } from "./settings-context";

// ----------------------------------------------------------------------

export function useSettingsContext(): SettingsContextType {
  const context = use(SettingsContext);

  if (!context)
    throw new Error("useSettingsContext must be use inside SettingsProvider");

  return context;
}
