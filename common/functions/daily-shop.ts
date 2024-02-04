import {Card} from '../models/card'
import {Pack} from '../models/pack'
import {PACKS} from '../packs'
import {PartialCardT, PartialPackT} from '../types/cards'
import {ShopT} from '../types/shop'

export function getFormattedDate() {
	const date = new Date()
	return date.getUTCFullYear() * 10000 + date.getUTCMonth() * 100 + date.getUTCDate()
}

export function getFullCardsFromPartial(partialCard: Array<PartialCardT>, fullCards: Array<Card>) {
	const cards: Array<Card> = []
	partialCard.forEach((card) => {
		const search = fullCards.find(
			(subcard) => card.name === subcard.name && card.rarity === subcard.rarity
		)
		if (search) cards.push(search)
	})
	return cards
}

export function getFullPackFromPartial(partialPack: Array<PartialPackT>) {
	const fullPacks = PACKS
	return fullPacks.filter((pack) => {
		return partialPack.some((subpack) => {
			return pack.name === subpack.name
		})
	})
}

export function cardSort(a: Card, b: Card) {
	if (a.tokens === null || b.tokens === null) return a.name.localeCompare(b.name)
	return a.tokens - b.tokens || a.name.localeCompare(b.name)
}
