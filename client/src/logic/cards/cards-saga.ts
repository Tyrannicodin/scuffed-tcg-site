import {UnknownAction} from 'redux'
import store from 'store'
import {put, takeEvery} from 'typed-redux-saga'
import {getCards} from './cards-selectors'
import {Card} from 'common/models/card'
import {newCard as addNewCards, updateRollResults, updateShop} from './cards-actions'
import {receiveMsg, sendMsg} from 'logic/socket/socket-saga'
import {getUser, getUuid} from 'logic/session/session-selectors'
import {PastPurchasesT} from 'common/types/user'
import {Sale} from 'common/models/trade'
import {ShopT} from 'common/types/shop'

function* newCardsSaga(action: UnknownAction) {
	const state = store.getState()
	const cards = getCards(state)
	const initialPayload = action.payload as {cardCount: number}

	sendMsg({
		type: 'GET_CARDS',
		payload: {
			start: cards.length,
			cardCount: initialPayload.cardCount,
		},
	})

	const {payload}: {payload: Card[]} = yield receiveMsg('NEW_CARDS')

	const newCards = payload.filter(
		(card) => !cards.find((value) => value.name === card.name && value.rarity === card.rarity)
	)

	yield put(addNewCards(newCards))
}

function* shopUpdateSaga(action: UnknownAction) {
	const state = store.getState()
	const cards = getCards(state)
	const initialPayload = action.payload as {cardCount: number}

	sendMsg({
		type: 'GET_SHOP',
		payload: {},
	})

	const {payload}: {payload: ShopT} = yield receiveMsg('UPDATE_SHOP')

	yield put(updateShop(payload))
}

function* lastRollResultSaga(action: UnknownAction) {
	const state = store.getState()
	const uuid = getUuid(state)
	const initialPayload = action.payload as {
		cards: Array<Card>
		metadata: PastPurchasesT
		cost: number
	}

	sendMsg({
		type: 'CARDS_ROLLED',
		payload: {
			cards: initialPayload.cards,
			uuid: uuid,
			metadata: initialPayload.metadata,
			cost: initialPayload.cost,
		},
	})

	const {payload}: {payload: Array<Card>} = yield receiveMsg('ROLL_VERIFIED')

	const newCards = payload

	yield put(updateRollResults(newCards))
}

function* getTradesSaga() {
	sendMsg({
		type: 'GET_TRADES',
		payload: {},
	})
}

function* createSaleSaga(action: UnknownAction) {
	sendMsg(action) //@TODO: Make better somehow
}

function* purchaseSaleSaga(action: UnknownAction) {
	const {sale} = action.payload as {sale: Sale}
	const user = getUser(store.getState())

	if (!user) return
	//if (!user || !user.library.some((card) => card.card === sale.card && card.copies > sale.copies)) return
	if (sale.price > 0 && user.tokens < sale.price) return
	sendMsg({
		type: 'PURCHASE_SALE',
		payload: {sale},
	})
}

function* createDeckSaga(action: UnknownAction) {
	sendMsg(action) //@TODO: Make better somehow
}

function* importDeckSaga(action: UnknownAction) {
	sendMsg(action) //@TODO: Make better somehow
}

function* modifyDeckSaga(action: UnknownAction) {
	sendMsg(action) //@TODO: Make better somehow
}

export default function* cardSaga() {
	yield* takeEvery('GET_CARDS', newCardsSaga)
	yield* takeEvery('GET_SHOP', shopUpdateSaga)
	yield* takeEvery('CARDS_ROLLED', lastRollResultSaga)
	yield* takeEvery('GET_TRADES', getTradesSaga)
	yield* takeEvery('CREATE_SALE', createSaleSaga)
	yield* takeEvery('PURCHASE_SALE', purchaseSaleSaga)
	yield* takeEvery('CREATE_DECK', createDeckSaga)
	yield* takeEvery('IMPORT_DECK', importDeckSaga)
	yield* takeEvery('MODIFY_DECK', modifyDeckSaga)
}
