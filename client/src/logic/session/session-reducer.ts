import {UnknownAction} from 'redux'

type SessionState = {
	username: string,
	secret: string
}

const defaultState: SessionState = {
	username: '',
	secret: ''
}

const sessionReducer = (state = defaultState, action: UnknownAction): SessionState => {
	if (!action.payload) return {...state}
	switch (action.type) {
		case 'LOGIN':
			return {
				...state,
				...action.payload,
			}
		case 'SIGNUP':
		default:
			return state
	}
}

export default sessionReducer
