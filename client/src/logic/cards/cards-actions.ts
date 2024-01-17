import {Card} from 'common/models/card'
import {PartialCardWithCopiesT} from 'common/types/cards'

export const newCard = (cards: Card[]) => ({
	type: 'NEW_CARDS' as const,
	payload: cards,
})

export const updateLibrary = (library: PartialCardWithCopiesT[]) => ({
	type: 'UPDATE_LIBRARY' as const,
	payload: library,
})

export const updateRollResults = (cards: Card[]) => ({
	type: 'ROLL_VERIFIED' as const,
	payload: cards,
})
