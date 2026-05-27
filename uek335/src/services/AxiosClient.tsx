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
/**
 * Axios request interceptor — automatically attaches the JWT access token
 * to every outgoing request if one is present in SecureStore.
 *
 * @param config - The Axios request config
 * @returns The modified config with the Authorization header set
 */
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