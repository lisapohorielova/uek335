/**
 * Central Axios instance and the request/response interceptors that handle
 * authentication for the whole app.
 * @module
 */
import axios from 'axios';
import {router} from 'expo-router';
import {BasePath, LoginEndpoint, RegisterEndpoint} from "@/services/Routes";
import * as SecureStore from 'expo-secure-store';

/**
 * Shared HTTP client pointed at {@link BasePath}. Import this instead of using
 * `axios` directly so every request goes through the auth interceptors below.
 */
export const api = axios.create({
    baseURL: BasePath,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: attach the stored Bearer token to every outgoing request.
api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// When a request comes back unauthorized, the token is missing or expired:
// drop it and send the user back to the login screen. Login/signup requests
// answer 401 for wrong credentials too, so those are handled by their own form.
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;
        const url: string = error.config?.url ?? '';
        const isAuthRequest = url.includes(LoginEndpoint) || url.includes(RegisterEndpoint);

        if ((status === 401 || status === 403) && !isAuthRequest) {
            await SecureStore.deleteItemAsync('accessToken');
            router.replace('/login');
        }

        return Promise.reject(error);
    },
);