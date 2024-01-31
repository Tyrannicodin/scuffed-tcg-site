import {ServerMessage, receiveMsg, sendMsg} from 'logic/socket/socket-saga'
import {call, delay, put, race, take} from 'redux-saga/effects'
import socket from 'socket'
import {connect, disconnect, onboarding, setMessage, updateUserState} from './session-actions'
import store from 'store'
import {getUserSecret} from './session-selectors'
import {all, fork} from 'typed-redux-saga'
import cardSaga from 'logic/cards/cards-saga'
import {
	getEmailError,
	getPasswordError,
	getUsernameError,
	validateEmail,
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

function* verifySaga(saveSecret: boolean) {
	while (true) {
		const {code, failure} = yield race({
			code: take('CODE_SUBMIT'),
			failure: call(receiveMsg, 'AUTH_FAIL'),
		})
		if (failure) {
			yield put(disconnect('Signup failure: One time password timed out'))
			return
		} else if (!code.payload) {
			continue
		}

		sendMsg({
			type: 'VERIFY',
			payload: {
				code: code.payload,
			},
		})

		const {login, failOnSend} = yield race({
			login: call(receiveMsg, 'LOGGED_IN'),
			failOnSend: call(receiveMsg, 'AUTH_FAIL'), //Low chance happening then, but possible
			timeout: delay(2500), //2.5s
		})

		if (login) {
			yield onLogin(login.payload, saveSecret)
		} else if (failOnSend) {
			yield put(disconnect('One time password timed out'))
		} else {
			yield put(setMessage('Incorrect one time password, please double check it'))
			continue
		}
		return
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
	const emailValid = validateEmail(authPayload.email)
	if (clientSignup && !emailValid) {
		yield put(disconnect(getEmailError(emailValid)))
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
		yield call(verifySaga, persistLogin)
	} else if (loginFail || signupFail) {
		yield put(disconnect((loginFail || signupFail).payload.message))
	} else if (timeout) {
		yield put(disconnect('Connection timed out'))
	}
}
