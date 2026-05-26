import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, PanResponder, LayoutChangeEvent } from "react-native";
import { Colors, Fonts } from "@/constants/theme";

const THUMB = 26;

type Props = {
    min: number;
    max: number;
    low: number;
    high: number;
    /** Fired continuously while dragging with the new [low, high] pair. */
    onChange: (low: number, high: number) => void;
    label?: string;
};

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

/**
 * Two-handle range slider (see the PAGES design). Built on the core PanResponder
 * so it works on native and web without GestureHandlerRootView setup.
 */
export function RangeSlider({ min, max, low, high, onChange, label = "PAGES" }: Props) {
    const [trackW, setTrackW] = useState(0);
    const usable = Math.max(trackW - THUMB, 1);
    const range = Math.max(max - min, 1);

    const toPx = (v: number) => ((clamp(v, min, max) - min) / range) * usable;

    // Refs let the (once-created) PanResponder read the latest props each move.
    const refs = useRef({ min, max, range, usable, low, high, onChange });
    refs.current = { min, max, range, usable, low, high, onChange };

    const drag = useRef<{ active: "low" | "high"; startVal: number }>({ active: "low", startVal: 0 });

    const responder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (e) => {
                const r = refs.current;
                const x = e.nativeEvent.locationX - THUMB / 2;
                const touchVal = (x / r.usable) * r.range + r.min;
                const active = Math.abs(touchVal - r.low) <= Math.abs(touchVal - r.high) ? "low" : "high";
                drag.current = { active, startVal: active === "low" ? r.low : r.high };
            },
            onPanResponderMove: (_e, g) => {
                const r = refs.current;
                const deltaVal = Math.round((g.dx / r.usable) * r.range);
                let v = clamp(drag.current.startVal + deltaVal, r.min, r.max);
                if (drag.current.active === "low") {
                    r.onChange(Math.min(v, r.high), r.high);
                } else {
                    r.onChange(r.low, Math.max(v, r.low));
                }
            },
        })
    ).current;

    const onLayout = (e: LayoutChangeEvent) => setTrackW(e.nativeEvent.layout.width);

    const lowPx = toPx(low);
    const highPx = toPx(high);

    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.readout}>{low} – {high}</Text>
            </View>

            <View style={styles.track} onLayout={onLayout} {...responder.panHandlers}>
                {/* inactive rail */}
                <View style={styles.rail} />
                {/* active segment between the two thumbs */}
                <View
                    style={[
                        styles.railActive,
                        { left: lowPx + THUMB / 2, width: Math.max(highPx - lowPx, 0) },
                    ]}
                />
                <View style={[styles.thumb, { left: lowPx }]} />
                <View style={[styles.thumb, { left: highPx }]} />
            </View>

            <View style={styles.boundsRow}>
                <Text style={styles.bound}>{min}</Text>
                <Text style={styles.bound}>{max}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.main.main,
        borderRadius: 22,
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        letterSpacing: 3,
        color: Colors.main.light,
        fontFamily: Fonts.jostSemiBold,
    },
    readout: {
        fontSize: 14,
        color: Colors.main.background,
        fontFamily: Fonts.jostSemiBold,
    },
    track: {
        height: THUMB,
        justifyContent: "center",
    },
    rail: {
        height: 4,
        borderRadius: 2,
        marginHorizontal: THUMB / 2,
        backgroundColor: Colors.main.mid,
    },
    railActive: {
        position: "absolute",
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.main.background,
    },
    thumb: {
        position: "absolute",
        width: THUMB,
        height: THUMB,
        borderRadius: THUMB / 2,
        backgroundColor: Colors.main.background,
        borderWidth: 3,
        borderColor: Colors.main.mid,
    },
    boundsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 2,
    },
    bound: {
        fontSize: 13,
        color: Colors.main.light,
        fontFamily: Fonts.jost,
    },
});
