import { NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';

import { Colors } from '@/constants/theme';

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
