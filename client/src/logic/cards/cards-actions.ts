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
