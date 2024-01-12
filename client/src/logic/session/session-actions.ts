import {userInfoT} from 'common/types/user'

export const disconnect = (errorType?: string) => ({
	type: 'DISCONNECT' as const,
	payload: errorType,
})

export const auth_fail = (message?: string) => ({
	type: 'AUTH_FAIL' as const,
	payload: message,
})

export const onboarding = (userInfo: userInfoT) => ({
	type: 'ONBOARDING',
	payload: userInfo
})

export const connect = (userInfo: userInfoT) => ({
	type: 'CONNECTED',
	payload: userInfo,
})
