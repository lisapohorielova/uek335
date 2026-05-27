import {Button} from "react-native-paper";
import React from "react";
import {Colors, Fonts} from "@/constants/theme";

/**
 * Secondary button with a solid fill and a contrasting outline, used e.g. for
 * the "Sign Up" action.
 *
 * @param props - Component props.
 * @param props.text - The button label.
 * @param props.onPress - Called when the button is pressed.
 * @returns A styled outlined button.
 */
export const OutlinedButton = ({text, onPress}: {text: string, onPress: () => void}) => {
    return (
            <Button
                mode="contained"
                onPress={onPress}
                style={{
                    backgroundColor: Colors.main.main,
                    borderRadius: 50,
                    borderWidth: 2,
                    borderColor: Colors.main.background,
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
    )
}
