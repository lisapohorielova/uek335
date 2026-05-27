import React from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Colors, Fonts} from "@/constants/theme";
import { Text } from "react-native-paper";
import { ShadowButton } from "@/components/atoms/ShadowButton";
import {router} from "expo-router";

/**
 * Landing/info screen: shows the BookCrux branding and a "Get Started" button
 * that navigates to the search/library screen.
 *
 * @returns The info screen.
 */
export default function InfoPageTmpl() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/Frame 22.png")}
        style={styles.image}
        contentFit="contain"
      />
        <Text style={styles.header}>BookCrux</Text>
        <Text style={styles.header}>Library</Text>
        <Text style={styles.textContent}>
          Welcome to BookCrux Library - your personal gateway to knowledge and imagination.
          {'\n\n'}
          Discover thousands of books across all genres.</Text>
      <View style={{ marginTop: 20 }}>
        <ShadowButton text="GET STARTED" onPress={() => router.push("/search")} />
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  container: { alignItems: "center", backgroundColor: Colors.main.background, height: "100%", padding: 20  },
  image: { width: 400, height: 300, resizeMode: "contain", marginTop: 80 },
    header: { fontSize: 46, fontFamily: Fonts?.cormorantBold, shadowColor: Colors.main.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5},
    textContent: { fontSize: 16, fontFamily: Fonts?.jost, marginTop: 20, textAlign: 'center', lineHeight: 24, marginHorizontal: 10 },
});