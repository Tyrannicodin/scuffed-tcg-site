import {HermitAttackTypeT, ExpansionT, HermitTypeT, RarityT} from '../types/cards'
import {Card} from './card'

type HermitDefs = {
	name: string
	rarity: RarityT
	expansion: ExpansionT
	update: number
	picture: string | null
	tokens: number | null
	health: number
	hermitType: HermitTypeT
	primaryAttack: HermitAttackTypeT
	secondaryAttack: HermitAttackTypeT
}

export class HermitCard extends Card {
	public health: number
	public primaryAttack: HermitAttackTypeT
	public secondaryAttack: HermitAttackTypeT
	public hermitType: HermitTypeT

	constructor(defs: HermitDefs) {
		super({
			type: 'hermit',
			name: defs.name,
			rarity: defs.rarity,
			expansion: defs.expansion,
			update: defs.update,
			picture: defs.picture,
			tokens: defs.tokens,
		})

		this.health = defs.health
		this.primaryAttack = defs.primaryAttack
		this.secondaryAttack = defs.secondaryAttack
		this.hermitType = defs.hermitType
	}
}
