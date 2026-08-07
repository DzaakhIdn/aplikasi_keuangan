import type { ThemeSettings } from '@/theme/with-settings/update-core';

interface CardStyleProps {
  theme: {
    vars: {
      customShadows: { z1: string };
    };
  };
  [key: string]: unknown;
}

type SlotStyles = Record<string, unknown>;
type CardRootSlot = SlotStyles | ((props: CardStyleProps) => SlotStyles);

export interface ThemeComponents {
  MuiCard?: {
    styleOverrides?: { root?: CardRootSlot };
  };
  [key: string]: unknown;
}

function getSlotStyles(slot: CardRootSlot | undefined, props: CardStyleProps): SlotStyles {
  return typeof slot === 'function' ? slot(props) : (slot ?? {});
}

// ----------------------------------------------------------------------

export function updateComponentsWithSettings(
  components: ThemeComponents,
  settingsState: ThemeSettings
) {
  const MuiCard = {
    styleOverrides: {
      root: (props: CardStyleProps) => {
        const { theme } = props;
        const rootStyles = getSlotStyles(components.MuiCard?.styleOverrides?.root, props);

        return {
          ...rootStyles,
          ...(settingsState.contrast === 'hight' && {
            boxShadow: theme.vars.customShadows.z1,
          }),
        };
      },
    },
  };

  const MuiCssBaseline = {
    styleOverrides: {
      html: {
        fontSize: settingsState.fontSize,
      },
    },
  };

  return {
    components: {
      MuiCard,
      MuiCssBaseline,
    },
  };
}
