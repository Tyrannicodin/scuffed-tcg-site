import {Card} from 'common/models/card'
import {userInventoryT} from 'common/types/user'
import {UnknownAction} from 'redux'
import {Sale, Trade} from 'common/models/trade'

type CardsState = {
	cards: Card[]
	lastRollResult: Card[]
	sales: Sale[]
	trades: Trade[]
}

const defaultState: CardsState = {
	cards: [],
	lastRollResult: [],
	sales: [],
	trades: [],
}

const cardsReducer = (state = defaultState, action: UnknownAction): CardsState => {
	if (action.payload === undefined) return state
	switch (action.type) {
		case 'NEW_CARDS':
			return {
				...state,
				cards: state.cards.concat(action.payload as Card[]),
			}
		case 'ROLL_VERIFIED':
			return {
				...state,
				lastRollResult: action.payload as Card[],
			}
		case 'LOAD_TRADES':
			return {
				...state,
				...action.payload,
			}
		default:
			return state
	}
}

export default cardsReducer
