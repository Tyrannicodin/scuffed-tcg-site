import {Card} from '../models/card'
import {EffectCard} from '../models/effect-card'
import {HermitCard} from '../models/hermit-card'
import {Pack} from '../models/pack'

export const packs = [
	new Pack({
		name: 'All Cards Pack',
		tokens: 1,
		description: 'Contains nine cards.',
		rollSettings: null,
		filter: (card: Card) => {
			return true
		},
	}),
	new Pack({
		name: 'Hermit Pack',
		tokens: 3,
		description: 'Contains nine Hermit cards.',
		rollSettings: null,
		filter: (card: Card) => {
			return card.type === 'hermit'
		},
	}),
	new Pack({
		name: 'Effect Pack',
		tokens: 3,
		description: 'Contains nine effect cards.',
		rollSettings: null,
		filter: (card: Card) => {
			return card.type === 'effect'
		},
	}),
	new Pack({
		name: 'Biome Pack',
		tokens: 5,
		description: 'Contains nine biome cards.',
		rollSettings: null,
		filter: (card: Card | EffectCard) => {
			return card.type === 'effect' && (card as EffectCard).category == 'Biome'
		},
	}),
	new Pack({
		name: 'Item x2 Pack',
		tokens: 6,
		description: 'Contains nine item cards.',
		rollSettings: null,
		filter: (card: Card) => {
			return card.type === 'item'
		},
	}),
]
