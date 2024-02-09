import {RarityT, ExpansionT, HermitTypeT} from '../types/cards'
import {Card} from './card'

type ItemDefs = {
	name: string
	rarity: RarityT
	expansion: ExpansionT
	update: number
	picture: string | null
	tokens: number | null
	hermitType: HermitTypeT
}

export class ItemCard extends Card {
	public hermitType: HermitTypeT

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
