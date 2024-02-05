import {Card} from '../models/card'
import {HermitCard} from '../models/hermit-card'

type filtersT = {
	expansions: Array<string>
	types: Array<string>
	rarities: Array<string>
	categories: Array<string>
	tokens: Array<string>
	updates: Array<string>
}

export function getFilters(cards: Array<Card>): filtersT {
	const expansions: Set<string> = new Set([])
	const types: Set<string> = new Set([])
	const updates: Set<string> = new Set([])
	cards.forEach((card) => {
		expansions.add(card.expansion.name)
		updates.add(card.update.toString())
		if (card.type === 'hermit') {
			types.add((card as HermitCard).hermitType.name)
		}
	})

	//disable some options (maybe this code should be changed later)
	types.delete('Everything')
	types.delete('BDubs')
	types.delete('Miner/Farm')
	expansions.delete('Item Card')

	return {
		expansions: [...expansions].sort(),
		types: [...types].sort(),
		rarities: ['Common', 'Rare', 'Ultra Rare', 'Mythic'],
		tokens: ['0', '1', '2', '3', '4', '5'],
		categories: ['Hermit', 'Effect', 'Item'],
		updates: [...updates].sort(),
	}
}
