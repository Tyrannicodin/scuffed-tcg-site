import {cardObjectsResult, createCardObjects} from 'db/db'
import {UnknownAction} from 'redux'
import store from 'stores'
import {call, takeEvery} from 'typed-redux-saga'
import {Card} from '../../../common/models/card'
import { Socket } from 'socket.io'

function* sendCards(action: UnknownAction) {
	const cardList = store.getState().cards.cards
    const payload = action.payload as {start: number, cardCount:number}
	console.log(`${payload.start}:${payload.start+payload.cardCount}`);

    (action.socket as Socket).emit('NEW_CARDS', {
        type: 'NEW_CARDS',
        payload: cardList.splice(payload.start, payload.cardCount)
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
}
