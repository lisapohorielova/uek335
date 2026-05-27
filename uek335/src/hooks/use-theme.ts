/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Returns the active colour set ({@link Colors.light} or {@link Colors.dark})
 * for the current OS colour scheme, defaulting to light when unspecified.
 *
 * @returns The colour palette for the current theme.
 */
export function useTheme() {
  const scheme = useColorScheme();
  const theme = scheme === 'unspecified' ? 'light' : scheme;

  return Colors[theme];
}
