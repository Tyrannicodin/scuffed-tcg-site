import {all, takeEvery} from 'typed-redux-saga'
import {createSale, getSales} from '../db/trades'
import {updateUser} from './root'
import {removeCardsFromUser, updateUserTokens} from 'db/user'
import {Socket} from 'socket.io'
import store from 'stores'
import {getSockets} from 'login/login-selectors'

function* createSaleSaga(action: any) {
	const {card, price, copies} = action.payload
	yield createSale(action.user, {card: card, copies: copies}, price)
	if (price < 0) {
		yield updateUserTokens(action.user.uuid, price)
	}
	yield removeCardsFromUser(action.user.uuid, [card], copies)

	yield updateUser(action.user, action.socket as Socket)
	yield all(getSockets(store.getState()).map(getTradesSaga))
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
