/**
 * Authentication and account API calls (register, login, logout, delete, fetch).
 *
 * Each call that authenticates the user also persists the returned token and
 * user via the `SecureStore` service, so the rest of the app can rely on those
 * being stored.
 * @module
 */
import { RegisterFormData } from '@/types/RegisterFormData';
import { RegisterEndpoint, LoginEndpoint } from "@/services/Routes";
import { api } from "@/services/AxiosClient";
import { deleteToken, saveToken, saveUser } from "@/services/SecureStore";
import { User } from "@/types/User";
import { router } from "expo-router";

/** Backend response returned on register and login. */
interface RegisterResponse {
    /** Bearer token used to authenticate subsequent requests. */
    accessToken: string;
    /** The newly created / logged-in user. */
    user: {
        email: string;
        firstname: string;
        lastname: string;
        age: number;
        id: number;
    };
}

/**
 * Creates a new account, then stores the returned token and user so the app
 * is immediately logged in.
 *
 * @param form - The validated registration form values.
 * @returns The backend response containing the token and the new user.
 */
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

/**
 * Logs the user in and stores the token and user for later requests.
 *
 * @param email - The account's email address.
 * @param password - The account's password.
 * @returns The backend response containing the token and the user.
 */
export async function loginUser(email: string, password: string): Promise<RegisterResponse> {
    const { data } = await api.post(LoginEndpoint, { email, password });
    await saveToken(data.accessToken);
    await saveUser(data.user);

    return data;
}

/**
 * Clears the saved token and navigates back to the start screen.
 *
 * @returns A promise that resolves once the token has been removed.
 */
export async function logoutUser(): Promise<void> {
    await deleteToken();
    router.replace('/');
}

/**
 * Deletes the account on the server, then logs out locally.
 *
 * @param userId - Id of the account to delete.
 * @returns A promise that resolves once the account is deleted and logged out.
 */
export async function deleteAccount(userId: number): Promise<void> {
    await api.delete(`/users/${userId}`);
    await deleteToken();
    router.replace('/');
}

/**
 * Fetches a single user by id.
 *
 * @param userId - Id of the user to load.
 * @returns The user record from the backend.
 */
export async function getUser(userId: number): Promise<User> {
    const { data } = await api.get(`/users/${userId}`);
    return data;
}
