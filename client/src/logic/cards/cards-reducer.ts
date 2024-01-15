import {Card} from 'common/models/card'
import {PartialCardT} from 'common/types/cards'
import {UnknownAction} from 'redux'

type CardsState = {
	cards: Card[]
	library: PartialCardT[]
}

const defaultState: CardsState = {
	cards: [],
	library: [],
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
				library: action.payload as PartialCardT[],
			}
		default:
			return state
	}
}

export default cardsReducer