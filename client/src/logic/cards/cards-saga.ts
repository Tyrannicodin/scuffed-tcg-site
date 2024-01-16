import {UnknownAction} from 'redux'
import store from 'store'
import {put, take, takeEvery} from 'typed-redux-saga'
import {getCards} from './cards-selectors'
import {Card} from 'common/models/card'
import {newCard as addNewCards, updateLibrary} from './cards-actions'
import socket from 'socket'
import {receiveMsg} from 'logic/socket/socket-saga'

function* newCardsSaga(action: UnknownAction) {
	const state = store.getState()
	const cards = getCards(state)
	const initialPayload = action.payload as {cardCount: number}

	socket.emit('GET_CARDS', {
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

import {getUuid} from 'logic/session/session-selectors'
import {PartialCardWithCopiesT} from 'common/types/cards'

function* updateLibrarySaga(action: UnknownAction) {
	const state = store.getState()
	const uuid = getUuid(state)

	socket.emit('GET_LIBRARY', {
		type: 'GET_LIBRARY',
		payload: {
			uuid: uuid,
		},
	})

	const {payload}: {payload: PartialCardWithCopiesT[]} = yield receiveMsg('UPDATE_LIBRARY')

	const newCards = payload
	console.log(newCards)

	yield put(updateLibrary(newCards))
}

export default function* cardSaga() {
	yield* takeEvery('GET_CARDS', newCardsSaga)
	yield* takeEvery('GET_LIBRARY', updateLibrarySaga)
}
