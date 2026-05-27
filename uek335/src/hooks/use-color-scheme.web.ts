import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * Web version of the `use-color-scheme.ts` hook.
 *
 * To support static rendering the colour scheme must be recalculated on the
 * client: it returns `'light'` until the component has hydrated, then the real
 * OS colour scheme.
 *
 * @returns The current colour scheme (`'light'` before hydration).
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}
