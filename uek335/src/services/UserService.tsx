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

// Creates the account, then stores the returned token + user so the app is logged in.
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

// Logs in and stores the token + user for later requests.
export async function loginUser(email: string, password: string): Promise<RegisterResponse> {
    const { data } = await api.post(LoginEndpoint, {
        email,
        password,
    });
    await saveToken(data.accessToken);
    await saveUser(data.user);

    return data;
}

// Clears the saved token and returns to the start screen.
export async function logoutUser(): Promise<void> {
    await deleteToken();
    router.replace('/');
}

// Deletes the account on the server, then logs out locally.
export async function deleteAccount(userId: number): Promise<void> {
    await api.delete(`/users/${userId}`);
    await deleteToken();
    router.replace('/');
}

export async function getUser(userId: number): Promise<User> {
    const { data } = await api.get(`/users/${userId}`);
    return data;
}
