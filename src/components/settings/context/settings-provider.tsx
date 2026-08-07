import { isEqual } from 'es-toolkit';
import { getCookie, getStorage } from 'minimal-shared/utils';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { useCookies, useLocalStorage } from 'minimal-shared/hooks';

import { SettingsContext, type SettingsState } from './settings-context';
import { SETTINGS_STORAGE_KEY } from '../settings-config';

// ----------------------------------------------------------------------

interface SettingsProviderProps {
  children: React.ReactNode;
  cookieSettings?: SettingsState;
  defaultSettings: SettingsState;
  storageKey?: string;
}

export function SettingsProvider({
  children,
  cookieSettings,
  defaultSettings,
  storageKey = SETTINGS_STORAGE_KEY,
}: SettingsProviderProps) {
  const isCookieEnabled = !!cookieSettings;
  const useStorage = isCookieEnabled ? useCookies : useLocalStorage;
  const initialSettings = isCookieEnabled ? cookieSettings : defaultSettings;
  const getStorageValue = isCookieEnabled ? getCookie : getStorage;

  const { state, setState, resetState, setField } = useStorage<SettingsState>(storageKey, initialSettings);

  const [openDrawer, setOpenDrawer] = useState(false);

  const onToggleDrawer = useCallback(() => {
    setOpenDrawer((prev) => !prev);
  }, []);

  const onCloseDrawer = useCallback(() => {
    setOpenDrawer(false);
  }, []);

  const canReset = !isEqual(state, defaultSettings);

  const onReset = useCallback(() => {
    resetState(defaultSettings);
  }, [defaultSettings, resetState]);

  // Version check and reset handling
  useEffect(() => {
    const storedValue = getStorageValue(storageKey) as Record<string, unknown> | null;

    if (storedValue) {
      try {
        const defaultVersion = (defaultSettings as unknown as Record<string, unknown>).version;
        if (!storedValue.version || storedValue.version !== defaultVersion) {
          onReset();
        }
      } catch {
        onReset();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const memoizedValue = useMemo(
    () => ({
      canReset,
      onReset,
      openDrawer,
      onCloseDrawer,
      onToggleDrawer,
      state,
      setState,
      setField,
    }),
    [canReset, onReset, openDrawer, onCloseDrawer, onToggleDrawer, state, setField, setState]
  );

  return <SettingsContext.Provider value={memoizedValue}>{children}</SettingsContext.Provider>;
}
