import {ServerMessage, receiveMsg, sendMsg} from 'logic/socket/socket-saga'
import {call, delay, put, race, take} from 'redux-saga/effects'
import socket from 'socket'
import {connect, disconnect, onboarding, otpEnd, otpStart, setMessage, updateUserState} from './session-actions'
import {all, fork} from 'typed-redux-saga'
import cardSaga from 'logic/cards/cards-saga'
import {
	getPasswordError,
	getUsernameError,
	validatePassword,
	validateUsername,
} from 'common/util/validation'
import {User} from 'common/models/user'
import {loadTrades} from 'logic/cards/cards-actions'

function* onLogin(user: User, saveSecret: boolean) {
	if (saveSecret && user.secret) {
		localStorage.setItem('secret', user.secret)
	}
	yield* all([
		put(connect(user)),
		fork(cardSaga),
		put({
			type: 'GET_CARDS',
			payload: {
				cardCount: 10000,
			},
		}),
		put({
			type: 'GET_SHOP',
			payload: {},
		}),
		fork(listen('UPDATE_USER', updateUserState)),
		fork(listen('LOAD_TRADES', loadTrades)),
	]) //Init rest of client logic

	yield
}

function listen(event: string, action: (payload: any) => any) {
	function* inner() {
		while (true) {
			const result: ServerMessage = yield receiveMsg(event)
			yield put(action(result.payload))
		}
	}
	return inner
}

function* otpSaga() {
	yield receiveMsg('OTP_START')
	yield put(otpStart())

	while (true) {
		const {code, failure} = yield race({
			code: take('CODE_SUBMIT'),
			failure: call(receiveMsg, 'OTP_END'),
		})
		if (failure) {
			yield put(setMessage('OTP timed out'))
			yield put(otpEnd())
			return 'failure'
		} else if (!code.payload) {
			continue
		}

		sendMsg({
			type: 'OTP_SUBMIT',
			payload: {
				code: code.payload.code,
			},
		})

		const {success, incorrect} = yield race({
			success: call(receiveMsg, 'OTP_SUCCESS'),
			incorrect: call(receiveMsg, 'OTP_FAIL'),
			failOnSend: call(receiveMsg, 'OTP_END'), //Low chance happening then, but possible
		})

		if (success) {
			yield put(otpEnd())
			return 'success'
		} else if (incorrect) {
			yield put(setMessage('Incorrect one time password, please double check it'))
		} else {
			yield put(setMessage('OTP timed out'))
			yield put(otpEnd())
			return 'failure'
		}
	}
}

export function* loginSaga() {
	if (localStorage.getItem('secret')) {
		socket.connect()
		socket.emit('LOGIN', {
			type: 'LOGIN',
			payload: {
				secret: localStorage.getItem('secret'),
			},
		})

		const {login} = yield race({
			login: call(receiveMsg, 'LOGGED_IN'),
			loginFail: call(receiveMsg, 'FAIL_LOGIN'),
			timeout: delay(2500),
		})

		if (login) {
			yield onLogin(login.payload, true)
			return
		}
	}

	const {login: clientLogin, signup: clientSignup} = yield race({
		login: take('LOGIN'),
		signup: take('SIGNUP'),
	})

	const authPayload = (clientLogin || clientSignup).payload
	const {persistLogin} = authPayload
	const usernameValid = validateUsername(authPayload.username)
	if (usernameValid !== 'success') {
		yield put(disconnect(getUsernameError(usernameValid)))
	}
	const passwordValid = validatePassword(authPayload.password, authPayload.confirmPassword)
	if (clientSignup && passwordValid !== 'success') {
		yield put(disconnect(getPasswordError(passwordValid)))
	}

	socket.connect()

	if (clientLogin) {
		socket.emit('LOGIN', {
			type: 'LOGIN',
			payload: clientLogin.payload,
		})
	} else if (clientSignup) {
		socket.emit('SIGNUP', {
			type: 'SIGNUP',
			payload: clientSignup.payload,
		})
	}

	const {login, loginFail, onboard, signupFail, timeout} = yield race({
		login: call(receiveMsg, 'LOGGED_IN'),
		loginFail: call(receiveMsg, 'FAIL_LOGIN'),
		onboard: call(receiveMsg, 'ONBOARDING'),
		signupFail: call(receiveMsg, 'FAIL_SIGNUP'),
		timeout: delay(10000), //10 seconds
	})

	if (login) {
		yield onLogin(login.payload, persistLogin)
	} else if (onboard) {
		yield put(onboarding(onboard.payload))
		const authResult: string = yield otpSaga()
		if (authResult === 'failure') {
			yield put(disconnect('OTP timed out'))
		}
	} else if (loginFail || signupFail) {
		yield put(disconnect((loginFail || signupFail).payload.message))
	} else if (timeout) {
		yield put(disconnect('Connection timed out'))
	}
}
