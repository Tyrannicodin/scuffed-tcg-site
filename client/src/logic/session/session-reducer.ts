import {UnknownAction} from 'redux'
import {User} from 'common/models/user'

type SessionState = {
	user: User | null
	password: string
	email: string
	message: string
	otpCode: string
	awaiting_code: boolean
}

const defaultState: SessionState = {
	user: null,
	password: '',
	email: '',
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
				user: null,
				password: '',
				email: '',
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
				user: action.payload as User,
			}
		case 'UPDATE_USER':
			return {
				...state,
				user: action.payload as User,
			}
		default:
			return state
	}
}

export default sessionReducer
