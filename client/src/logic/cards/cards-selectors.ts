import {Card} from 'common/models/card'
import {Sale, Trade} from 'common/models/trade'
import {PartialCardWithCopiesT} from 'common/types/cards'
import {PastPurchasesT} from 'common/types/user'
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
	return getLibraryState(state).library.library
}

export const getTokens = (state: RootState): number => {
	return getLibraryState(state).library.tokens
}

export const getPastPurchases = (state: RootState): Array<PastPurchasesT> => {
	return getLibraryState(state).library.pastPurchases
}

export const getLastRollResult = (state: RootState): Card[] => {
	return getLastRollResultState(state).lastRollResult
}

export const getSales = (state: RootState): Sale[] => {
	return getCardsState(state).sales
}

export const getTrades = (state: RootState): Trade[] => {
	return getCardsState(state).trades
}
