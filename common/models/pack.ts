import {ExpansionT, RarityT} from '../types/cards'
import {Card} from './card'
import {EffectCard} from './effect-card'
import {HermitCard} from './hermit-card'

type settingsDefs = {
	expansionFilter: string | null
	typeFilter: string | null
	updateFilter: number | null
	maxFilters: number
} | null

type PackDefs = {
	name: string
	tokens: number
	description: string
	filter: (card: Card | HermitCard | EffectCard) => boolean
	rollSettings: settingsDefs
}

export class Pack {
	public name: string
	public tokens: number
	public description: string
	public filter: (card: Card) => boolean
	public rollSettings: settingsDefs

	constructor(defs: PackDefs) {
		this.name = defs.name
		this.tokens = defs.tokens
		this.description = defs.description
		this.filter = defs.filter
		this.rollSettings = defs.rollSettings
	}
}
