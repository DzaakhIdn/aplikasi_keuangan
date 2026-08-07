import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { themeConfig, ThemeProvider } from "./theme";

import { ProgressBar } from "./components/progress-bar";
import { Snackbar } from "./components/snackbar";
import { MotionLazy } from "./components/animate/motion-lazy";
import { SettingsProvider } from "./components/settings/context/settings-provider";
import { defaultSettings } from "./components/settings";

import { AuthProvider as SupabaseAuthProvider } from "./auth/context/supabase";

const queryClient = new QueryClient();

export default function App({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <ThemeProvider
          modeStorageKey={themeConfig.modeStorageKey}
          defaultMode={themeConfig.defaultMode}
        >
          <SettingsProvider defaultSettings={defaultSettings}>
            <MotionLazy>
              <Snackbar />
              <ProgressBar />
              {children}
            </MotionLazy>
          </SettingsProvider>
        </ThemeProvider>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  );
}
