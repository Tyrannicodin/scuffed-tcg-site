import sessionSaga from './logic/session/session-saga'
import {SagaIterator} from 'redux-saga'
import {call, race, take} from 'redux-saga/effects'

export default function* rootSaga(): SagaIterator {
	while (true) {
		const {disconnect} = yield race({
			disconnect: take('DISCONNECT'),
			app: call(sessionSaga)
		})
		if (disconnect)
			console.log("Disconnected: ", disconnect.payload)
	}
}
