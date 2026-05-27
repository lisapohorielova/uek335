/**
 * Backend base URL and REST endpoint paths, kept in one place so they are easy
 * to change (e.g. when switching from localhost to a deployed server).
 * @module
 */

/** Base URL of the REST backend. */
export const BasePath = 'http://localhost:3030'
/** Endpoint for creating an account. */
export const RegisterEndpoint = '/signup'
/** Endpoint for logging in. */
export const LoginEndpoint = '/login'
/** Endpoint for the book catalogue. */
export const BooksEndpoint = '/books'
