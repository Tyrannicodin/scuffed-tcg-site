import {UnknownAction} from 'redux'

type SessionState = {
	username: string
	uuid: string
	password: string
	email: string
	userSecret: string
	message: string
	awaiting_code: boolean
	otpCode: string
}

const defaultState: SessionState = {
	username: '',
	uuid: '',
	password: '',
	email: '',
	userSecret: '',
	message: '',
	otpCode: '',
	awaiting_code: false,
}

const sessionReducer = (state = defaultState, action: UnknownAction): SessionState => {
	if (action.payload === undefined) return state
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
				uuid: '',
				password: '',
				email: '',
				userSecret: '',
				otpCode: '',
				awaiting_code: false,
			}
		case 'SET_MESSAGE':
			return {
				...state,
				message: action.payload as string,
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
				awaiting_code: false,
				...action.payload,
			}
		default:
			return state
	}
}

export default sessionReducer
