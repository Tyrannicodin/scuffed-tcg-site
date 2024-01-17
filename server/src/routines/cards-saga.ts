import {addCardsToPlayer, cardObjectsResult, createCardObjects, selectUserCards} from 'db/db'
import {UnknownAction} from 'redux'
import store from 'stores'
import {call, takeEvery} from 'typed-redux-saga'
import {Card} from '../../../common/models/card'
import {Socket} from 'socket.io'
import {Uuid} from '../../../common/types/user'
import {PartialCardWithCopiesT} from '../../../common/types/cards'

function* sendCards(action: UnknownAction) {
	const cardList = [...store.getState().cards.cards]
	const payload = action.payload as {start: number; cardCount: number}
	console.log(`${payload.start}:${payload.start + payload.cardCount}`)
	;(action.socket as Socket).emit('NEW_CARDS', {
		type: 'NEW_CARDS',
		payload: cardList.splice(payload.start, payload.cardCount),
	})
}

function* sendLibrary(action: UnknownAction) {
	const payload = action.payload as {uuid: Uuid}
	const library: Array<PartialCardWithCopiesT> = yield call(selectUserCards, payload.uuid)
	;(action.socket as Socket).emit('UPDATE_LIBRARY', {
		type: 'UPDATE_LIBRARY',
		payload: library,
	})
}

function* verifyCardRolls(action: UnknownAction) {
	const payload = action.payload as {uuid: Uuid; cards: Array<Card>}
	const result: string = yield call(addCardsToPlayer, payload.uuid, payload.cards)
	if (result !== 'success') return
	const library: Array<PartialCardWithCopiesT> = yield call(selectUserCards, payload.uuid)
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

export function* cardsSaga() {
	yield call(loadCardsSaga)
	yield* takeEvery('GET_CARDS', sendCards)
	yield* takeEvery('GET_LIBRARY', sendLibrary)
	yield* takeEvery('CARDS_ROLLED', verifyCardRolls)
}
