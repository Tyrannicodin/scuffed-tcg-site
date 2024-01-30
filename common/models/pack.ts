import {PackOptionsT} from '../types/cards'
import {Card} from './card'
import {EffectCard} from './effect-card'
import {HermitCard} from './hermit-card'

type PackDefs = {
	name: string
	tokens: number
	description: string
	filter: (card: Card | HermitCard | EffectCard, options: Array<PackOptionsT>) => boolean
	maxFilters: number
}

export class Pack {
	public name: string
	public tokens: number
	public description: string
	public filter: (card: Card, options: Array<PackOptionsT>) => boolean
	public maxFilters: number

	constructor(defs: PackDefs) {
		this.name = defs.name
		this.tokens = defs.tokens
		this.description = defs.description
		this.filter = defs.filter
		this.maxFilters = defs.maxFilters
	}

	private getWeight(card: Card): number {
		if (card.type === 'item') return 64
		if (card.rarity === 'Common') return 64
		if (card.rarity === 'Rare') return 32
		if (card.rarity === 'Ultra Rare') return 8
		return 1
	}

	private weightedRandom(cards: Array<Card>): Card {
		var weights = [this.getWeight(cards[0])]
		for (i = 1; i < cards.length; i++) weights[i] = this.getWeight(cards[i]) + weights[i - 1]
		const rand = Math.random() * weights[weights.length - 1]
		var i
		for (i = 0; i < weights.length; i++) if (weights[i] > rand) break
		return cards[i]
	}

	public roll(cardList: Array<Card>, options: Array<PackOptionsT>): Array<Card> {
		const possibleCards = cardList.filter((card) => this.filter(card, options))
		const output: Array<Card> = []
		for (var i = 0; i < 9; i++) {
			output.push(this.weightedRandom(possibleCards))
		}
		return output
	}
}
