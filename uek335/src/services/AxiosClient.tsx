import axios from 'axios';
import {BasePath} from "@/services/Routes";
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