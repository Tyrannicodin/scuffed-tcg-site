import {User} from 'common/models/user'

export const disconnect = (errorType?: string) => ({
	type: 'DISCONNECT' as const,
	payload: errorType,
})

export const onboarding = (user: User) => ({
	type: 'ONBOARDING' as const,
	payload: user,
})

export const connect = (user: User) => ({
	type: 'CONNECTED' as const,
	payload: user,
})

export const setMessage = (message: string) => ({
	type: 'SET_MESSAGE' as const,
	payload: message,
})

export const updateUserState = (user: User) => ({
	type: 'UPDATE_USER' as const,
	payload: user,
})
