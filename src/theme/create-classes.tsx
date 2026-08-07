import { themeConfig } from '@/theme/theme-config';

// ----------------------------------------------------------------------

export function createClasses(className: string): string {
  return `${themeConfig.classesPrefix}__${className}`;
}
