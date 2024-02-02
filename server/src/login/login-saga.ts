import {
	createUser,
	deleteUser,
	selectUserInfoFromUuid,
	selectUserTokenSecret,
	selectUserUUID,
	updateUserInfo,
} from 'db/user'
import {call, delay, put, race, take, takeEvery} from 'typed-redux-saga'
import {v4 as uuidv4} from 'uuid'
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
import {Socket} from 'socket.io'
import {totp} from 'otplib'
import { CONFIG } from '../../../common/config'
import {base32Encode} from '@ctrl/ts-base32'
import { UnknownAction } from 'redux'

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
	if (!(username && password && confirmPassword && email)) {
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
	const uuid: Uuid | null = yield call(selectUserUUID, username, password)
	if (uuid === null) {
		fail_signup('Unknown error')
		return
	}

	var user: User = yield call(selectUserInfoFromUuid, uuid)
	while (!user) {
		console.log(user)
		yield delay(500)
		user = yield call(selectUserInfoFromUuid, uuid)
	}
	user.secret = userSecret
	user.authed = false

	yield put({
		type: 'ADD_USER',
		payload: user,
	})

	const tokenBytes: Buffer = yield call(selectUserTokenSecret, user)
	const tokenSecret = totp.keyuri(user.username, CONFIG.otpIssuer, base32Encode(tokenBytes))

	socket.emit('ONBOARDING', {
		type: 'ONBOARDING',
		payload: {user, tokenSecret},
	})

	const verifyResult: 'success' | 'failure' | 'unknown' = yield verificationSaga(user, base32Encode(tokenBytes), action.socket)

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
		payload: user,
	})
}

function* verificationSaga(user: User, tokenSecret: string, socket: Socket) {
	socket.emit('OTP_START', {
		type: 'OTP_START',
		payload: {}
	})
	const {timeout, verfified} = yield race({
		timeout: delay(1000 * 60 *5),
		verfified: verificationLoop(user, tokenSecret, socket),
	})
	const result = timeout ? 'failure' : verfified ? 'success' : 'unknown'
	socket.emit('OTP_END', {
		type: 'OTP_END',
		payload: {result}
	})
	return result
}

function* verificationLoop(user: User, tokenSecret: string, socket: Socket) {
	while (true) {
		const token: UnknownAction = yield take('OTP_SUBMIT')
		if (!token.user || (token.user as User).uuid != user.uuid) continue
		const payload = token.payload as {token: string}
		if (!payload) return
		if (totp.check(payload.token, tokenSecret)) {
			socket.emit('OTP_SUCCESS', {
				type: 'OTP_SUCCESS',
				payload: {}
			})
			return
		} else {
			socket.emit('OTP_FAIL', {
				type: 'OTP_FAIL',
				payload: {message: 'Invalid OTP entered'}
			})
		}
	}
}

export function* entrySaga() {
	yield* takeEvery('LOGIN', loginSaga)
	yield* takeEvery('SIGNUP', signUpSaga)
}
