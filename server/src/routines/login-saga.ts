import {createUser, deleteUser, selectUserUUID} from 'db/db'
import {call, delay, race, take, takeEvery} from 'typed-redux-saga'
import {v4 as uuidv4} from 'uuid'
import {Action} from 'redux'

const isValidName = (name: string) => {
	if (name.length < 1) return false
	if (name.length > 25) return false
	return true
}

const isValidPassword = (name: string) => {
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
				message: 'Login failed: Invalid username or password',
			},
		})
		return
	}

	const userSecret = uuidv4()

	socket.emit('LOGGED_IN', {
		type: 'LOGGED_IN',
		payload: {
			username,
			userSecret,
			uuid,
		},
	})
}

function* signUpSaga(action: any) {
	const {username, password, email} = action.payload.payload
	const {socket} = action

	if (!isValidName(username) || !isValidPassword(password)) {
		socket.emit('FAIL_SIGNUP', {
			type: 'FAIL_SIGNUP',
			payload: {
				message: 'Signup failed: Invalid username or password',
			},
		})
		return
	}

	const {result} = yield call(createUser, username, email, password)
	if (result !== 'success') {
		socket.emit('FAIL_SIGNUP', {
			type: 'FAIL_SIGNUP',
			payload: {
				message: `Signup failed: ${result.replaceAll('_', ' ')}`,
			},
		})
		return
	}

	const userSecret = uuidv4()
	const {uuid} = yield call(selectUserUUID, username, password)

	socket.emit('ONBOARDING', {
		type: 'ONBOARDING',
		payload: {
			username,
			userSecret,
			uuid,
		},
	})

	const verifyMessage = () =>
		new Promise<Action>((resolve) => {
			const listener = (message: Action) => {
				resolve(message)
			}
			socket.once('VERIFY', listener)
		})

	var code = Math.floor(Math.random() * 10000000).toString(16)
	while (code.length < 6) {
		code = '0' + code
	}
	console.log(code)

	const endTime = Date.now() + 5 * 60 * 1000
	var inputCode = ''
	while (code !== inputCode) {
		//@FIXME remove second part to enable OTP check
		const {verify, timeout} = yield race({
			verify: verifyMessage(),
			timeout: delay(endTime - Date.now()), //5 minutes
		})
		if (verify && verify.payload.userSecret === userSecret) {
			inputCode = verify.payload.code
		} else if (timeout) {
			yield call(deleteUser, username)
			socket.emit('AUTH_FAIL', {
				type: 'AUTH_FAIL',
				payload: {
					message: 'Signup failed: OTP timed out',
				},
			})
			return
		}
	}

	socket.emit('LOGGED_IN', {
		type: 'LOGGED_IN',
		payload: {
			username,
			userSecret,
			uuid,
		},
	})
}

export function* entrySaga() {
	yield* takeEvery('LOGIN', loginSaga)
	yield* takeEvery('SIGNUP', signUpSaga)
}
