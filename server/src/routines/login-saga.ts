import {takeEvery} from 'typed-redux-saga'

function signInSaga(action: any) {
	const {username, password, socket} = action.payload

	socket.emit('ONBOARDING', null)
}

function signUpSaga(action: any) {
	const {username, password, email, socket} = action.payload`
	INSERT INTO users (hash) VALUES (
		crypt($1, gen_salt('bf'))
	);
	`

	socket.emit('LOGGED_IN', {
		type: 'LOGGED_IN',
		payload: true,
	})
}

export function* loginSaga() {
	yield* takeEvery('LOGIN', signInSaga)
	yield* takeEvery('SIGN_UP', signUpSaga)
}
