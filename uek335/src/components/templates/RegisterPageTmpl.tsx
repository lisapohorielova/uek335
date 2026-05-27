import {LinearGradient} from "expo-linear-gradient";
import {Colors, Fonts} from "@/constants/theme";
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {RegisterFormData} from "@/types/RegisterFormData";
import { registerUser} from "@/services/UserService";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import {OutlinedButton} from "@/components/atoms/OutlinedButton";
import {saveToken} from "@/services/SecureStore";

/** Validation/server error messages shown on the registration form. */
interface RegisterFormErrors {
    /** Error for the first-name field. */
    firstName?: string;
    /** Error for the last-name field. */
    lastName?: string;
    /** Error for the email field. */
    email?: string;
    /** Error for the password field. */
    password?: string;
    /** Error for the age field. */
    age?: string
    /** Generic message (currently unused, reserved for form-wide errors). */
    message?: string;
}

/**
 * Registration screen: collects the account fields, validates them, calls
 * {@link registerUser} and on success navigates into the app. Server/HTTP
 * errors are mapped to a readable message.
 *
 * @returns The registration form screen.
 */
export default function RegisterPageTmpl() {

    const router = useRouter();

    const [form, setForm] = useState<RegisterFormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        age: '',
    });

    const [errors, setErrors] = useState<RegisterFormErrors>({});
    const [serverError, setServerError] = useState<string | null>(null);

    /**
     * Client-side check of every field (name, email, password length, age range).
     *
     * @returns `true` if all fields are valid.
     */
    const validate = (): boolean => {
        const newErrors: RegisterFormErrors = {};
        if (!form.firstName.trim()) newErrors.firstName = 'Name required';
        if (!form.lastName.trim()) newErrors.lastName = 'Last Name required';
        if (!form.email.includes('@')) newErrors.email = 'Invalid email';
        if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        const age = Number.parseInt(form.age);
        if (!form.age || Number.isNaN(age) || age < 1 || age > 120)
            newErrors.age = 'Valid age required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /**
     * Registers the account, stores the token and enters the app; maps the HTTP
     * status to a readable error on failure.
     */
    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            const data = await registerUser(form);
            await saveToken(data.accessToken);
            console.log('Token gespeichert');
            router.push('/');
        } catch (error: any) {
            const status = error.response?.status;

            if (status === 401 || status === 400) {
                setServerError('Incorrect email or password. Please try again.');
            } else if (status === 404) {
                setServerError('No account found with this email.');
            } else if (status >= 500) {
                setServerError('Server error. Please try again later.');
            } else {
                setServerError('An error occurred. Please try again.');
            }
        }
    };

    /**
     * One labelled input; clears its own error message as soon as the user types.
     *
     * @param props - Field configuration.
     * @param props.label - Field caption.
     * @param props.field - Which {@link RegisterFormData} key this input edits.
     * @param props.placeholder - Placeholder text.
     * @param props.keyboardType - Optional keyboard type (e.g. `"numeric"`).
     * @returns The labelled input element.
     */
    const Field = ({
                       label,
                       field,
                       placeholder,
                       keyboardType = 'default',
                   }: {
        label: string;
        field: keyof RegisterFormData;
        placeholder: string;
        keyboardType?: any;
    }) => (
        <View style={styles.fieldContainer}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.inputWrapper, errors[field] && styles.inputError]}>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor="#A69CAC"
                    value={form[field]}
                    onChangeText={(val) => {
                        setForm((prev) => ({ ...prev, [field]: val }));
                        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
                    }}
                    keyboardType={keyboardType}
                    autoCapitalize={field === 'email' ? 'none' : 'words'}
                />
            </View>
            {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#3A3855', Colors.main.dark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <View style={styles.header}>
                    <Text style={styles.textCormorant}>Create</Text>
                    <Text style={styles.textCormorant}>Your Account</Text>
                </View>
            </LinearGradient>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center'}}
            >
                    {/* Form */}
                    <View style={styles.form}>
                        {Field({ label: "FIRST NAME", field: "firstName", placeholder: "John" })}
                        {Field({ label: "LAST NAME", field: "lastName", placeholder: "Smith" })}
                        {Field({ label: "MAIL", field: "email", placeholder: "john.smith@gmail.com", keyboardType: "email-address" })}
                        {Field({ label: "PASSWOD", field: "password", placeholder: "••••••••" })}
                        {Field({ label: "AGE", field: "age", placeholder: "25", keyboardType: "numeric" })}

                        {serverError && (
                            <View style={styles.errorBox}>
                                <Text style={styles.errorBoxText}>{serverError}</Text>
                            </View>
                        )}

                        <View style={{width: '50%', alignSelf: 'center'}}>
                        <OutlinedButton text={"SIGN UP"} onPress={() => handleSubmit()}/>
                        </View>

                        <Text style={styles.loginHint}>
                            Have an account?{' '}
                            <Text style={styles.loginLink} onPress={() => router.push('/login')}>Sign In</Text>
                        </Text>
                    </View>
            </KeyboardAvoidingView>

        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.main.background,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 10
    },
    textCormorant: {
        fontSize: 28,
        color: Colors.main.background,
        fontFamily: Fonts.cormorantBold,
        marginLeft: 30,
        top: -20
    },
    header:{
        height: 100,
        width: '100%',
        borderRadius: 22,
        marginTop: 30,
        flexDirection: 'column',
        shadowColor: Colors.main.main,
        shadowOffset: { width: 2, height: 5 },
        shadowOpacity: 0.35,
        shadowRadius: 3.84,
        elevation: 5,
        justifyContent: 'center',
    },
    safe: {
        flex: 1,
        backgroundColor: '#0D0C1D',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#F1DAC4',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 14,
        color: '#A69CAC',
        marginTop: 6,
    },
    form: {
        width: '100%',
        backgroundColor: Colors.main.dark,
        padding: 24,
        borderRadius: 22,
        shadowColor: Colors.main.main,
        shadowOffset: { width: 2, height: 5 },
        shadowOpacity: 0.35,
        shadowRadius: 3.84,
        elevation: 5,
    },
    row: {
        flexDirection: 'row',
    },
    fieldContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#A69CAC',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#161B33',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#474973',
    },
    inputError: {
        borderColor: '#e05a5a',
    },
    input: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: '#F1DAC4',
    },
    eyeBtn: {
        paddingHorizontal: 14,
    },
    eyeText: {
        fontSize: 16,
    },
    errorText: {
        fontSize: 11,
        color: '#e05a5a',
        marginTop: 4,
        marginLeft: 4,
    },
    errorBox: {
        backgroundColor: '#2a1a1a',
        borderRadius: 10,
        borderLeftWidth: 3,
        borderLeftColor: '#e05a5a',
        padding: 12,
        marginBottom: 16,
    },
    errorBoxText: {
        color: '#e05a5a',
        fontSize: 13,
        fontFamily: Fonts?.jost,
    },
    btnGradient: {
        borderRadius: 14,
        marginTop: 24,
    },
    btn: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    btnText: {
        color: '#F1DAC4',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    loginHint: {
        textAlign: 'center',
        marginTop: 20,
        color: '#A69CAC',
        fontSize: 13,
    },
    loginLink: {
        color: '#F1DAC4',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },

});
