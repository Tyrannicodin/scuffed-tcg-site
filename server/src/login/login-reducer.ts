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
			const {user: newUser} = action.payload as {user: User}
			if (!newUser.secret) return state
			const oldUser = Object.values(state.users).find((user) => newUser.uuid === user.uuid)
			if (oldUser) {
				delete state.users[oldUser.secret]
			}
			state.users[newUser.secret] = newUser
			return {
				...state,
			}
		case 'UPDATE_USER':
			const {user} = action.payload as {user: User}
			if (!state.users[user.secret]) return state
			state.users[user.secret] = user
			return {
				...state,
			}
		case 'REMOVE_USER':
			const {user: {secret}} = action.payload as {user: User}
			delete state.users[secret]
			return {
				...state,
			}
		case 'PURGE_USER':
			const {user: {uuid}} = action.payload as {user: User}
			var purgeUser = Object.values(state.users).find((user) => uuid === user.uuid)
			while (purgeUser) {
				delete state.users[purgeUser.secret]
				purgeUser = Object.values(state.users).find((user) => newUser.uuid === user.uuid)
			}
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
