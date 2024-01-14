import {RarityT, ExpansionT, EffectTypeT} from '../types/cards'
import {Card} from './card'

type EffectDefs = {
	name: string
	rarity: RarityT
	expansion: ExpansionT
	update: number
	category: EffectTypeT
	picture: string | null
	tokens: number | null
	description: string
}

export class EffectCard extends Card {
	public description: string
	public category: EffectTypeT

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
	}
}
