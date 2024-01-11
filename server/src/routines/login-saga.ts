import {createUser, selectUserUUID} from 'db/db'
import { takeEvery } from 'typed-redux-saga'
import {v4 as uuidv4} from 'uuid'

const isValidName = (name: string) => {
	if (name.length < 1) return false
	if (name.length > 25) return false
	return true
}

const isValidPassword = (name:string) => {
	return true
}

async function loginSaga(action: any) {
	const {username, password} = action.payload.payload
	const {socket} = action

	const uuid = await selectUserUUID(username, password)
	console.log(`Login: ${uuid}`)
	if (uuid === null) {
		// Do code when login doesn't work here
		socket.emit('FAIL_LOGIN', {
			type: 'FAIL_LOGIN',
			payload: {
				message: 'Invalid username or password'
			}
		})
		return
	}
	
	const userSecret = uuidv4()

	socket.emit('LOGGED_IN', {
		type: 'LOGGED_IN',
		payload: {
			username,
			userSecret
		}
	})
}

async function signUpSaga(action: any) {
	const {username, password, email} = action.payload.payload
	const {socket} = action

	const result = await createUser(username, email, password)
	if (result !== 'success') {
		socket.emit('FAIL_SIGNUP', {
			type: 'FAIL_SIGNUP',
			payload: {
				message: `Signup failed: ${result.replaceAll('_', ' ')}`
			}
		})
		return
	}

	socket.emit('ONBOARDING', {
		type: 'ONBOARDING'
	})
}

export function* entrySaga() {
	yield* takeEvery('LOGIN', loginSaga)
	yield* takeEvery('SIGNUP', signUpSaga)
}
