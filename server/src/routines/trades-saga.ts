import {takeEvery} from 'typed-redux-saga'
import {getSales} from '../db/trades'

function* createSaleSaga(action: any) {
	console.log(action)
}

function* getTradesSaga(action: any) {
	const {sales} = yield getSales()
	action.socket.emit('LOAD_TRADES', {
		type: 'LOAD_TRADES',
		payload: {
			sales,
			trades: [],
		},
	})
}

export function* tradeSaga() {
	yield* takeEvery('GET_TRADES', getTradesSaga)
	yield* takeEvery('CREATE_SALE', createSaleSaga)
}
