import React, { useEffect, useState } from "react";
import {
    View, StyleSheet, TextInput, FlatList,
    ActivityIndicator, TouchableOpacity, Alert,
} from "react-native";
import { Text } from "react-native-paper";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Fonts } from "@/constants/theme";
import { RangeSlider } from "@/components/molecules/RangeSlider";
import { BookModal } from "@/components/molecules/BookModal";
import {
    getBooks, getMaxPages, createBook, updateBook, deleteBook,
    CreateBookInput, UpdateBookInput,
} from "@/services/BooksService";
import { Book } from "@/types/Book";

const MIN_PAGES = 0;
const DEBOUNCE_MS = 350;

export default function BooksPageTmpl() {
    const [search, setSearch] = useState("");
    const [maxPages, setMaxPages] = useState(1000);
    const [range, setRange] = useState<[number, number]>([MIN_PAGES, 1000]);
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    // Once on mount: find the longest book so the page slider has a sensible upper bound.
    useEffect(() => {
        getMaxPages()
            .then((max) => { setMaxPages(max); setRange([MIN_PAGES, max]); })
            .catch(() => {});
    }, []);

    // Reload books whenever search/filters change, debounced so we don't fire on every keystroke.
    // `cancelled` ignores a stale response if the inputs change again before it arrives.
    useEffect(() => {
        let cancelled = false;
        const timer = setTimeout(async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await getBooks({
                    title: search.trim() || undefined,
                    minPages: range[0] > MIN_PAGES ? range[0] : undefined,
                    maxPages: range[1] < maxPages ? range[1] : undefined,
                });
                if (!cancelled) setBooks(result);
            } catch {
                if (!cancelled) setError("Couldn't load books. Please try again.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }, DEBOUNCE_MS);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [search, range, maxPages]);

    // CREATE
    const handleCreate = async (input: CreateBookInput | UpdateBookInput) => {
        const created = await createBook(input as CreateBookInput);
        setBooks(prev => [created, ...prev]);
    };

    // UPDATE
    const handleUpdate = async (input: CreateBookInput | UpdateBookInput) => {
        if (!selectedBook) return;
        const updated = await updateBook(selectedBook.id, input as UpdateBookInput);
        setBooks(prev => prev.map(b => b.id === updated.id ? updated : b));
    };

    // DELETE — ask for confirmation first, then remove from the server and the list.
    const handleDelete = (book: Book) => {
        Alert.alert(
            "Delete Book",
            `Remove "${book.title}"? This cannot be undone.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteBook(book.id);
                            setBooks(prev => prev.filter(b => b.id !== book.id));
                        } catch {
                            Alert.alert("Error", "Couldn't delete the book.");
                        }
                    },
                },
            ]
        );
    };

    const openCreate = () => { setSelectedBook(null); setModalVisible(true); };
    const openEdit = (book: Book) => { setSelectedBook(book); setModalVisible(true); };

    const renderBook = ({ item }: { item: Book }) => (
        <View style={styles.bookCard}>
            <Image
                source={item.cover_url}
                style={styles.cover}
                contentFit="cover"
                transition={150}
            />
            <View style={styles.bookInfo}>
                <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.bookMeta}>{item.num_pages} pages</Text>
                {!!item.publication_date && (
                    <Text style={styles.bookMeta}>{item.publication_date.slice(0, 4)}</Text>
                )}
            </View>

            {/* Edit & Delete */}
            <View style={styles.cardActions}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => openEdit(item)}>
                    <Ionicons name="pencil-outline" size={18} color={Colors.main.mid} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn} onPress={() => handleDelete(item)}>
                    <Ionicons name="trash-outline" size={18} color="#e05a5a" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const listHeader = (
        <View>
            <View style={styles.header}>
                <Text style={styles.kicker}>BOOK CRUX</Text>
                <Text style={styles.title}>Library</Text>
            </View>

            <View style={styles.searchWrapper}>
                <Ionicons name="search-outline" size={20} color={Colors.main.light} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by title"
                    placeholderTextColor={Colors.main.light}
                    value={search}
                    onChangeText={setSearch}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                {search.length > 0 && (
                    <Ionicons name="close-circle" size={20} color={Colors.main.light} onPress={() => setSearch("")} />
                )}
            </View>

            <RangeSlider
                min={MIN_PAGES}
                max={maxPages}
                low={range[0]}
                high={range[1]}
                onChange={(low, high) => setRange([low, high])}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={books}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderBook}
                ListHeaderComponent={listHeader}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        {loading ? (
                            <ActivityIndicator color={Colors.main.mid} size="large" />
                        ) : error ? (
                            <>
                                <Ionicons name="cloud-offline-outline" size={56} color={Colors.main.light} />
                                <Text style={styles.emptyText}>{error}</Text>
                            </>
                        ) : (
                            <>
                                <Ionicons name="search-outline" size={56} color={Colors.main.light} />
                                <Text style={styles.emptyText}>No books match your filters.</Text>
                            </>
                        )}
                    </View>
                }
            />

            {/* FAB — Create */}
            <TouchableOpacity style={styles.fab} onPress={openCreate}>
                <Ionicons name="add" size={28} color={Colors.main.background} />
            </TouchableOpacity>

            {/* Modal — Create / Edit */}
            <BookModal
                visible={modalVisible}
                book={selectedBook}
                onClose={() => setModalVisible(false)}
                onSave={selectedBook ? handleUpdate : handleCreate}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.main.background, paddingHorizontal: 24, paddingTop: 70 },
    content: { paddingBottom: 120, gap: 12 },
    header: { marginBottom: 16 },
    kicker: { fontSize: 14, letterSpacing: 2, color: Colors.main.light, fontFamily: Fonts.jostSemiBold },
    title: { fontSize: 44, color: Colors.main.main, fontFamily: Fonts.cormorantBold },
    searchWrapper: {
        flexDirection: "row", alignItems: "center", gap: 10,
        backgroundColor: Colors.main.white, borderRadius: 14,
        paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16,
    },
    searchInput: { flex: 1, fontSize: 15, color: Colors.main.main, fontFamily: Fonts.jost },
    bookCard: {
        flexDirection: "row", gap: 14,
        backgroundColor: Colors.main.white, borderRadius: 16, padding: 12,
        shadowColor: Colors.main.main, shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12, shadowRadius: 6, elevation: 3,
        alignItems: "center",
    },
    cover: { width: 56, height: 84, borderRadius: 8, backgroundColor: Colors.main.light },
    bookInfo: { flex: 1, justifyContent: "center", gap: 4 },
    bookTitle: { fontSize: 18, color: Colors.main.main, fontFamily: Fonts.cormorantBold, lineHeight: 22 },
    bookMeta: { fontSize: 13, color: Colors.main.light, fontFamily: Fonts.jost },
    cardActions: { flexDirection: "column", gap: 8, alignItems: "center" },
    iconBtn: {
        padding: 8, borderRadius: 10,
        backgroundColor: Colors.main.background,
    },
    emptyState: { alignItems: "center", justifyContent: "center", gap: 12, marginTop: 80 },
    emptyText: { fontSize: 16, color: Colors.main.light, fontFamily: Fonts.jost, textAlign: "center" },
    fab: {
        position: "absolute", bottom: 32, right: 24,
        width: 56, height: 56, borderRadius: 28,
        backgroundColor: Colors.main.main,
        alignItems: "center", justifyContent: "center",
        shadowColor: Colors.main.main,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35, shadowRadius: 8, elevation: 6,
    },
});