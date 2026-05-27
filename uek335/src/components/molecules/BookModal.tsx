import React, { useEffect, useState } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Fonts } from "@/constants/theme";
import { Book } from "@/types/Book";
import { CreateBookInput, UpdateBookInput } from "@/services/BooksService";

/** Local form state; `pages` is a string because it comes from a text input. */
interface BookForm {
    title: string;
    description: string;
    pages: string;
    cover_url: string;
}

/** Per-field validation messages (only set for fields that have an error). */
type FormErrors = Partial<Record<keyof BookForm, string>>;

/** Props for {@link BookModal}. */
interface Props {
    /** Whether the modal is shown. */
    visible: boolean;
    /** Book to edit; pass `null`/omit to create a new one. */
    book?: Book | null;
    /** Called when the modal should close (cancel, backdrop, or after save). */
    onClose: () => void;
    /** Persists the entered data; resolves once the save completed. */
    onSave: (data: CreateBookInput | UpdateBookInput) => Promise<void>;
}

/** Blank form used when creating a new book or resetting the modal. */
const EMPTY: BookForm = { title: "", description: "", pages: "", cover_url: "" };

/**
 * Bottom-sheet modal for creating or editing a book. Runs basic validation and
 * delegates persistence to the `onSave` prop, so the same modal works for both
 * create and edit.
 *
 * @param props - Visibility, the optional book to edit, and the close/save callbacks.
 * @returns The book create/edit modal.
 */
export function BookModal({ visible, book, onClose, onSave }: Readonly<Props>) {
    const isEdit = !!book;
    const [form, setForm] = useState<BookForm>(EMPTY);
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    // Prefill the form when editing an existing book, reset it when creating a new one.
    useEffect(() => {
        if (book) {
            setForm({
                title: book.title ?? "",
                description: book.description ?? "",
                pages: book.num_pages ? String(book.num_pages) : "",
                cover_url: book.cover_url ?? "",
            });
        } else {
            setForm(EMPTY);
        }
        setErrors({});
    }, [book, visible]);

    /**
     * Validates the form: title is required, pages (if given) must be a valid
     * non-negative number. Populates {@link FormErrors} as a side effect.
     *
     * @returns `true` if the form is valid.
     */
    const validate = (): boolean => {
        const next: FormErrors = {};
        if (!form.title.trim()) next.title = "Title is required";
        if (form.pages && (Number.isNaN(Number(form.pages)) || Number(form.pages) < 0))
            next.pages = "Enter a valid number";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    /**
     * Validates, hands the trimmed data to the parent (create or update) via
     * `onSave`, then closes the modal. Shows a spinner while saving.
     */
    const handleSave = async () => {
        if (!validate()) return;
        setSubmitting(true);
        try {
            await onSave({
                title: form.title.trim(),
                description: form.description.trim(),
                num_pages: form.pages ? Number(form.pages) : 0,
                cover_url: form.cover_url.trim(),
            });
            onClose();
        } finally {
            setSubmitting(false);
        }
    };

    /**
     * Builds one labelled input; clears that field's error as soon as the user types.
     *
     * @param label - Field caption.
     * @param field - Which {@link BookForm} key this input edits.
     * @param options - Optional `multiline` flag and `keyboardType`.
     * @returns The labelled input element.
     */
    const renderField = (
        label: string,
        field: keyof BookForm,
        options: { multiline?: boolean; keyboardType?: any } = {}
    ) => (
        <View style={styles.fieldContainer}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.inputWrapper, options.multiline && styles.inputWrapperMultiline, errors[field] && styles.inputError]}>
                <TextInput
                    style={[styles.input, options.multiline && styles.inputMultiline]}
                    value={form[field]}
                    onChangeText={(val) => {
                        setForm(prev => ({ ...prev, [field]: val }));
                        if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
                    }}
                    placeholderTextColor={Colors.main.light}
                    keyboardType={options.keyboardType ?? "default"}
                    multiline={options.multiline}
                    autoCapitalize={field === "cover_url" ? "none" : "sentences"}
                />
            </View>
            {!!(errors[field]) && <Text style={styles.errorText}>{errors[field]}</Text>}
        </View>
    );

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.sheet}
                >
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                        <View style={styles.handle} />

                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{isEdit ? "Edit Book" : "New Book"}</Text>
                            <TouchableOpacity onPress={onClose}>
                                <Ionicons name="close" size={24} color={Colors.main.light} />
                            </TouchableOpacity>
                        </View>

                        {renderField("TITLE", "title")}
                        {renderField("DESCRIPTION", "description", { multiline: true })}
                        {renderField("PAGES", "pages", { keyboardType: "number-pad" })}
                        {renderField("COVER URL", "cover_url", { keyboardType: "url" })}

                        <View style={styles.actions}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={submitting}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={submitting}>
                                {submitting
                                    ? <ActivityIndicator color={Colors.main.background} />
                                    : <Text style={styles.saveText}>{isEdit ? "Save Changes" : "Create"}</Text>
                                }
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(13,12,29,0.75)",
        justifyContent: "flex-end",
    },
    sheet: {
        backgroundColor: Colors.main.background,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 24,
        paddingBottom: 48,
        maxHeight: "90%",
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: Colors.main.light,
        borderRadius: 2,
        alignSelf: "center",
        marginBottom: 20,
        opacity: 0.4,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 26,
        color: Colors.main.main,
        fontFamily: Fonts.cormorantBold,
    },
    fieldContainer: { marginBottom: 16 },
    label: {
        fontSize: 11,
        fontWeight: "600",
        color: Colors.main.light,
        letterSpacing: 1.2,
        marginBottom: 6,
        fontFamily: Fonts.jostSemiBold,
    },
    inputWrapper: {
        backgroundColor: Colors.main.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.main.light,
        paddingHorizontal: 16,
        paddingVertical: 13,
    },
    inputWrapperMultiline: { alignItems: "flex-start" },
    inputError: { borderColor: "#e05a5a" },
    input: { fontSize: 15, color: Colors.main.main, fontFamily: Fonts.jost },
    inputMultiline: { minHeight: 80, textAlignVertical: "top" },
    errorText: { fontSize: 11, color: "#e05a5a", marginTop: 4, marginLeft: 4 },
    actions: { flexDirection: "row", gap: 12, marginTop: 24 },
    cancelBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 50,
        borderWidth: 1.5,
        borderColor: Colors.main.light,
        alignItems: "center",
    },
    cancelText: { color: Colors.main.light, fontFamily: Fonts.jostSemiBold, fontSize: 14 },
    saveBtn: {
        flex: 2,
        paddingVertical: 14,
        borderRadius: 50,
        backgroundColor: Colors.main.main,
        alignItems: "center",
    },
    saveText: { color: Colors.main.background, fontFamily: Fonts.jostSemiBold, fontSize: 14 },
});