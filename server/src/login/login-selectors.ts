import {User} from '../../../common/models/user'
import {RootState} from '../stores'
import {UsersState} from './login-reducer'

export function getUserState(state: RootState): UsersState {
	return state.users as UsersState
}

export function getUsers(state: RootState): User[] {
	return getUserState(state).users
}
