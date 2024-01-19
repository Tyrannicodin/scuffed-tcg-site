export type PartialCardT = {
	name: string
	rarity: RarityT
}

export type PartialCardWithCopiesT = {
	card: PartialCardT
	copies: number
}

export type HermitAttackTypeT = {
	name: string
	damage: number
	cost: Array<string>
	ability: string | null
}

export type RarityT = 'Common' | 'Rare' | 'Ultra Rare' | 'Mythic'

export type EffectTypeT = 'Attachable' | 'Single Use' | 'Biome'

export type ExpansionT = {
	name: string
	color: string
}

export type HermitTypeT = {
	name: string
	color: string
}

export type PackOptionsT = {
	type: 'expansion' | 'hermitType'
	value: string
}
