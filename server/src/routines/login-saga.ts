import {createUser, selectUserUUID} from 'db/db'
import {takeEvery} from 'typed-redux-saga'

async function loginSaga(action: any) {
	const {username, password} = action.payload.payload

	const uuid = await selectUserUUID(username, password)
	console.log(uuid)
	if (uuid === null) {
		// Do code when login doesn't work here
		return
	}

	// socket.emit('ONBOARDING', null)
}

async function signUpSaga(action: any) {
	const {username, password, email} = action.payload.payload

	console.log(await createUser(username, email, password))
	console.log(await selectUserUUID(username, password))

	// socket.emit('LOGGED_IN', {
	// 	type: 'LOGGED_IN',
	// 	payload: true,
	// })
}

export function* entrySaga() {
	yield* takeEvery('LOGIN', loginSaga)
	yield* takeEvery('SIGNUP', signUpSaga)
}