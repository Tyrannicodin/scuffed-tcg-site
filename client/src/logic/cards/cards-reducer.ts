import {Card} from 'common/models/card'
import {PartialCardWithCopiesT} from 'common/types/cards'
import {UnknownAction} from 'redux'

type CardsState = {
	cards: Card[]
	library: PartialCardWithCopiesT[]
	lastRollResult: Card[]
}

const defaultState: CardsState = {
	cards: [],
	library: [],
	lastRollResult: [],
}

const cardsReducer = (state = defaultState, action: UnknownAction): CardsState => {
	if (!action.payload) return state
	switch (action.type) {
		case 'NEW_CARDS':
			return {
				...state,
				cards: state.cards.concat(action.payload as Card[]),
			}
		case 'UPDATE_LIBRARY':
			return {
				...state,
				library: action.payload as PartialCardWithCopiesT[],
			}
		case 'ROLL_VERIFIED':
			return {
				...state,
				lastRollResult: action.payload as Card[],
			}
		default:
			return state
	}
}

export default cardsReducer
