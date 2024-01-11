import {receiveMsg} from 'logic/socket/socket-saga'
import {call, delay, put, race, take} from 'redux-saga/effects'
import socket from 'socket'
import {auth_fail, connect, disconnect, onboarding} from './session-actions'

export function* loginSaga() {
	const {winner: clientWinner, winnerValue: clientWinnerValue} = yield race({
		login: take('LOGIN'),
		signup: take('SIGNUP'),
	})

	socket.connect()

	if (!clientWinnerValue.username || !clientWinnerValue.password) {
		yield put(disconnect('invalid_login'))
		return
	}

	const auth_data = {
		username: clientWinnerValue.username,
		password: clientWinnerValue.password,
	}

	if (clientWinner === 'login') {
		socket.emit('LOGIN', {
			type: 'LOGIN',
			payload: auth_data,
		})
	} else if (clientWinner === 'SIGNUP') {
		if (!clientWinnerValue.email) {
			yield put(disconnect('invalid_email'))
			return
		}
		socket.emit('SIGNUP', {
			type: 'SIGNUP',
			payload: {
				email: clientWinnerValue.email,
				...auth_data,
			}
		})
	}

	const {winner, winnerValue} = yield race({
		login: call(receiveMsg, 'LOGGED_IN'),
		login_fail: call(receiveMsg, 'FAIL_LOGIN'),
		onboard: call(receiveMsg, 'ONBOARDING'),
		signup_fail: call(receiveMsg, 'FAIL_SIGNUP'),
		timeout: delay(10e3), //10 seconds
	})

	switch (winner) {
		case 'login':
			yield put(connect(winnerValue))
		case 'onboard':
			yield put(onboarding())
		case 'login_fail':
		case 'signup_fail':
			yield put(auth_fail(winnerValue.message))
		case 'timeout':
			yield put(disconnect('timeout'))
		default:
			return
	}
}
