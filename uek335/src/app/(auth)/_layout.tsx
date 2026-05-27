import { Stack } from "expo-router";

/**
 * Layout for the auth section (`login`, `register`). A header-less stack.
 *
 * @returns The auth stack navigator.
 */
export default function AuthLayout() {
    return <Stack screenOptions={{ headerShown: false }} />;
}
