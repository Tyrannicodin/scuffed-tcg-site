import {UnknownAction} from 'redux'

type SessionState = {
	username: string
	password: string
	email: string
	userSecret: string
	errorMessage: string
	awaiting_code: boolean
	otpCode: string
}

const defaultState: SessionState = {
	username: '',
	password: '',
	email: '',
	userSecret: '',
	errorMessage: '',
	otpCode: '',
	awaiting_code: false,
}

const sessionReducer = (state = defaultState, action: UnknownAction): SessionState => {
	if (!action.payload) return state
	switch (action.type) {
		case 'LOGIN':
		case 'SIGNUP':
		case 'CODE_SUBMIT':
			return {
				...state,
				...action.payload,
			}
		case 'DISCONNECT':
			return {
				...state,
				username: '',
				password: '',
				email: '',
				userSecret: '',
				otpCode: '',
				awaiting_code: false,
				errorMessage: action.payload as string,
			}
		case 'SET_MESSAGE':
			return {
				...state,
				errorMessage: action.payload as string,
			}
		case 'ONBOARDING':
			return {
				...state,
				password: '',
				awaiting_code: true,
				...action.payload,
			}
		case 'CONNECTED':
			return {
				...state,
				password: '',
				...action.payload,
			}
		default:
			return state
	}
}

export default sessionReducer
