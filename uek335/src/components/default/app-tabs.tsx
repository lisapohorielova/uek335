import { NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';

import { Colors } from '@/constants/theme';

/**
 * Native tab bar using expo-router's `NativeTabs`. (Expo starter component;
 * the app's own tab bar lives in `app/(tabs)/_layout.tsx`.)
 *
 * @returns The native tab navigator.
 */
export default function AppTabs() {
  return (
    <NativeTabs
      labelStyle={{ selected: { color: Colors.main.main } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
              src={require('@/assets/images/tabIcons/home.png')}
              renderingMode="template"
              selectedColor={Colors.main.background}
          />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
