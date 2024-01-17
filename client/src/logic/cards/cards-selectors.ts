import {Card} from 'common/models/card'
import {PartialCardWithCopiesT} from 'common/types/cards'
import {RootState} from 'store'

export const getCardsState = (state: RootState) => {
	return state.cards
}

export const getLibraryState = (state: RootState) => {
	return state.cards
}

export const getLastRollResultState = (state: RootState) => {
	return state.cards
}

export const getCards = (state: RootState): Card[] => {
	return getCardsState(state).cards
}

export const getLibrary = (state: RootState): PartialCardWithCopiesT[] => {
	return getLibraryState(state).library
}

export const getLastRollResult = (state: RootState): Card[] => {
	return getLastRollResultState(state).lastRollResult
}
