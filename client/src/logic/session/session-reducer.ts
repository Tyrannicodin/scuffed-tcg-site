import {UnknownAction} from 'redux'
import {User} from 'common/models/user'

type SessionState = {
	user: User | null
	message: string
	tokenSecret: string
	awaitingCode: boolean
}

const defaultState: SessionState = {
	user: null,
	message: '',
	tokenSecret: '',
	awaitingCode: false,
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
				awaitingCode: false,
			}
		case 'SET_MESSAGE':
			return {
				...state,
				message: action.payload as string,
			}
		case 'ONBOARDING':
			return {
				...state,
				awaitingCode: true,
				...action.payload,
			}
		case 'CONNECTED':
			return {
				...state,
				awaitingCode: false,
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
