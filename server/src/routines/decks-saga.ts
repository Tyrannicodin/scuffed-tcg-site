import {UnknownAction} from 'redux'
import {all, call, takeEvery} from 'typed-redux-saga'
import {User} from '../../../common/models/user'
import {addDeckToUser, modifyDeck} from '../db/decks'
import {Socket} from 'socket.io'
import {updateUser} from './root'
import {PartialCardT} from '../../../common/types/cards'

function* createDeckSaga(action: UnknownAction) {
	const user = action.user as User
	const payload = action.payload as {
		name: string
	}

	const deckResult: string = yield call(addDeckToUser, user.uuid, payload.name)

	if (deckResult === 'failure') return

	yield call(updateUser, user, action.socket as Socket)
}

function* modifyDeckSaga(action: UnknownAction) {
	const user = action.user as User
	const payload = action.payload as {
		deck_code: string
		name: string
		cards: Array<PartialCardT>
	}

	const deckResult: string = yield call(modifyDeck, payload.deck_code, payload.name, payload.cards)

	if (deckResult === 'failure') return

	yield call(updateUser, user, action.socket as Socket)
}

export function* deckSaga() {
	yield* takeEvery('CREATE_DECK', createDeckSaga)
	yield* takeEvery('MODIFY_DECK', modifyDeckSaga)
}
