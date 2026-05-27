/**
 * Thin wrappers around `expo-secure-store` for the two values the app persists:
 * the auth token and the cached user. Keeping the keys in one place avoids typos.
 * @module
 */
import * as SecureStore from 'expo-secure-store';
import { User } from '@/types/User';

/**
 * Stores the auth token.
 *
 * @param token - The Bearer token returned by the backend.
 */
export const saveToken = async (token: string): Promise<void> => {
    await SecureStore.setItemAsync('accessToken', token);
};

/**
 * Reads the stored auth token.
 *
 * @returns The token, or `null` if the user is not logged in.
 */
export const getToken = async (): Promise<string | null> => {
    return await SecureStore.getItemAsync('accessToken');
};

/**
 * Removes the stored auth token (used on logout / 401).
 */
export const deleteToken = async (): Promise<void> => {
    await SecureStore.deleteItemAsync('accessToken');
};

/**
 * Caches the logged-in user as JSON.
 *
 * @param user - The user to persist.
 */
export const saveUser = async (user: User): Promise<void> => {
    await SecureStore.setItemAsync('user', JSON.stringify(user));
};

/**
 * Reads the cached user.
 *
 * @returns The parsed user, or `null` if none is stored.
 */
export const getStoredUser = async (): Promise<User | null> => {
    const data = await SecureStore.getItemAsync('user');
    return data ? JSON.parse(data) : null;
};
