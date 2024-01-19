import {Card} from '../models/card'
import {Pack} from '../models/pack'
import {packs} from '../packs'

export function getFormattedDate() {
	const date = new Date()
	return date.getUTCFullYear() * 10000 + date.getUTCMonth() * 100 + date.getUTCDay()
}

type dailyshopDefs = {
	rolledPacks: Array<Pack>
	hermitCards: Array<Card>
	effectCards: Array<Card>
}

const cyrb53 = (str: string, seed: number) => {
	let h1 = 0xdeadbeef ^ seed,
		h2 = 0x41c6ce57 ^ seed
	for (let i = 0, ch; i < str.length; i++) {
		ch = str.charCodeAt(i)
		h1 = Math.imul(h1 ^ ch, 2654435761)
		h2 = Math.imul(h2 ^ ch, 1597334677)
	}
	h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507)
	h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909)
	h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507)
	h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909)

	return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}

const rand = (str: string, seed: number, max: number) => {
	const hash = cyrb53(str, seed)
	return Math.floor((hash / 9007199254740991) * max)
}

export function getDailyShop(cards: Array<Card>): dailyshopDefs {
	const hermitCards = cards.filter((card) => card.type === 'hermit')
	const effectCards = cards.filter((card) => card.type === 'effect')

	const chosenPacks: Array<Pack> = []
	const chosenHermitCards: Array<Card> = []
	const chosenEffectCards: Array<Card> = []

	const timeSeed = getFormattedDate()

	for (var i = 0; i < 14; i++) {
		if (i < 7) {
			chosenPacks.push(packs[rand('packs' + i, timeSeed, packs.length)])
		}

		chosenHermitCards.push(hermitCards[rand('hermit' + i, timeSeed, hermitCards.length)])
		chosenEffectCards.push(effectCards[rand('effect' + i, timeSeed, effectCards.length)])
	}

	return {rolledPacks: chosenPacks, hermitCards: chosenHermitCards, effectCards: chosenEffectCards}
}
