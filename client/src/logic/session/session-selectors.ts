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

export const getShowOtp = (state: RootState): boolean => {
	return getSession(state).showOtp
}

export const getTokenSecret = (state: RootState): string => {
	return getSession(state).tokenSecret
}
