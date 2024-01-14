import {Card} from 'common/models/card'

export const newCard = (cards: Card[]) => ({
	type: 'NEW_CARDS' as const,
	payload: cards,
})
