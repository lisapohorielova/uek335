/**
 * An application user as returned by the backend.
 *
 * Used to render the profile screen and to identify the account on
 * update/delete requests.
 */
export interface User {
    /** Server-assigned unique identifier. */
    id: number;
    /** First name. */
    firstname: string;
    /** Last name. */
    lastname: string;
    /** Email address (also the login identifier). */
    email: string;
    /** Age in years; optional because older accounts may not have it set. */
    age?: number;
}
