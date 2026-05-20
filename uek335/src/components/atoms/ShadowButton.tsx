import {Button} from "react-native-paper";
import React from "react";
import {Colors, Fonts} from "@/constants/theme";
import {LinearGradient} from "expo-linear-gradient";

export const ShadowButton = ({text, onPress}: {text: string, onPress: () => void}) => {
    return (
        <LinearGradient
            colors={['#4A4972', '#111827']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ borderRadius: 50 }}
        >
        <Button
            mode="contained"
            onPress={onPress}
            style={{
                backgroundColor: 'transparent',
                borderRadius: 50,
                paddingVertical: 6,
                paddingHorizontal: 8,
                shadowColor: Colors.main.main,
                shadowOffset: { width: 2, height: 5 },
                shadowOpacity: 0.35,
                shadowRadius: 3.84,
                elevation: 5,
            }}
            labelStyle={{
                color: Colors.main.background,
                fontFamily: Fonts.jost,
                fontSize: 16,
            }}
        >
            {text}
        </Button>
            </LinearGradient>
    )
}
