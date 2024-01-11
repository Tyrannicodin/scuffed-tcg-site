import {createUser} from 'db/db'
import {takeEvery} from 'typed-redux-saga'

function loginSaga(action: any) {
	const {username, password, socket} = action.payload

	socket.emit('ONBOARDING', null)
}

function signUpSaga(action: any) {
	const {username, password, email, socket} = action.payload

	createUser(password, username, email)

	socket.emit('LOGGED_IN', {
		type: 'LOGGED_IN',
		payload: true,
	})
}

export function* entrySaga() {
	yield* takeEvery('LOGIN', loginSaga)
	yield* takeEvery('SIGN_UP', signUpSaga)
}
