import {User} from '../../../common/models/user'

export const addUser = (user: User) => ({
	type: 'ADD_USER',
	payload: user,
})

export const updateUser = (user: User) => ({
    type: 'UPDATE_USER',
    payload: user
})
