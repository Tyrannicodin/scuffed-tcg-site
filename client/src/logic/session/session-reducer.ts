import {UnknownAction} from 'redux'

type SessionState = {
	username: string
	password: string
	email: string
	userSecret: string
	errorMessage: string
	awaiting_code: boolean
}

const defaultState: SessionState = {
	username: '',
	password: '',
	email: '',
	userSecret: '',
	errorMessage: '',
	awaiting_code: false
}

const sessionReducer = (state = defaultState, action: UnknownAction): SessionState => {
	if (!action.payload) return {...state}
	switch (action.type) {
		case 'LOGIN':
		case 'SIGNUP':
			return {
				...state,
				...action.payload,
			}
		case 'DISCONNECT':
		case 'AUTH_FAIL':
			return {
				...state,
				username: '',
				userSecret: '',
				password: '',
				errorMessage: action.payload as string
			}
		case 'ONBOARDING':
			return {
				...state,
				password: '',
				awaiting_code: true
			}
		case 'CONNECTED':
			return {
				...state,
				password: '',
				...action.payload
			}
		default:
			return state
	}
}

export default sessionReducer
