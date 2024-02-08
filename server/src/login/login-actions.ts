import {User} from '../../../common/models/user'

export const addUser = (user: User) => ({
	type: 'ADD_USER' as const,
	payload: {user},
})

export const updateUserState = (user: User) => ({
	type: 'UPDATE_USER' as const,
	payload: {user},
})

export const removeUser = (user: User) => ({
	type: 'REMOVE_USER' as const,
	payload: {user},
})

export const purgeUser = (user: User) => ({
	type: 'PURGE_USER' as const,
	payload: {user},
})
