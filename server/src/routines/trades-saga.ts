import {all, call, takeEvery} from 'typed-redux-saga'
import {createSale, deleteSale, getSale, getSales} from '../db/trades'
import {updateUser} from './root'
import {addCardsToUser, removeCardsFromUser, updateUserTokens} from 'db/user'
import {Socket} from 'socket.io'
import store from 'stores'
import {getSockets} from 'login/login-selectors'
import {Sale} from '../../../common/models/trade'
import {User} from '../../../common/models/user'

function* createSaleSaga(action: any) {
	const rejectSale = (message: string) => {
		//@TODO: Implement feedback for sales (low priority, normal client blocked from breaking)
	}

	const {card, price, copies} = action.payload
	const user: User = action.user

	if (
		!user.library.some(
			(libraryCard) =>
				libraryCard.card.name === card.name &&
				libraryCard.card.rarity === card.rarity &&
				libraryCard.copies >= copies
		)
	) {
		rejectSale("You don't have enough of that card")
		return
	}
	if (price < 0 && user.tokens < price) {
		rejectSale("You can't list this card for less tokens than you have")
		return
	}

	yield createSale(action.user, {card: card, copies: copies}, price)
	if (price < 0) {
		yield updateUserTokens(action.user.uuid, price)
	}
	yield removeCardsFromUser(action.user.uuid, [card], copies)

	yield updateUser(action.user, action.socket as Socket)
	const {sales} = yield getSales()
	yield all(getSockets(store.getState()).map((socket) => getTradesSaga({socket}, sales)))
}

function* getTradesSaga(action: any, cachedSales: Sale[] | null = null) {
	if (cachedSales === null) {
		const {sales} = yield getSales()
		cachedSales = sales
	}
	action.socket.emit('LOAD_TRADES', {
		type: 'LOAD_TRADES',
		payload: {
			sales: cachedSales,
			trades: [],
		},
	})
}

function* salePurchaseSaga(action: any) {
	const {
		user,
		socket,
		payload: {
			sale: {id},
		},
	}: {user: User; socket: Socket; payload: {sale: Sale}} = action
	const {sale}: {sale: Sale} = yield call(getSale, id)
	if (sale.price > 0 && user.tokens < sale.price) return

	yield updateUserTokens(user.uuid, -sale.price)
	yield addCardsToUser(user.uuid, Array(sale.copies).fill(sale.card))
	yield deleteSale(sale.id)

	yield updateUser(user, socket)
	const {sales} = yield getSales()
	yield all(getSockets(store.getState()).map((socket) => getTradesSaga({socket}, sales)))
}

export function* tradeSaga() {
	yield* takeEvery('GET_TRADES', getTradesSaga)
	yield* takeEvery('CREATE_SALE', createSaleSaga)
	yield* takeEvery('PURCHASE_SALE', salePurchaseSaga)
}
