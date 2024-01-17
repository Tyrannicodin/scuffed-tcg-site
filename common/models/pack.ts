import {ExpansionT, RarityT} from '../types/cards'
import {Card} from './card'
import {EffectCard} from './effect-card'
import {HermitCard} from './hermit-card'

type settingsDefs = {
	expansionFilter: string | null
	typeFilter: string | null
	updateFilter: number | null
	maxFilters: number
} | null

type PackDefs = {
	name: string
	tokens: number
	description: string
	filter: (card: Card | HermitCard | EffectCard) => boolean
	rollSettings: settingsDefs
}

export class Pack {
	public name: string
	public tokens: number
	public description: string
	public filter: (card: Card) => boolean
	public rollSettings: settingsDefs

	constructor(defs: PackDefs) {
		this.name = defs.name
		this.tokens = defs.tokens
		this.description = defs.description
		this.filter = defs.filter
		this.rollSettings = defs.rollSettings
	}

	private getWeight(rarity: RarityT): number {
		if (rarity === 'Common') return 64
		if (rarity === 'Rare') return 32
		if (rarity === 'Ultra rare') return 8
		return 1
	}

	private weightedRandom(cards: Array<Card>): Card {
		var weights = [this.getWeight(cards[0].rarity)]
		for (i = 1; i < cards.length; i++) weights[i] = this.getWeight(cards[1].rarity) + weights[i - 1]
		const rand = Math.random() * weights[weights.length - 1]
		for (var i = 0; i < weights.length; i++) if (weights[i] > rand) return cards[i]
		return this.weightedRandom(cards)
	}

	public roll(cardList: Array<Card>): Array<Card> {
		const possibleCards = cardList.filter((card) => this.filter(card))
		const output: Array<Card> = []
		for (var i = 0; i < 9; i++) {
			output.push(this.weightedRandom(possibleCards))
		}
		console.log(output)
		return output
	}
}
