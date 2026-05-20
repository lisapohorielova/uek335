import {View} from "react-native";
import React from "react";
import {Colors} from "@/constants/theme";
import { Fonts} from "@/constants/theme";


export default function FirstViewTmpl() {
    return (
        <View style={styles.container}>
            FirstViewTmpl
        </View>
    );
}

const styles = {
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.main.background,
    },
};