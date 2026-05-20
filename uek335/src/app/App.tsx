import * as React from "react";
import { PaperProvider } from "react-native-paper";
import { useFonts } from 'expo-font';
import {
    CormorantGaramond_400Regular,
    CormorantGaramond_700Bold,
} from '@expo-google-fonts/cormorant-garamond';
import {
    Jost_400Regular,
    Jost_600SemiBold,
} from '@expo-google-fonts/jost';
import InfoPage from "@/components/pages/InfoPage";

export default function App() {
    const [fontsLoaded] = useFonts({
        CormorantGaramond_400Regular,
        CormorantGaramond_700Bold,
        Jost_400Regular,
        Jost_600SemiBold,
    });

    if (!fontsLoaded) return null;

    return (
        <PaperProvider>

                <InfoPage />

        </PaperProvider>
    );
}