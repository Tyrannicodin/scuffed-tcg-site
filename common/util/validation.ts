import { passwordResultT, usernameResultT } from "../types/user"

export function validatePassword(password: string, retyped: string | null): passwordResultT {
	if (retyped !== null && password !== retyped) return 'no_match'
	if (password.length < 8) return 'length_small'
    if (!/\d/.test(password)) return 'number'
    if (!/[^A-Za-z0-9]/.test(password)) return 'special'
    if (!/[A-Z]/.test(password)) return 'case_upper'
    if (!/[a-z]/.test(password)) return 'case_lower'
	return 'success'
}

export function getPasswordError(message: passwordResultT): string {
    switch (message) {
        case 'no_match':
            return 'Password and re-typed password do not match'
        case 'case_lower':
            return 'Password must contain at least 1 lower case character'
        case 'case_upper':
            return 'Password must contain at least 1 upper case character'
        case 'length_small':
            return 'Password must be at least 8 characters long'
        case 'number':
            return 'Password must contain at least 1 number'
        case 'special':
            return 'Password must contain at least 1 special character'
        default:
            return ''
    }
}

export function validateUsername(username: string): usernameResultT {
    if (username === '') return 'missing'
    if (username.length > 255) return 'long'
    if (/\s/.test(username)) return 'whitespace'
    
    return 'success'
}

export function getUsernameError(message: usernameResultT): string {
    switch (message) {
        case 'long':
            return 'Usernames must be less than 256 characters'
        case 'missing':
            return 'Username missing'
        case 'whitespace':
            return 'Username must not contain whitespace'
        default:
            return ''
    }
}

export function validateEmail(email: string): boolean {
    const email_regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    return email_regex.test(email)
}

export function getEmailError(valid: boolean) {
    return valid ? '' : 'Invalid email'
}
