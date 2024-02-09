import {Card} from 'common/models/card'
import {Sale, Trade} from 'common/models/trade'
import {PartialCardWithCopiesT} from 'common/types/cards'
import {ShopT} from 'common/types/shop'

export const newCard = (cards: Card[]) => ({
	type: 'NEW_CARDS' as const,
	payload: cards,
})

export const updateShop = (shop: ShopT) => ({
	type: 'UPDATE_SHOP' as const,
	payload: shop,
})

export const updateLibrary = (library: PartialCardWithCopiesT[]) => ({
	type: 'UPDATE_LIBRARY' as const,
	payload: library,
})

export const updateRollResults = (cards: Card[]) => ({
	type: 'ROLL_VERIFIED' as const,
	payload: cards,
})

export const loadTrades = (trades: {trades: Trade[]; sales: Sale[]}) => ({
	type: 'LOAD_TRADES' as const,
	payload: trades,
})
