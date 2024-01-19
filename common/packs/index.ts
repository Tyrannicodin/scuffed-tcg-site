import {Card} from '../models/card'
import {EffectCard} from '../models/effect-card'
import {HermitCard} from '../models/hermit-card'
import {ItemCard} from '../models/item-card'
import {Pack} from '../models/pack'
import {PackOptionsT} from '../types/cards'

function optionsFilter(card: Card, options: Array<PackOptionsT>) {
	return options.every((option) => {
		if (option.type === 'expansion' && option.value !== card.expansion.name) {
			return false
		}
		if (
			card.type !== 'effect' &&
			(card as HermitCard).hermitType &&
			option.type === 'hermitType' &&
			option.value !== (card as HermitCard).hermitType.name
		) {
			return false
		}
		if (option.type === 'hermitType' && card.type === 'effect') {
			return false
		}
		return true
	})
}

export const packs = [
	new Pack({
		name: 'All Cards Pack',
		tokens: 1,
		description: 'Contains nine cards.',
		maxFilters: 0,
		filter: () => {
			return true
		},
	}),
	new Pack({
		name: 'Hermit Pack',
		tokens: 3,
		description: 'Contains nine Hermit cards.',
		maxFilters: 0,
		filter: (card: Card) => {
			return card.type === 'hermit'
		},
	}),
	new Pack({
		name: 'Effect Pack',
		tokens: 3,
		description: 'Contains nine effect cards.',
		maxFilters: 0,
		filter: (card: Card) => {
			return card.type === 'effect'
		},
	}),
	new Pack({
		name: 'Biome Pack',
		tokens: 5,
		description: 'Contains nine biome cards.',
		maxFilters: 0,
		filter: (card: Card | EffectCard) => {
			return card.type === 'effect' && (card as EffectCard).category == 'Biome'
		},
	}),
	new Pack({
		name: 'Item x2 Pack',
		tokens: 6,
		description: 'Contains nine item cards.',
		maxFilters: 0,
		filter: (card: Card) => {
			return card.type === 'item'
		},
	}),
	new Pack({
		name: 'Specific Expansion Pack',
		tokens: 6,
		description: 'Contains nine cards from a specific expansion or type.',
		maxFilters: 1,
		filter: (card: Card, options: Array<PackOptionsT>) => {
			return optionsFilter(card, options)
		},
	}),
	new Pack({
		name: 'Two Specific Expansions Pack',
		tokens: 8,
		description: 'Contains nine cards from a specific expansion or type.',
		maxFilters: 2,
		filter: (card: Card, options: Array<PackOptionsT>) => {
			return optionsFilter(card, options)
		},
	}),
	new Pack({
		name: 'Rare or Better Hermit Pack',
		tokens: 10,
		description: 'Contains nine Hermit cards.',
		maxFilters: 0,
		filter: (card: Card) => {
			return card.type === 'hermit' && card.rarity !== 'Common'
		},
	}),
	new Pack({
		name: 'Rare or Better Effect Pack',
		tokens: 10,
		description: 'Contains nine effect cards.',
		maxFilters: 0,
		filter: (card: Card) => {
			return card.type === 'effect' && card.rarity !== 'Common'
		},
	}),
	new Pack({
		name: 'Rare or Better Specific Expansion Pack',
		tokens: 15,
		description: 'Contains nine rare or better cards from a specific expansion or type.',
		maxFilters: 1,
		filter: (card: Card, options: Array<PackOptionsT>) => {
			return optionsFilter(card, options) && card.rarity !== 'Common'
		},
	}),
]
