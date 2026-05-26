import { View, Text, StyleSheet } from "react-native";
import { Colors, Fonts } from "@/constants/theme";

export default function Profile() {
    return (
        <View style={styles.screen}>
            <Text style={styles.label}>Profile</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.main.background,
    },
    label: {
        fontSize: 40,
        color: Colors.main.main,
        fontFamily: Fonts.cormorantBold,
    },
});
