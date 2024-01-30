import {cardObjectsResult, createCardObjects} from 'db/db'
import {addCardsToUser, addPurchaseToUser, updateUserTokens} from 'db/user'
import {UnknownAction} from 'redux'
import store from 'stores'
import {call, takeEvery} from 'typed-redux-saga'
import {Card} from '../../../common/models/card'
import {Socket} from 'socket.io'
import {PastPurchasesT} from '../../../common/types/user'
import {User} from '../../../common/models/user'
import {updateUser} from './root'

function* sendCards(action: UnknownAction) {
	const cardList = [...store.getState().cards.cards]
	const payload = action.payload as {start: number; cardCount: number}
	;(action.socket as Socket).emit('NEW_CARDS', {
		type: 'NEW_CARDS',
		payload: cardList.splice(payload.start, payload.cardCount),
	})
}

function* verifyCardRolls(action: UnknownAction) {
	const user = action.user as User
	const payload = action.payload as {
		cards: Array<Card>
		metadata: PastPurchasesT
		cost: number
	}

	const cardResult: string = yield call(addCardsToUser, user.uuid, payload.cards)

	yield call(addPurchaseToUser, user.uuid, payload.metadata)
	yield call(updateUserTokens, user.uuid, payload.cost * -1)
	if (cardResult !== 'success') return
	;(action.socket as Socket).emit('ROLL_VERIFIED', {
		type: 'ROLL_VERIFIED',
		payload: payload.cards,
	})

	yield updateUser(user, action.socket as Socket)
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
	yield* takeEvery('CARDS_ROLLED', verifyCardRolls)
}
