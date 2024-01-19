import {cardObjectsResult, createCardObjects} from 'db/db'
import {
	selectUserCards,
	addCardsToUser,
	addPurchaseToUser,
	selectUserPurchases,
	selectUserRowFromUuid,
	updateUserTokens,
} from 'db/user'
import {UnknownAction} from 'redux'
import store from 'stores'
import {call, takeEvery} from 'typed-redux-saga'
import {Card} from '../../../common/models/card'
import {Socket} from 'socket.io'
import {PastPurchasesT, UserInfoT, Uuid} from '../../../common/types/user'
import {PartialCardWithCopiesT} from '../../../common/types/cards'
import {getDailyShop, getFormattedDate} from '../../../common/functions/daily-shop'

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
	const purchaseDate = getFormattedDate()

	const payload = action.payload as {uuid: Uuid}
	const user: Record<string, any> = yield call(selectUserRowFromUuid, payload.uuid)
	const library: Array<PartialCardWithCopiesT> = yield call(selectUserCards, payload.uuid)
	const purchases: Array<PastPurchasesT> = yield call(selectUserPurchases, payload.uuid)

	const information: UserInfoT = {
		library: library,
		tokens: user.tokens,
		// Double equals instead of triple equals here is intentional
		pastPurchases: purchases.filter((p) => p.date == purchaseDate),
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

	if (payload.metadata.type === 'card') {
		const {hermitCards} = getDailyShop(yield call(createCardObjects))
		if (payload.cards.some((card) => hermitCards.find((search) => search === card) === undefined)) {
			return
		}
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

export function* cardsSaga() {
	yield call(loadCardsSaga)
	yield* takeEvery('GET_CARDS', sendCards)
	yield* takeEvery('GET_LIBRARY', sendLibrary)
	yield* takeEvery('CARDS_ROLLED', verifyCardRolls)
}
