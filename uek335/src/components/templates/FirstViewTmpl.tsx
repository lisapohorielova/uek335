import {StyleSheet, View} from "react-native";
import React from "react";
import {Colors} from "@/constants/theme";
import { Fonts} from "@/constants/theme";
import { Text } from "react-native-paper";
import {LinearGradient} from "expo-linear-gradient";
import {ShadowButton} from "@/components/atoms/ShadowButton";
import {OutlinedButton} from "@/components/atoms/OutlinedButton";


export default function FirstViewTmpl() {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#4A4972', Colors.main.dark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
            <View style={styles.header}>
                <Text style={styles.textJost}>BOOK CRUX</Text>
                <Text style={styles.textCormorant}>Welcome</Text>
            </View>
                </LinearGradient>

            <View style={styles.buttonContainer}>
                <ShadowButton text={"SIGN IN"} onPress={() => {}} />
                <OutlinedButton text={"SIGN UP"} onPress={() => {}}/>
            </View>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.main.background,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 50

    },
    header:{
        height: 200,
        width: '100%',
        borderRadius: 22,
        marginTop: 70,
        display: 'flex',
        flexDirection: 'column',
        shadowColor: Colors.main.main,
        shadowOffset: { width: 2, height: 5 },
        shadowOpacity: 0.35,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonContainer: {
        justifyContent: 'center',
        marginTop: 20,
        backgroundColor: Colors.main.main,
        height: 350,
        width: "100%",
        borderRadius: 22,
        padding: 50,
        shadowColor: Colors.main.main,
        shadowOffset: { width: 2, height: 5 },
        shadowOpacity: 0.35,
        shadowRadius: 3.84,
        elevation: 5,
        gap: 20
    },
    textCormorant: {
        fontSize: 32,
        color: Colors.main.background,
        fontFamily: Fonts.cormorantBold,
        marginLeft: 30,
    },
    textJost: {
        fontSize: 16,
        color: Colors.main.light,
        fontFamily: Fonts.jostSemiBold,
        marginLeft: 30

    },

});