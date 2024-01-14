export type HermitAttackType = {
	name: string
	damage: number
	cost: Array<string>
	ability: string | null
}
export type rarityT = 'Common' | 'Rare' | 'Ultra rare' | 'Mythic'

export type EffectTypeT = 'Attachable' | 'Single Use' | 'Biome'

export type ExpansionT = {
	name: string
	color: string
}

export type HermitTypeT = {
	name: string
	color: string
}

export type PartialCardT = {
	name: string
	rarity: rarityT
}
