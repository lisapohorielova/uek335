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

export const registerUser = async (form: FormData): Promise<RegisterResponse> => {
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
            age: parseInt(form.age),
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('Fehler beim Registrieren:', error);
        throw new Error(error.message || 'Registrierung fehlgeschlagen');

    }

    return response.json();
};