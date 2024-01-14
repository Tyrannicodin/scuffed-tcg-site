import { UnknownAction } from "redux";
import store from "store";
import { put, take, takeEvery } from "typed-redux-saga";
import { getCards } from "./cards-selectors";
import { Card } from "common/models/card";
import { newCard } from "./cards-actions";
import socket from "socket";

function* newCardsSaga(action: UnknownAction) {
    const state = store.getState()
    const cards = getCards(state)

    socket.emit('GET_CARDS', {
        type:'GET_CARDS',
        payload: {
            start: cards.length,
            count: action.cardCount
        }
    })

    const {payload}:{payload:Card[]} = yield take('NEW_CARDS');
    
    for (var i = 0; i<payload.length; i++) {
        const card = payload[i]

        if (cards.find((value) => value.name === card.name && value.rarity === card.rarity))
            return
        yield put(newCard(card))
    }
}

export default function* cardSaga() {
    yield* takeEvery('GET_CARDS', newCardsSaga)
}