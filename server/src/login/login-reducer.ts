import {UnknownAction} from 'redux'
import {User} from '../../../common/models/user'
import {Socket} from 'socket.io'

export type UsersState = {
	users: User[]
	sockets: Socket[]
}

const defaultState: UsersState = {
	users: [],
	sockets: [],
}

function userReducer(state = defaultState, action: UnknownAction): UsersState {
	if (!action.payload) return state
	if (action.socket) return state
	switch (action.type) {
		case 'ADD_USER':
			state.users.push(action.payload as User)
			return {
				...state,
			}
		case 'UPDATE_USER':
			const user = action.payload as User
			const userStateIndex = state.users.findIndex((userState) => userState.uuid === user.uuid)
			if (userStateIndex === -1) return state
			state.users[userStateIndex] = user
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
