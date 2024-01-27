import {UnknownAction} from 'redux'
import {User} from '../../../common/models/user'

type UsersState = {
	users: User[]
}

const defaultState: UsersState = {
	users: [],
}

function userReducer(state = defaultState, action: UnknownAction) {
	if (!action.payload) return state
    if (action.socket) return state
	switch (action.type) {
		case 'USER_LOGIN':
            state.users.push(action.payload as User)
			return {
				...state
			}
		default:
			return state
	}
}

export default userReducer
