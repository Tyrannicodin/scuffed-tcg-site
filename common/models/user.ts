import {PastPurchasesT, Uuid} from '../types/user'
import {PartialCardWithCopiesT} from '../types/cards'
import {DeckT, DeckWithPartialCardT} from '../types/deck'

export type userDefs = {
	uuid: Uuid
	username: string
	tokens: number
	picture: string | null
	is_admin: boolean
	library: Array<PartialCardWithCopiesT>
	decks: Array<DeckWithPartialCardT>
	purchases: Array<PastPurchasesT>
}

export class User {
	public uuid: Uuid
	public username: string
	public tokens: number
	public picture: string | null
	public is_admin: boolean
	public library: Array<PartialCardWithCopiesT>
	public decks: Array<DeckWithPartialCardT>
	public purchases: Array<PastPurchasesT>

	public secret: string = ''
	public authed: boolean = true

	constructor(defs: userDefs) {
		this.uuid = defs.uuid
		this.username = defs.username
		this.tokens = defs.tokens
		this.picture = defs.picture
		this.is_admin = defs.is_admin
		this.library = defs.library
		this.decks = defs.decks
		this.purchases = defs.purchases
	}
}
