import {User} from 'common/models/user'
import {RootState} from 'store'

export const getSession = (state: RootState) => {
	return state.session
}

export const getUser = (state: RootState): User | null => {
	return getSession(state).user
}

export const getUserSecret = (state: RootState): string | undefined => {
	return getUser(state)?.secret
}

export const getUuid = (state: RootState): string | undefined => {
	return getUser(state)?.uuid
}

export const getMessage = (state: RootState): string => {
	return getSession(state).message
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
