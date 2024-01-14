import {UnknownAction} from 'redux'
import {Card} from '../../../common/models/card'

type CardState = {
	cards: Card[]
}

const defaultState: CardState = {
	cards: [],
}

function cardReducer(state = defaultState, action: UnknownAction) {
	if (!action.payload) return state
	switch (action.type) {
		case 'LOAD_CARDS':
			if (action.socket) return state
			return {
				...state,
				cards: action.payload as Card[],
			}
		default:
			return state
	}
}

export default cardReducer
