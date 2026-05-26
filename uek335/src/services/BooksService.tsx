import { api } from "@/services/AxiosClient";
import { BooksEndpoint } from "@/services/Routes";
import { Book } from "@/types/Book";

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

/** Fetches books from the backend, optionally filtered by title and page count. */
export async function getBooks(query: BookQuery = {}): Promise<Book[]> {
    const params: Record<string, string | number> = { _limit: query.limit ?? 30 };

    if (query.title) params.title_like = query.title;
    if (query.minPages != null) params.num_pages_gte = query.minPages;
    if (query.maxPages != null) params.num_pages_lte = query.maxPages;

    const { data } = await api.get<Book[]>(BooksEndpoint, { params });
    return data;
}

/** Returns the highest num_pages in the catalogue, used as the page-filter upper bound. */
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

/** Creates a new book in the catalogue (POST /books); the backend assigns the id. */
export async function createBook(input: CreateBookInput): Promise<Book> {
    const { data } = await api.post<Book>(BooksEndpoint, input);
    return data;
}

export interface UpdateBookInput {
    title?: string;
    author?: string;
    description?: string;
    num_pages?: number;
    cover_url?: string;
}

export async function updateBook(id: number, input: UpdateBookInput): Promise<Book> {
    const { data } = await api.put<Book>(`${BooksEndpoint}/${id}`, input);
    return data;
}

export async function deleteBook(id: number): Promise<void> {
    await api.delete(`${BooksEndpoint}/${id}`);
}