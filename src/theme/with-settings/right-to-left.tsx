import { useEffect, type ReactNode } from 'react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';

import type { ThemeDirection } from '@/theme/theme-config';

// ----------------------------------------------------------------------

const cacheRtl = createCache({
  key: 'rtl',
  prepend: true,
  stylisPlugins: [rtlPlugin],
});

export interface RtlProps {
  children?: ReactNode;
  direction: ThemeDirection;
}

export function Rtl({ children, direction }: RtlProps) {
  useEffect(() => {
    document.dir = direction;
  }, [direction]);

  if (direction === 'rtl') {
    return <CacheProvider value={cacheRtl}>{children}</CacheProvider>;
  }

  return <>{children}</>;
}
