import {RootState} from 'store'

export const getSession = (state: RootState) => {
	return state.session
}

export const getMessage = (state: RootState): string => {
	return getSession(state).errorMessage
}
