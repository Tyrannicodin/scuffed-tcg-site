import {
	createUser,
	deleteUser,
	selectUserInfoFromUuid,
	selectUserUUID,
	updateUserInfo,
} from 'db/user'
import {call, delay, put, race, takeEvery} from 'typed-redux-saga'
import {v4 as uuidv4} from 'uuid'
import {Action} from 'redux'
import {
	getEmailError,
	getPasswordError,
	getUsernameError,
	validateEmail,
	validatePassword,
	validateUsername,
} from '../../../common/util/validation'
import {Uuid, userCreateResultT} from '../../../common/types/user'
import store from 'stores'
import {User} from '../../../common/models/user'
import {addUser, updateUserState} from './login-actions'
import {getUsers} from './login-selectors'
import { Socket } from 'socket.io'

function getDatabaseError(result: userCreateResultT['result']): string {
	switch (result) {
		case 'email_taken':
			return 'That email is already in use'
		case 'username_taken':
			return 'That username is already in use'
		case 'db_connection':
			return "Couldn't connect to database"
		case 'failure':
			return 'Generic failure message, send help'
		default:
			return ''
	}
}

function* loginSaga(action: any) {
	const {username, password, secret} = action.payload
	const {socket}: {socket: Socket} = action
	const state = store.getState()

	console.log(secret)
	if (secret) {
		console.log(getUsers(state))
		const storedUser = getUsers(state)[secret]
		console.log(storedUser)
		if (!storedUser) {
			socket.emit('FAIL_LOGIN', {
				type: 'FAIL_LOGIN',
				payload: {
					message: 'Invalid secret'
				}
			})
			return
		}
		const updatedUser: User = yield updateUserInfo(storedUser)
		yield put(updateUserState(updatedUser))
		socket.emit('LOGGED_IN', {
			type: 'LOGGED_IN',
			payload: updatedUser,
		})
		return
	}

	const uuid: Uuid = yield selectUserUUID(username, password)
	console.log(`Login: ${uuid}`)
	if (uuid === null) {
		socket.emit('FAIL_LOGIN', {
			type: 'FAIL_LOGIN',
			payload: {
				message: 'Incorrect username or password',
			},
		})
		return
	}

	const user: User | null = yield selectUserInfoFromUuid(uuid)
	if (user === null) {
		//This should never happen, as it's checked before but type checking lol
		socket.emit('FAIL_LOGIN', {
			type: 'FAIL_LOGIN',
			payload: {
				message: 'Incorrect username or password',
			},
		})
		return
	}
	user.secret = uuidv4()

	yield put(addUser(user))

	socket.emit('LOGGED_IN', {
		type: 'LOGGED_IN',
		payload: user,
	})
}

function* signUpSaga(action: any) {
	const {username, password, confirmPassword, email} = action.payload
	const {socket} = action

	const fail_signup = (message: string) => {
		socket.emit('FAIL_SIGNUP', {
			type: 'FAIL_SIGNUP',
			payload: {
				message: message,
			},
		})
	}

	const validUsername = validateUsername(username)
	if (validUsername !== 'success') {
		fail_signup(getUsernameError(validUsername))
		return
	}
	const validPassword = validatePassword(password, confirmPassword)
	if (validPassword !== 'success') {
		fail_signup(getPasswordError(validPassword))
		return
	}
	const validEmail = validateEmail(email)
	if (!validEmail) {
		fail_signup(getEmailError(validEmail))
		return
	}

	const {result} = yield call(createUser, username, email, password)
	if (result !== 'success') {
		socket.emit('FAIL_SIGNUP', {
			type: 'FAIL_SIGNUP',
			payload: {
				message: getDatabaseError(result),
			},
		})
		return
	}

	const userSecret = uuidv4()
	const {uuid} = yield call(selectUserUUID, username, password)

	const user: User = yield call(selectUserInfoFromUuid, uuid)
	user.secret = userSecret
	user.authed = false

	store.dispatch({
		type: 'ADD_USER',
		payload: user,
	})

	socket.emit('ONBOARDING', {
		type: 'ONBOARDING',
		payload: user,
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
		const {verify, timeout} = yield race({
			verify: verifyMessage(),
			timeout: delay(endTime - Date.now()), //5 minutes that doesn't reset when a code is entered
		})
		if (verify && verify.payload.userSecret === user.secret) {
			inputCode = verify.payload.code
		} else if (timeout) {
			yield call(deleteUser, username)
			socket.emit('AUTH_FAIL', {
				type: 'AUTH_FAIL',
				payload: {
					message: 'OTP timed out',
				},
			})
			return
		}
	}

	user.authed = true

	socket.emit('LOGGED_IN', {
		type: 'LOGGED_IN',
		payload: user,
	})
}

export function* entrySaga() {
	yield* takeEvery('LOGIN', loginSaga)
	yield* takeEvery('SIGNUP', signUpSaga)
}
