import * as React from "react";
import { Text } from "react-native";
import { PaperProvider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
export default function App() {
    return (
        <PaperProvider>
            <SafeAreaView>
                <Text>Hello World!</Text>
            </SafeAreaView>
        </PaperProvider>
    );
}