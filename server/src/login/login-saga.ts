import {
	createUser,
	deleteUser,
	selectUserInfoFromUuid,
	selectUserTokenSecret,
	selectUserUUID,
	selectUserUUIDUnsecure,
	updateUserInfo,
	updateUserPassword,
} from 'db/user'
import {call, delay, put, race, take, takeEvery} from 'typed-redux-saga'
import {v4 as uuidv4} from 'uuid'
import {
	getPasswordError,
	getUsernameError,
	validatePassword,
	validateUsername,
} from '../../../common/util/validation'
import {Uuid, userCreateResultT} from '../../../common/types/user'
import store from 'stores'
import {User} from '../../../common/models/user'
import {addUser, purgeUser, removeUser, updateUserState} from './login-actions'
import {getUsers} from './login-selectors'
import {Socket} from 'socket.io'
import {authenticator} from 'otplib'
import {CONFIG} from '../../../common/config'
import {UnknownAction} from 'redux'
import {updateUser} from 'routines/root'

function getDatabaseError(result: userCreateResultT['result']): string {
	switch (result) {
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

function* takeFromSocket(socket: Socket, eventType: string) {
	while (true) {
		const event = (yield take(eventType)) as {socket: Socket}
		const {socket: eventSocket} = event
		if (eventSocket === socket) return event
	}
}

function* loginSaga(action: any) {
	const {username, password, secret} = action.payload
	const {socket}: {socket: Socket} = action
	const state = store.getState()

	if (secret) {
		const storedUser = getUsers(state)[secret]
		if (!storedUser) {
			socket.emit('FAIL_LOGIN', {
				type: 'FAIL_LOGIN',
				payload: {
					message: 'Invalid secret',
				},
			})
			return
		}
		const updatedUser: User = yield updateUserInfo(storedUser)
		updatedUser.secret = uuidv4()
		yield put(updateUserState(updatedUser))
		socket.emit('LOGGED_IN', {
			type: 'LOGGED_IN',
			payload: {user: updatedUser},
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

	const user: User | null = yield call(selectUserInfoFromUuid, uuid)
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
		payload: {user},
	})
}

function* signUpSaga(action: any) {
	const {username, password, confirmPassword} = action.payload
	const {socket} : {socket: Socket} = action

	const fail_signup = (message: string) => {
		socket.emit('FAIL_SIGNUP', {
			type: 'FAIL_SIGNUP',
			payload: {
				message: message,
			},
		})
	}
	if (!(username && password && confirmPassword)) {
		fail_signup("Couldn't get some signup data")
		return
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

	const {result} = yield call(createUser, username, password)
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
	const uuid: Uuid | null = yield call(selectUserUUID, username, password)
	if (uuid === null) {
		fail_signup('Unknown error')
		return
	}

	var user: User = yield call(selectUserInfoFromUuid, uuid)
	while (!user) {
		yield delay(500)
		user = yield call(selectUserInfoFromUuid, uuid)
	}
	user.secret = userSecret
	user.authed = false

	yield put(addUser(user))

	const tokenSecret: string = yield call(selectUserTokenSecret, user)
	const tokenUri = authenticator.keyuri(user.username, CONFIG.otpIssuer, tokenSecret)

	socket.emit('ONBOARDING', {
		type: 'ONBOARDING',
		payload: {user, tokenUri, tokenSecret},
	})

	const {gotUser} = yield race({
		gotUser: takeFromSocket(socket, 'CODE_READY'),
		disconnect: takeFromSocket(socket, 'CLIENT_DISCONNECTED'),
		timeout: delay(5*60*1000)
	})

	if (!gotUser) {
		fail_signup('Timed out (or socket disconnected)')
		yield call(deleteUser, user.uuid)
		return
	}

	const verifyResult: 'success' | 'failure' | 'unknown' = yield verificationSaga(
		user,
		action.socket
	)

	if (verifyResult != 'success') {
		if (verifyResult === 'failure') {
			fail_signup('OTP not entered in time')
		} else if (verifyResult === 'unknown') {
			fail_signup('Unknown error, please re-try signup')
		}

		yield call(deleteUser, user.uuid)
		return
	}

	user.authed = true

	socket.emit('LOGGED_IN', {
		type: 'LOGGED_IN',
		payload: {user},
	})
}

function* verificationSaga(user: User, socket: Socket) {
	socket.emit('OTP_START', {
		type: 'OTP_START',
		payload: {},
	})
	const {timeout, cancel, verfified} = yield race({
		timeout: delay(1000 * 60 * 5),
		verfified: verificationLoop(user, socket),
		cancel: takeFromSocket(socket, 'OTP_CANCEL'),
	})
	const result = timeout | cancel ? 'failure' : verfified ? 'success' : 'unknown'
	socket.emit('OTP_END', {
		type: 'OTP_END',
		payload: {result},
	})
	return result
}

function* verificationLoop(user: User, socket: Socket) {
	const tokenSecret: string = yield call(selectUserTokenSecret, user)
	while (true) {
		const token: UnknownAction = yield takeFromSocket(socket, 'OTP_SUBMIT')
		if (!token.user || (token.user as User).uuid != user.uuid) continue
		const payload = token.payload as {code: string}
		if (!payload) continue
		if (authenticator.check(payload.code, tokenSecret)) {
			socket.emit('OTP_SUCCESS', {
				type: 'OTP_SUCCESS',
				payload: {},
			})
			return true
		} else {
			socket.emit('OTP_FAIL', {
				type: 'OTP_FAIL',
				payload: {message: 'Invalid OTP entered'},
			})
		}
	}
}

function* otpLoginSaga(action: any) {
	const {socket, payload} = action
	const uuid: string = yield selectUserUUIDUnsecure(payload.username)
	const user: User | null = yield selectUserInfoFromUuid(uuid)
	if (!user) {
		socket.emit('FAIL_LOGIN', {
			type: 'FAIL_LOGIN',
			payload: {
				message: 'Invalid username',
			},
		})
		return
	}
	user.authed = false
	user.secret = uuidv4()
	yield put(addUser(user))

	socket.emit('TARGET_USER', {
		type: 'TARGET_USER',
		payload: {
			user,
		},
	})
	const verifyResult: 'success' | 'failure' | 'unknown' = yield verificationSaga(
		user,
		action.socket
	)
	if (verifyResult === 'success') {
		user.authed = true

		socket.emit('LOGGED_IN', {
			type: 'LOGGED_IN',
			payload: {user},
		})
	}
}

function* logoutSaga(action: any) {
	const {user, socket}: {user: User; socket: Socket} = action
	yield put(removeUser(user))
	socket.disconnect()
}

function* deleteAccountSaga(action: any) {
	const {user, socket}: {user: User; socket: Socket} = action
	const result: 'success' | 'failure' = yield verificationSaga(user, socket)
	if (result === 'success') {
		const {result} = yield deleteUser(user.uuid)
		if (result === 'success') {
			yield put(purgeUser(user))
			socket.emit('LOGOUT', {
				type: 'LOGOUT',
				payload: {},
			})
			socket.disconnect()
		}
	}
	socket.emit('DELETE_FAIL', {
		type: 'DELETE_FAIL',
		payload: {},
	})
}

function* resetPasswordSaga(action: any) {
	const {user, socket}: {user: User; socket: Socket} = action
	const {newPassword, confirmPassword}: {newPassword: string; confirmPassword: string} =
		action.payload
	const validPassword = validatePassword(newPassword, confirmPassword)
	if (validPassword != 'success') {
		socket.emit('RESET_FAIL', {
			type: 'RESET_FAIL',
			payload: {reason: validPassword},
		})
		return
	}
	socket.emit('RESET_START', {
		type: 'RESET_START',
		payload: {},
	})
	const result: 'success' | 'failure' = yield verificationSaga(user, socket)
	if (result === 'success') {
		yield updateUserPassword(user, newPassword)
	}
}

export function* entrySaga() {
	yield* takeEvery('LOGIN', loginSaga)
	yield* takeEvery('SIGNUP', signUpSaga)
	yield* takeEvery('OTP_LOGIN', otpLoginSaga)
	yield* takeEvery('DELETE_ACCOUNT', deleteAccountSaga)
	yield* takeEvery('RESET_PASSWORD', resetPasswordSaga)
	yield* takeEvery('LOGOUT', logoutSaga)
}
