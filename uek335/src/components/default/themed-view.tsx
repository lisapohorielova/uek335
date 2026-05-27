import { View, type ViewProps } from 'react-native';

import { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Props for {@link ThemedView} (extends React Native `ViewProps`). */
export type ThemedViewProps = ViewProps & {
  /** Explicit background colour for light mode (currently unused). */
  lightColor?: string;
  /** Explicit background colour for dark mode (currently unused). */
  darkColor?: string;
  /** Theme colour role for the background (defaults to `'background'`). */
  type?: ThemeColor;
};

/**
 * View whose background colour comes from the active theme. (Expo starter
 * component.)
 *
 * @param props - See {@link ThemedViewProps}.
 * @returns A themed `<View>`.
 */
export function ThemedView({ style, lightColor, darkColor, type, ...otherProps }: ThemedViewProps) {
  const theme = useTheme();

  return <View style={[{ backgroundColor: theme[type ?? 'background'] }, style]} {...otherProps} />;
}
