import {HermitAttackType} from '../types/cards'
import {Card} from './card'

type ItemDefs = {
	name: string
	rarity: string
	expansion: string
	update: number
	picture: string | null
	tokens: number | null
	hermitType: string
}

export class ItemCard extends Card {
	public hermitType: string

	constructor(defs: ItemDefs) {
		super({
			type: 'item',
			name: defs.name,
			rarity: defs.rarity,
			expansion: defs.expansion,
			update: defs.update,
			picture: defs.picture,
			tokens: defs.tokens,
		})

		this.hermitType = defs.hermitType
	}
}
