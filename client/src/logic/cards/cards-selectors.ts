import { Card } from 'common/models/card'
import {RootState} from 'store'

export const getCardsState = (state: RootState) => {
	return state.cards
}

export const getCards = (state: RootState): Card[] => {
	return getCardsState(state).cards
}
