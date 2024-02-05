import {UnknownAction} from 'redux'
import {User} from 'common/models/user'

type SessionState = {
	user: User | null
	message: string
	tokenSecret: string
	showOtp: boolean
}

const defaultState: SessionState = {
	user: null,
	message: '',
	tokenSecret: '',
	showOtp: false,
}

const sessionReducer = (state = defaultState, action: UnknownAction): SessionState => {
	if (action.payload === undefined) return state
	switch (action.type) {
		case 'LOGIN':
		case 'SIGNUP':
			return {
				...state,
				...action.payload,
			}
		case 'DISCONNECT':
			return {
				...state,
				user: null,
				showOtp: false,
			}
		case 'SET_MESSAGE':
			return {
				...state,
				message: action.payload as string,
			}
		case 'ONBOARDING':
			return {
				...state,
				...action.payload,
			}
		case 'CONNECTED':
			return {
				...state,
				showOtp: false,
				user: action.payload as User,
			}
		case 'UPDATE_USER':
			return {
				...state,
				user: action.payload as User,
			}
		case 'OTP_START':
			return {
				...state,
				showOtp: true,
				tokenSecret: '',
			}
		case 'OTP_END':
			return {
				...state,
				showOtp: false,
			}
		default:
			return state
	}
}

export default sessionReducer
