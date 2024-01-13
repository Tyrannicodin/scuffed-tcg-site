import {userInfoT} from 'common/types/user'

export const disconnect = (errorType?: string) => ({
	type: 'DISCONNECT' as const,
	payload: errorType,
})

export const onboarding = (userInfo: userInfoT) => ({
	type: 'ONBOARDING' as const,
	payload: userInfo,
})

export const connect = (userInfo: userInfoT) => ({
	type: 'CONNECTED' as const,
	payload: userInfo,
})

export const setMsg = (message: string) => ({
	type: 'SET_MESSAGE' as const,
	payload: message
})
