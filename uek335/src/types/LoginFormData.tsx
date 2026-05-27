/**
 * The values collected by the login form.
 *
 * @see LoginPageTmpl
 */
export interface LoginFormData {
    /** Email address the user logs in with. */
    email: string;
    /** Plain-text password (sent over the wire, never stored locally). */
    password: string;
}
