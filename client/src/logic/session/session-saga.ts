import {receiveMsg} from 'logic/socket/socket-saga'
import {call, delay, put, race, take, takeLatest} from 'redux-saga/effects'
import socket from 'socket'
import {connect, disconnect, onboarding, setMessage} from './session-actions'
import store from 'store'
import {getOTPCode, getUserSecret} from './session-selectors'
import {all, fork} from 'typed-redux-saga'
import cardSaga from 'logic/cards/cards-saga'
import {userInfoT} from 'common/types/user'

function validPassword(password: string, retyped: string | null): boolean {
	if (retyped !== null && password !== retyped) return false
	
	return true
}

function validEmail(email: string): boolean {
	return true
}

function validUsername(username:string): boolean {
	return true
}

function* onLogin(userInfo: userInfoT) {
	yield put(connect(userInfo))
	store.dispatch({
		type: 'GET_CARDS',
		payload: {
			cardCount: 10000,
		},
	})
	store.dispatch({
		type: 'GET_LIBRARY',
		payload: {uuid: userInfo.uuid},
	})
	yield all([fork(cardSaga)]) //Init rest of client
}

function* verifySaga() {
	while (true) {
		const {failure} = yield race({
			code: take('CODE_SUBMIT'),
			failure: call(receiveMsg, 'AUTH_FAIL'),
		})
		if (failure) {
			yield put(disconnect('Signup failure: One time password timed out'))
			return
		}

		const state = store.getState()

		socket.emit('VERIFY', {
			type: 'VERIFY',
			payload: {
				code: getOTPCode(state),
				userSecret: getUserSecret(state),
			},
		})

		const {login, failOnSend} = yield race({
			login: call(receiveMsg, 'LOGGED_IN'),
			failOnSend: call(receiveMsg, 'AUTH_FAIL'), //Low chance happening then, but possible
			timeout: delay(2500), //2.5s
		})

		if (login) {
			yield onLogin(login.payload)
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
	const {login: clientLogin, signup: clientSignup} = yield race({
		login: take('LOGIN'),
		signup: take('SIGNUP'),
	})

	const authPayload = (clientLogin || clientSignup).payload
	if (!authPayload.username) {
		yield put(disconnect('Invalid username'))
	}
	if (clientSignup && !authPayload.email) {
		yield put(disconnect('Invalid email'))
	}

	socket.connect()

	if (clientLogin) {
		socket.emit('LOGIN', {
			type: 'LOGIN',
			payload: {...clientLogin},
		})
	} else if (clientSignup) {
		socket.emit('SIGNUP', {
			type: 'SIGNUP',
			payload: {
				...clientSignup,
			},
		})
	}

	const {login, login_fail, onboard, signup_fail, timeout} = yield race({
		login: call(receiveMsg, 'LOGGED_IN'),
		login_fail: call(receiveMsg, 'FAIL_LOGIN'),
		onboard: call(receiveMsg, 'ONBOARDING'),
		signup_fail: call(receiveMsg, 'FAIL_SIGNUP'),
		timeout: delay(10000), //10 seconds
	})

	if (login) {
		yield onLogin(login.payload)
	} else if (onboard) {
		yield put(onboarding(onboard.payload))
		yield call(verifySaga)
	} else if (login_fail || signup_fail) {
		yield put(disconnect((login_fail || signup_fail).payload.message))
	} else if (timeout) {
		yield put(disconnect('Connection timed out'))
	}
}
