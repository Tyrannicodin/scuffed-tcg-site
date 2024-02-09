import {ExpansionT, RarityT} from '../types/cards'

type CardDefs = {
	name: string
	rarity: RarityT
	expansion: ExpansionT
	update: number
	type: string
	picture: string | null
	tokens: number | null
}

export class Card {
	public name: string
	public rarity: RarityT
	public expansion: ExpansionT
	public update: number
	public type: string
	public picture: string | null
	public tokens: number | null

	constructor(defs: CardDefs) {
		this.name = defs.name
		this.rarity = defs.rarity
		this.expansion = defs.expansion
		this.update = defs.update
		this.type = defs.type
		this.picture = defs.picture
		this.tokens = defs.tokens
	}
}
