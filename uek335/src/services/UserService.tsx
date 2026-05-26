import { RegisterFormData } from '@/types/RegisterFormData';
import {RegisterEndpoint} from "@/services/Routes";
import {api} from "@/services/AxiosClient";
import {LoginEndpoint} from "@/services/Routes";


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

    return data;
}

export async function loginUser(email: string, password: string): Promise<RegisterResponse> {
    const { data } = await api.post(LoginEndpoint, {
        email,
        password,
    });

    return data;
}