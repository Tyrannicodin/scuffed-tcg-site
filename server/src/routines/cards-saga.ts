import {cardObjectsResult, createCardObjects} from 'db/db'
import {addCardsToUser, addPurchaseToUser, selectUserInfoFromUuid, updateUserTokens} from 'db/user'
import {UnknownAction} from 'redux'
import store from 'stores'
import {call, takeEvery} from 'typed-redux-saga'
import {Card} from '../../../common/models/card'
import {Socket} from 'socket.io'
import {PastPurchasesT, userInventoryT, Uuid} from '../../../common/types/user'
import {PartialCardWithCopiesT} from '../../../common/types/cards'
import {getDailyShop, getFormattedDate} from '../../../common/functions/daily-shop'
import {User} from '../../../common/models/user'
import {getSales} from 'db/trades'

function* sendCards(action: UnknownAction) {
	const cardList = [...store.getState().cards.cards]
	const payload = action.payload as {start: number; cardCount: number}
	;(action.socket as Socket).emit('NEW_CARDS', {
		type: 'NEW_CARDS',
		payload: cardList.splice(payload.start, payload.cardCount),
	})
}

function* sendLibrary(action: UnknownAction) {
	const purchaseDate = getFormattedDate()

	const payload = action.payload as {uuid: Uuid}
	const user: User = yield call(selectUserInfoFromUuid, payload.uuid)

	const information: userInventoryT = {
		library: user.library,
		tokens: user.tokens,
		// Double equals instead of triple equals here is intentional
		pastPurchases: user.purchases.filter((p) => p.date == purchaseDate),
	}

	;(action.socket as Socket).emit('UPDATE_LIBRARY', {
		type: 'UPDATE_LIBRARY',
		payload: information,
	})
}

function* verifyCardRolls(action: UnknownAction) {
	const payload = action.payload as {
		uuid: Uuid
		cards: Array<Card>
		metadata: PastPurchasesT
		cost: number
	}

	const cardResult: string = yield call(addCardsToUser, payload.uuid, payload.cards)

	yield call(addPurchaseToUser, payload.uuid, payload.metadata)
	yield call(updateUserTokens, payload.uuid, payload.cost * -1)
	if (cardResult !== 'success') return
	;(action.socket as Socket).emit('ROLL_VERIFIED', {
		type: 'ROLL_VERIFIED',
		payload: payload.cards,
	})
}

function* loadCardsSaga() {
	const {hermitCards, effectCards, itemCards}: cardObjectsResult = yield createCardObjects()
	const cards = ([] as Card[]).concat(hermitCards).concat(effectCards).concat(itemCards)

	store.dispatch({
		type: 'LOAD_CARDS',
		payload: cards,
	})
}

function* getTradesSaga(action: any) {
	const {sales} = yield getSales()
	action.socket.emit('UPDATE_TRADES', {
		type: 'UPDATE_TRADES',
		payload: {
			sales,
			trades: [],
		},
	})
}

export function* cardsSaga() {
	yield call(loadCardsSaga)
	yield* takeEvery('GET_CARDS', sendCards)
	yield* takeEvery('GET_LIBRARY', sendLibrary)
	yield* takeEvery('CARDS_ROLLED', verifyCardRolls)
	yield* takeEvery('GET_TRADES', getTradesSaga)
}
