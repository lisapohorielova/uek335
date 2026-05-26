import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import {
    CormorantGaramond_400Regular,
    CormorantGaramond_700Bold,
} from '@expo-google-fonts/cormorant-garamond';
import {
    Jost_400Regular,
    Jost_600SemiBold,
} from '@expo-google-fonts/jost';
import React from 'react';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';

import { AnimatedSplashOverlay } from '@/components/default/animated-icon';

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [fontsLoaded] = useFonts({
        CormorantGaramond_400Regular,
        CormorantGaramond_700Bold,
        Jost_400Regular,
        Jost_600SemiBold,
    });

    if (!fontsLoaded) return null;

    return (
        <SafeAreaProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <PaperProvider>
                    <AnimatedSplashOverlay />
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="index" />
                        <Stack.Screen name="(auth)" />
                        <Stack.Screen name="(tabs)" />
                    </Stack>
                </PaperProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}
