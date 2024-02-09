import {setMessage} from 'logic/session/session-actions'
import {loginSaga} from './logic/session/session-saga'
import {SagaIterator, UnknownAction} from 'redux-saga'
import {call, delay, put, race, take, takeLatest} from 'redux-saga/effects'

export function* messageSaga(action: UnknownAction) {
	if (!action.payload) return
	yield delay(2500)
	yield put(setMessage(''))
}

export default function* rootSaga(): SagaIterator {
	yield takeLatest('SET_MESSAGE', messageSaga)
	while (true) {
		const {disconnect} = yield race({
			disconnect: take('DISCONNECT'),
			app: call(loginSaga),
		})
		if (disconnect) {
			yield put(setMessage(disconnect.payload))
		}
	}
}
