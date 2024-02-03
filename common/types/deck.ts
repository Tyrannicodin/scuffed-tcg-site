import {Card} from '../models/card'
import {PartialCardT} from './cards'

export type DeckT = {
	name: string
	cards: Array<Card>
	id: string
}

export type DeckWithPartialCardT = {
	name: string
	cards: Array<PartialCardT>
	id: string
}
