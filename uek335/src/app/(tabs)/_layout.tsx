import React from "react";
import { Tabs, TabSlot, TabList, TabTrigger } from "expo-router/ui";

import { MenuBar, TabButton } from "@/components/molecules/MenuBar";

export default function TabsLayout() {
    return (
        <Tabs>
            <TabSlot />
            <TabList asChild>
                <MenuBar>
                    <TabTrigger name="home" href="/home" asChild>
                        <TabButton icon="home-outline" label="HOME" />
                    </TabTrigger>
                    <TabTrigger name="search" href="/search" asChild>
                        <TabButton icon="search-outline" label="SEARCH" />
                    </TabTrigger>
                    <TabTrigger name="profile" href="/profile" asChild>
                        <TabButton icon="person-outline" label="PROFILE" />
                    </TabTrigger>
                    <TabTrigger name="add" href="/add" asChild>
                        <TabButton icon="add" label="ADD" highlight />
                    </TabTrigger>
                </MenuBar>
            </TabList>
        </Tabs>
    );
}
