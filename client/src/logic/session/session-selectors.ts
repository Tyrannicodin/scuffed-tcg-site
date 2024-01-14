import {RootState} from 'store'

export const getSession = (state: RootState) => {
	return state.session
}

export const getMessage = (state: RootState): string => {
	return getSession(state).errorMessage
}

export const getUserSecret = (state: RootState): string => {
	return getSession(state).userSecret
}

export const getOTPCode = (state: RootState): string => {
	return getSession(state).otpCode
}

export const getAwaitingCode = (state: RootState): boolean => {
	return getSession(state).awaiting_code
}

export const getEmail = (state: RootState): string => {
	return getSession(state).email
}
