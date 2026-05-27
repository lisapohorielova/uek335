/**
 * CRUD calls for the book catalogue (`/books`), plus query helpers used by the
 * library screen's search and page-range filter.
 * @module
 */
import { api } from "@/services/AxiosClient";
import { BooksEndpoint } from "@/services/Routes";
import { Book } from "@/types/Book";

/** Filter/limit options accepted by {@link getBooks}. */
export interface BookQuery {
    /** Search term matched against the book title (?title_like=). */
    title?: string;
    /** Lower bound for num_pages (?num_pages_gte=). */
    minPages?: number;
    /** Upper bound for num_pages (?num_pages_lte=). */
    maxPages?: number;
    /** How many books to fetch at most. */
    limit?: number;
}

/**
 * Fetches books from the backend, optionally filtered by title and page count.
 *
 * @param query - Optional title/page filters and a result limit. Omitted
 *   fields are simply not sent as query params.
 * @returns The matching books (at most `query.limit`, default 30).
 */
export async function getBooks(query: BookQuery = {}): Promise<Book[]> {
    const params: Record<string, string | number> = { _limit: query.limit ?? 30 };

    if (query.title) params.title_like = query.title;
    if (query.minPages != null) params.num_pages_gte = query.minPages;
    if (query.maxPages != null) params.num_pages_lte = query.maxPages;

    const { data } = await api.get<Book[]>(BooksEndpoint, { params });
    return data;
}

/**
 * Returns the highest `num_pages` in the catalogue, used as the page-filter
 * upper bound.
 *
 * @returns The largest page count, or `1000` as a fallback when the catalogue
 *   is empty.
 */
export async function getMaxPages(): Promise<number> {
    const { data } = await api.get<Book[]>(BooksEndpoint, {
        params: { _sort: "num_pages", _order: "desc", _limit: 1 },
    });
    return data[0]?.num_pages ?? 1000;
}

/** Fields collected by the "Create a Book" form. */
export interface CreateBookInput {
    title: string;
    author: string;
    description: string;
    num_pages: number;
    cover_url: string;
}

/**
 * Creates a new book in the catalogue (`POST /books`); the backend assigns the id.
 *
 * @param input - The new book's fields.
 * @returns The created book, including its server-assigned id.
 */
export async function createBook(input: CreateBookInput): Promise<Book> {
    const { data } = await api.post<Book>(BooksEndpoint, input);
    return data;
}

/** Partial set of book fields accepted by {@link updateBook}; all optional. */
export interface UpdateBookInput {
    title?: string;
    author?: string;
    description?: string;
    num_pages?: number;
    cover_url?: string;
}

/**
 * Updates an existing book (`PUT /books/:id`).
 *
 * @param id - Id of the book to update.
 * @param input - The fields to change.
 * @returns The updated book as returned by the backend.
 */
export async function updateBook(id: number, input: UpdateBookInput): Promise<Book> {
    const { data } = await api.put<Book>(`${BooksEndpoint}/${id}`, input);
    return data;
}

/**
 * Deletes a book (`DELETE /books/:id`).
 *
 * @param id - Id of the book to delete.
 * @returns A promise that resolves once the book has been deleted.
 */
export async function deleteBook(id: number): Promise<void> {
    await api.delete(`${BooksEndpoint}/${id}`);
}