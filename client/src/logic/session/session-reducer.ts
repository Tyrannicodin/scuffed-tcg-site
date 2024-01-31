import {UnknownAction} from 'redux'
import {User} from 'common/models/user'

type SessionState = {
	user: User | null
	email: string
	message: string
	awaiting_code: boolean
}

const defaultState: SessionState = {
	user: null,
	email: '',
	message: '',
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
				awaiting_code: true,
				...action.payload,
			}
		case 'CONNECTED':
			return {
				...state,
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
