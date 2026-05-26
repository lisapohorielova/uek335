import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, FlatList, ActivityIndicator } from "react-native";
import { Text } from "react-native-paper";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Fonts } from "@/constants/theme";
import { RangeSlider } from "@/components/molecules/RangeSlider";
import { getBooks, getMaxPages } from "@/services/BooksService";
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

    // Load the real upper page bound once, then open the slider to it.
    useEffect(() => {
        getMaxPages()
            .then((max) => {
                setMaxPages(max);
                setRange([MIN_PAGES, max]);
            })
            .catch(() => {/* keep the 1000 fallback */});
    }, []);

    // Re-fetch whenever the search term or page range changes (debounced).
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

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [search, range, maxPages]);

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
                    <Ionicons
                        name="close-circle"
                        size={20}
                        color={Colors.main.light}
                        onPress={() => setSearch("")}
                    />
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.main.background,
        paddingHorizontal: 24,
        paddingTop: 70,
    },
    content: {
        paddingBottom: 120,
        gap: 12,
    },
    header: {
        marginBottom: 16,
    },
    kicker: {
        fontSize: 14,
        letterSpacing: 2,
        color: Colors.main.light,
        fontFamily: Fonts.jostSemiBold,
    },
    title: {
        fontSize: 44,
        color: Colors.main.main,
        fontFamily: Fonts.cormorantBold,
    },
    searchWrapper: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: Colors.main.white,
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: Colors.main.main,
        fontFamily: Fonts.jost,
    },
    bookCard: {
        flexDirection: "row",
        gap: 14,
        backgroundColor: Colors.main.white,
        borderRadius: 16,
        padding: 12,
        shadowColor: Colors.main.main,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 3,
    },
    cover: {
        width: 56,
        height: 84,
        borderRadius: 8,
        backgroundColor: Colors.main.light,
    },
    bookInfo: {
        flex: 1,
        justifyContent: "center",
        gap: 4,
    },
    bookTitle: {
        fontSize: 18,
        color: Colors.main.main,
        fontFamily: Fonts.cormorantBold,
        lineHeight: 22,
    },
    bookMeta: {
        fontSize: 13,
        color: Colors.main.light,
        fontFamily: Fonts.jost,
    },
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        marginTop: 80,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.main.light,
        fontFamily: Fonts.jost,
        textAlign: "center",
    },
});
