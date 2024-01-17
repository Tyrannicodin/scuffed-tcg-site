import {Card} from 'common/models/card'
import {PartialCardWithCopiesT} from 'common/types/cards'
import {UnknownAction} from 'redux'

type CardsState = {
	cards: Card[]
	library: PartialCardWithCopiesT[]
}

const defaultState: CardsState = {
	cards: [],
	library: [],
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
				library: action.payload as PartialCardWithCopiesT[],
			}
		default:
			return state
	}
}

export default cardsReducer
