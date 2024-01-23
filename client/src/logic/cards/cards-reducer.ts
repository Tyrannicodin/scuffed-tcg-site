import {Card} from 'common/models/card'
import {userInventoryT} from 'common/types/user'
import {UnknownAction} from 'redux'

type CardsState = {
	cards: Card[]
	library: userInventoryT
	lastRollResult: Card[]
}

const defaultState: CardsState = {
	cards: [],
	library: {library: [], tokens: 0, pastPurchases: []},
	lastRollResult: [],
}

const cardsReducer = (state = defaultState, action: UnknownAction): CardsState => {
	if (action.payload === undefined) return state
	switch (action.type) {
		case 'NEW_CARDS':
			return {
				...state,
				cards: state.cards.concat(action.payload as Card[]),
			}
		case 'UPDATE_LIBRARY':
			return {
				...state,
				library: action.payload as userInventoryT,
			}
		case 'ROLL_VERIFIED':
			return {
				...state,
				lastRollResult: action.payload as Card[],
			}
		case 'UPDATE_TRADES':
			return {
				...state,
				
			}
		default:
			return state
	}
}

export default cardsReducer
