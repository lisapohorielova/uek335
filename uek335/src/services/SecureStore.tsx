import * as SecureStore from 'expo-secure-store';
import { User } from '@/types/User';

export const saveToken = async (token: string): Promise<void> => {
    await SecureStore.setItemAsync('accessToken', token);
};

export const getToken = async (): Promise<string | null> => {
    return await SecureStore.getItemAsync('accessToken');
};

export const deleteToken = async (): Promise<void> => {
    await SecureStore.deleteItemAsync('accessToken');
};

export const saveUser = async (user: User): Promise<void> => {
    await SecureStore.setItemAsync('user', JSON.stringify(user));
};

export const getStoredUser = async (): Promise<User | null> => {
    const data = await SecureStore.getItemAsync('user');
    return data ? JSON.parse(data) : null;
};

export const deleteUser = async (): Promise<void> => {
    await SecureStore.deleteItemAsync('user');
};