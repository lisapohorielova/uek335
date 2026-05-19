import * as React from "react";
import { Text } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from 'expo-font';
import {
    CormorantGaramond_400Regular,
    CormorantGaramond_700Bold,
} from '@expo-google-fonts/cormorant-garamond';
import {
    Jost_400Regular,
    Jost_600SemiBold,
} from '@expo-google-fonts/jost';
import {Fonts} from "@/constants/theme";

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
            <SafeAreaView>
                <Text style={{fontFamily: Fonts?.jost}}>Hello World!</Text>
            </SafeAreaView>
        </PaperProvider>
    );
}