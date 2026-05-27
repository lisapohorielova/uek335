/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

/**
 * App colour palette. `light`/`dark` drive the themed components, while `main`
 * holds the BookCrux brand colours used across the custom screens.
 */
export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
  main: {
    white: '#ffffff',
    background: '#F1DAC4',
    light: '#A69CAC',
    mid: '#474973',
    main: '#161B33',
    dark: '#0D0C1D',
    black: '#000000',
  },
} as const;

/** Names of the colour roles shared by both the light and dark theme. */
export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/**
 * Platform-specific font family names. The custom Cormorant/Jost families are
 * the same everywhere; the system fonts differ per platform.
 */
export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
    cormorant: 'CormorantGaramond_400Regular',
    cormorantBold: 'CormorantGaramond_700Bold',
    jost: 'Jost_400Regular',
    jostSemiBold: 'Jost_600SemiBold',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
    cormorant: 'CormorantGaramond_400Regular',
    cormorantBold: 'CormorantGaramond_700Bold',
    jost: 'Jost_400Regular',
    jostSemiBold: 'Jost_600SemiBold',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
    cormorant: 'CormorantGaramond_400Regular',
    cormorantBold: 'CormorantGaramond_700Bold',
    jost: 'Jost_400Regular',
    jostSemiBold: 'Jost_600SemiBold',
  },
});

/** Spacing scale (in px) used for padding, margins and gaps. */
export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

/** Extra bottom inset reserved for the tab bar, per platform. */
export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
/** Maximum content width (px) used to keep wide/web layouts readable. */
export const MaxContentWidth = 800;
