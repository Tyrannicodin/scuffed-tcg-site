import {HermitAttackType, ExpansionT, HermitTypeT, rarityT, HermitTypeT} from '../types/cards'
import {Card} from './card'

type HermitDefs = {
	name: string
	rarity: rarityT
	expansion: ExpansionT
	update: number
	picture: string | null
	tokens: number | null
	health: number
	hermitType: HermitTypeT
	primaryAttack: HermitAttackType
	secondaryAttack: HermitAttackType
}

export class HermitCard extends Card {
	public health: number
	public primaryAttack: HermitAttackType
	public secondaryAttack: HermitAttackType
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
