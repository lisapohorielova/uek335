/**
 * A book record as stored in and returned by the backend catalogue.
 *
 * Mirrors the shape of the `/books` REST resource; the `id` is assigned by
 * the server on creation.
 */
export interface Book {
    /** Server-assigned unique identifier. */
    id: number;
    /** Book title. */
    title: string;
    /** 13-digit ISBN. */
    isbn13: string;
    /** Foreign key to the language the book is written in. */
    language_id: number;
    /** Number of pages; also used by the page-range filter. */
    num_pages: number;
    /** Publication date as an ISO date string (e.g. `"2018-04-12"`). */
    publication_date: string;
    /** Foreign key to the publisher. */
    publisher_id: number;
    /** URL of the cover image shown in the list. */
    cover_url: string;
    /** Free-text description / blurb. */
    description: string;
}
