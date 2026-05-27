import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    Pressable,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    KeyboardTypeOptions,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Fonts } from "@/constants/theme";
import { createBook } from "@/services/BooksService";

interface NewBookForm {
    title: string;
    author: string;
    description: string;
    pages: string;
    cover_url: string;
}

type FormErrors = Partial<Record<keyof NewBookForm, string>>;

const EMPTY_FORM: NewBookForm = {
    title: "",
    author: "",
    description: "",
    pages: "",
    cover_url: "",
};

export default function AddBookPageTmpl() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [form, setForm] = useState<NewBookForm>(EMPTY_FORM);
    const [errors, setErrors] = useState<FormErrors>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Title is required, pages (if given) must be a valid non-negative number.
    const validate = (): boolean => {
        const next: FormErrors = {};
        if (!form.title.trim()) next.title = "Title is required";
        if (form.pages.trim() && (Number.isNaN(Number(form.pages)) || Number(form.pages) < 0)) {
            next.pages = "Enter a valid number of pages";
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    // Create the book, then reset the form and jump to the search screen.
    const handleSubmit = async () => {
        if (!validate()) return;
        setServerError(null);
        setSubmitting(true);
        try {
            await createBook({
                title: form.title.trim(),
                author: form.author.trim(),
                description: form.description.trim(),
                num_pages: form.pages.trim() ? Number(form.pages) : 0,
                cover_url: form.cover_url.trim(),
            });
            setForm(EMPTY_FORM);
            router.replace("/search");
        } catch {
            setServerError("Couldn't create the book. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        setForm(EMPTY_FORM);
        setErrors({});
        setServerError(null);
        router.replace("/home");
    };

    // Called as a plain function (not <Field />) so the inputs keep focus between keystrokes.
    const renderField = (
        label: string,
        field: keyof NewBookForm,
        options: { multiline?: boolean; keyboardType?: KeyboardTypeOptions } = {},
    ) => (
        <View style={styles.fieldContainer}>
            <Text style={styles.label}>{label}</Text>
            <View
                style={[
                    styles.inputWrapper,
                    options.multiline && styles.inputWrapperMultiline,
                    errors[field] && styles.inputError,
                ]}
            >
                <TextInput
                    style={[styles.input, options.multiline && styles.inputMultiline]}
                    value={form[field]}
                    onChangeText={(val) => {
                        setForm((prev) => ({ ...prev, [field]: val }));
                        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
                    }}
                    placeholderTextColor={Colors.main.light}
                    keyboardType={options.keyboardType ?? "default"}
                    multiline={options.multiline}
                    autoCapitalize={field === "cover_url" ? "none" : "sentences"}
                    autoCorrect={field !== "cover_url"}
                />
            </View>
            {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <LinearGradient
                        colors={["#3A3855", Colors.main.dark]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.header}
                    >
                        <Text style={styles.headerText}>Create a</Text>
                        <Text style={styles.headerText}>Book</Text>
                    </LinearGradient>

                    <View style={styles.form}>
                        {renderField("TITLE", "title")}
                        {renderField("AUTHOR", "author")}
                        {renderField("DESCRIPTION", "description", { multiline: true })}
                        {renderField("PAGES", "pages", { keyboardType: "number-pad" })}
                        {renderField("COVER URL", "cover_url", { keyboardType: "url" })}

                        {serverError && (
                            <View style={styles.errorBox}>
                                <Text style={styles.errorBoxText}>{serverError}</Text>
                            </View>
                        )}

                        <View style={styles.buttonRow}>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.actionBtn,
                                    styles.createBtn,
                                    pressed && styles.pressed,
                                ]}
                                onPress={handleSubmit}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <ActivityIndicator color={Colors.main.background} />
                                ) : (
                                    <Text style={[styles.actionBtnText, styles.createBtnText]}>
                                        CREATE BOOK
                                    </Text>
                                )}
                            </Pressable>

                            <Pressable
                                style={({ pressed }) => [
                                    styles.actionBtn,
                                    styles.cancelBtn,
                                    pressed && styles.pressed,
                                ]}
                                onPress={handleCancel}
                                disabled={submitting}
                            >
                                <Text style={[styles.actionBtnText, styles.cancelBtnText]}>
                                    CANCEL
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.main.background,
    },
    scroll: {
        paddingHorizontal: 20,
        paddingBottom: 140,
        gap: 24,
    },
    header: {
        width: "100%",
        minHeight: 130,
        borderRadius: 22,
        padding: 28,
        justifyContent: "center",
        shadowColor: Colors.main.main,
        shadowOffset: { width: 2, height: 5 },
        shadowOpacity: 0.35,
        shadowRadius: 3.84,
        elevation: 5,
    },
    headerText: {
        fontSize: 32,
        lineHeight: 38,
        color: Colors.main.background,
        fontFamily: Fonts.cormorantBold,
    },
    form: {
        width: "100%",
        backgroundColor: Colors.main.dark,
        padding: 24,
        borderRadius: 22,
        shadowColor: Colors.main.main,
        shadowOffset: { width: 2, height: 5 },
        shadowOpacity: 0.35,
        shadowRadius: 3.84,
        elevation: 5,
    },
    fieldContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        fontWeight: "600",
        color: Colors.main.light,
        marginBottom: 8,
        letterSpacing: 1,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#161B33",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.main.mid,
    },
    inputWrapperMultiline: {
        alignItems: "flex-start",
    },
    inputError: {
        borderColor: "#e05a5a",
    },
    input: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: Colors.main.background,
    },
    inputMultiline: {
        minHeight: 90,
        textAlignVertical: "top",
    },
    errorText: {
        fontSize: 11,
        color: "#e05a5a",
        marginTop: 4,
        marginLeft: 4,
    },
    errorBox: {
        backgroundColor: "#2a1a1a",
        borderRadius: 10,
        borderLeftWidth: 3,
        borderLeftColor: "#e05a5a",
        padding: 12,
        marginBottom: 16,
    },
    errorBoxText: {
        color: "#e05a5a",
        fontSize: 13,
        fontFamily: Fonts.jost,
    },
    buttonRow: {
        flexDirection: "row",
        gap: 12,
        marginTop: 8,
    },
    actionBtn: {
        flex: 1,
        borderRadius: 50,
        borderWidth: 1.5,
        paddingVertical: 14,
        paddingHorizontal: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    createBtn: {
        borderColor: Colors.main.background,
    },
    cancelBtn: {
        borderColor: "#e05a5a",
    },
    actionBtnText: {
        fontSize: 14,
        letterSpacing: 1,
        textAlign: "center",
        fontFamily: Fonts.jostSemiBold,
    },
    createBtnText: {
        color: Colors.main.background,
    },
    cancelBtnText: {
        color: "#e05a5a",
    },
    pressed: {
        opacity: 0.6,
    },
});
