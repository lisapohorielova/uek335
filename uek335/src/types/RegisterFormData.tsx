/**
 * The values collected by the registration form.
 *
 * `age` is kept as a string here because it comes straight from a text input;
 * it is parsed to a number before being sent to the backend.
 *
 * @see RegisterPageTmpl
 */
export interface RegisterFormData {
    /** First name. */
    firstName: string;
    /** Last name. */
    lastName: string;
    /** Email address (also the login identifier). */
    email: string;
    /** Chosen password. */
    password: string;
    /** Age as entered in the text field; parsed to a number on submit. */
    age: string;
}
