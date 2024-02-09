import { passwordResultT, usernameResultT } from "../types/user"

export function validatePassword(password: string, retyped: string | null): passwordResultT {
    if (!password) return 'no_match'
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
    if (!username) return 'missing'
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
