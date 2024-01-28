import {UnknownAction} from 'redux'
import {User} from '../../../common/models/user'

export type UsersState = {
	users: User[]
}

const defaultState: UsersState = {
	users: [],
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
		default:
			return state
	}
}

export default userReducer
