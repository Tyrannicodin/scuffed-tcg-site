import {Card} from 'common/models/card'
import {UnknownAction} from 'redux'
import {Sale, Trade} from 'common/models/trade'
import {ShopT} from 'common/types/shop'

type CardsState = {
	cards: Card[]
	lastRollResult: Card[]
	sales: Sale[]
	trades: Trade[]
	shop: ShopT
}

const defaultState: CardsState = {
	cards: [],
	lastRollResult: [],
	sales: [],
	trades: [],
	shop: {packs: [], hermitCards: [], effectCards: []},
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
		case 'UPDATE_SHOP':
			return {
				...state,
				shop: action.payload as ShopT,
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
