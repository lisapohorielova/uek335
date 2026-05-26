import { FormData } from '@/types/FormData';
import {BasePath, RegisterEndpoint} from "@/services/Routes";


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

export async function registerUser(form: FormData): Promise<RegisterResponse> {
    const response = await fetch(BasePath + RegisterEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            firstname: form.firstName,
            lastname: form.lastName,
            email: form.email,
            password: form.password,
            age: Number.parseInt(form.age),
        }),
    });

    const data = await response.json();
    console.log(data);
    if (!response.ok) {
        console.error('Fehler beim Registrieren:', data);
        throw new Error(data?.message || 'Registrierung fehlgeschlagen');

    }

    return data;
}
