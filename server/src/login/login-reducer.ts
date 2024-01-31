import {UnknownAction} from 'redux'
import {User} from '../../../common/models/user'
import {Socket} from 'socket.io'

export type UsersState = {
	users: Record<string, User>
	sockets: Socket[]
}

const defaultState: UsersState = {
	users: {},
	sockets: [],
}

function userReducer(state = defaultState, action: UnknownAction): UsersState {
	if (!action.payload) return state
	if (action.socket) return state
	switch (action.type) {
		case 'ADD_USER':
			const newUser = action.payload as User
			if (!newUser.secret) return state
			state.users[newUser.secret] = newUser
			return {
				...state,
			}
		case 'UPDATE_USER':
			const user = action.payload as User
			if (!state.users[user.secret]) return state
			state.users[user.secret] = user
			return {
				...state,
			}
		case 'CLIENT_CONNECTED':
			state.sockets.push(action.payload as Socket)
			return {
				...state,
			}
		case 'CLIENT_DISCONNECTED':
			state.sockets.splice(state.sockets.indexOf(action.payload as Socket))
			return {
				...state,
			}
		default:
			return state
	}
}

export default userReducer
