import React, { type ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Spacing } from '@/constants/theme';

/** Props for {@link HintRow}. */
type HintRowProps = {
  /** Leading text (defaults to `"Try editing"`). */
  title?: string;
  /** Highlighted code snippet shown on the right. */
  hint?: ReactNode;
};

/**
 * A row pairing a short label with a highlighted code snippet, used on the
 * starter landing screen. (Expo starter component.)
 *
 * @param props - Optional `title` and `hint` (see `HintRowProps`).
 * @returns The hint row.
 */
export function HintRow({ title = 'Try editing', hint = 'app/index.tsx' }: HintRowProps) {
  return (
    <View style={styles.stepRow}>
      <ThemedText type="small">{title}</ThemedText>
      <ThemedView type="backgroundSelected" style={styles.codeSnippet}>
        <ThemedText themeColor="textSecondary">{hint}</ThemedText>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  codeSnippet: {
    borderRadius: Spacing.two,
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.two,
  },
});
