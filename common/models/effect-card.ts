import { rarityT, ExpansionT } from '../types/cards'
import {Card} from './card'

type EffectDefs = {
	name: string
	rarity: rarityT
	expansion: ExpansionT
	update: number
	category: string
	picture: string | null
	tokens: number | null
	description: string
	single_use: boolean
}

export class EffectCard extends Card {
	public description: string
	public category: string
	public single_use: boolean

	constructor(defs: EffectDefs) {
		super({
			type: 'effect',
			name: defs.name,
			rarity: defs.rarity,
			expansion: defs.expansion,
			update: defs.update,
			picture: defs.picture,
			tokens: defs.tokens,
		})

		this.description = defs.description
		this.category = defs.category
		this.single_use = defs.single_use
	}
}
