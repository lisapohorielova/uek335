import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import React from 'react';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/default/animated-icon';
import AppTabs from '@/components/default/app-tabs';
import { PaperProvider} from "react-native-paper";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <PaperProvider>
      <AnimatedSplashOverlay />
      <AppTabs />
        </PaperProvider>
    </ThemeProvider>
  );
}
