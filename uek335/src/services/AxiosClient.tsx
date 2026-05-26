import axios from 'axios';
import {router} from 'expo-router';
import {BasePath, LoginEndpoint, RegisterEndpoint} from "@/services/Routes";
import * as SecureStore from 'expo-secure-store';

export const api = axios.create({
    baseURL: BasePath,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// If the token is missing/expired/invalid, an authenticated request comes back
// 401/403. Drop the stale token and send the user back to the login screen.
// Login/signup are excluded: a wrong password there must not trigger a redirect.
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;
        const url = error.config?.url ?? '';
        const isAuthRequest = url.includes(LoginEndpoint) || url.includes(RegisterEndpoint);

        if ((status === 401 || status === 403) && !isAuthRequest) {
            await SecureStore.deleteItemAsync('accessToken');
            router.replace('/login');
        }

        return Promise.reject(error);
    }
);