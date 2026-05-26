import React from "react";
import { View, Pressable, StyleSheet, Text } from "react-native";
import { TabTriggerSlotProps, TabListProps } from "expo-router/ui";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Fonts } from "@/constants/theme";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

type TabButtonProps = TabTriggerSlotProps & {
    icon: IoniconName;
    label: string;
    /** The highlighted action tab (ADD) keeps its accent colour regardless of focus. */
    highlight?: boolean;
};

/**
 * A single pill button in the bottom bar. Receives focus/press props from the
 * surrounding <TabTrigger asChild> (see app/(tabs)/_layout.tsx).
 */
export const TabButton = ({ icon, label, highlight, isFocused, ...props }: TabButtonProps) => {
    const backgroundColor = highlight
        ? Colors.main.mid
        : isFocused
            ? Colors.main.main
            : "transparent";
    const tint = highlight || isFocused ? Colors.main.background : Colors.main.light;

    return (
        <Pressable
            {...props}
            style={({ pressed }) => [
                styles.button,
                { backgroundColor },
                pressed && styles.pressed,
            ]}
        >
            <Ionicons name={icon} size={24} color={tint} />
            <Text style={[styles.label, { color: tint }]}>{label}</Text>
        </Pressable>
    );
};

/**
 * Visual container of the custom bottom navigation bar. Used as the
 * `<TabList asChild>` target so the <TabTrigger> children (passed in from
 * app/(tabs)/_layout.tsx) stay discoverable by expo-router as screens.
 */
export const MenuBar = ({ children, style, ...props }: TabListProps) => {
    const insets = useSafeAreaInsets();

    return (
        <View {...props} style={[styles.bar, { bottom: insets.bottom + 10 }, style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    bar: {
        position: "absolute",
        left: 12,
        right: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        padding: 8,
        borderRadius: 28,
        backgroundColor: Colors.main.dark,
        shadowColor: Colors.main.black,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    button: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        borderRadius: 18,
    },
    pressed: {
        opacity: 0.7,
    },
    label: {
        marginTop: 4,
        fontSize: 11,
        letterSpacing: 1,
        fontFamily: Fonts.jostSemiBold,
    },
});
