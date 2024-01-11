import {receiveMsg} from 'logic/socket/socket-saga'
import {call, delay, put, race, take} from 'redux-saga/effects'
import socket from 'socket'
import {auth_fail, connect, disconnect, onboarding} from './session-actions'

export function* loginSaga() {
	const {login: clientLogin, signup: clientSignup} = yield race({
		login: take('LOGIN'),
		signup: take('SIGNUP'),
	})

	const authPayload = (clientLogin || clientSignup).payload
	if (!authPayload.username || !authPayload.password) {
		yield put(disconnect('Invalid login credentials'))
	}
	if (clientSignup && !authPayload.email) {
		yield put(disconnect('Invalid login credentials'))
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
		timeout: delay(10e3), //10 seconds
	})

	if (login) {
		yield put(connect(login))
	} else if (onboard) {
		yield put(onboarding())
	} else if (login_fail || signup_fail) {
		yield put(disconnect((login_fail || signup_fail).message))
	} else if (timeout) {
		yield put(disconnect('Connection timed out'))
	}
}
