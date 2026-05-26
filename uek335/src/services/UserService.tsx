import { RegisterFormData } from '@/types/RegisterFormData';
import {RegisterEndpoint, LoginEndpoint} from "@/services/Routes";
import {api} from "@/services/AxiosClient";
import {deleteToken, saveToken, saveUser} from "@/services/SecureStore";
import {User} from "@/types/User";
import {router} from "expo-router";


interface RegisterResponse {
    accessToken: string;
    user: {
        email: string;
        firstname: string;
        lastname: string;
        age: number;
        id: number;
    };
}

export async function registerUser(form: RegisterFormData): Promise<RegisterResponse> {
    const { data } = await api.post(RegisterEndpoint, {
        firstname: form.firstName,
        lastname: form.lastName,
        email: form.email,
        password: form.password,
        age: Number.parseInt(form.age),
    });
    await saveToken(data.accessToken);
    await saveUser(data.user);

    return data;
}

export async function loginUser(email: string, password: string): Promise<RegisterResponse> {
    const { data } = await api.post(LoginEndpoint, {
        email,
        password,
    });
    await saveToken(data.accessToken);
    await saveUser(data.user);

    return data;
}

export async function logoutUser(): Promise<void> {
    await deleteToken();
    router.replace('/');
}

export async function deleteAccount(userId: number): Promise<void> {
    await api.delete(`/users/${userId}`);
    await deleteToken();
    router.replace('/');
}

export async function getUser(userId: number): Promise<User> {
    const { data } = await api.get(`/users/${userId}`);
    return data;
}
