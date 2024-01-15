import {Uuid} from '../../../common/types/user'
import {PartialCardT, RarityT} from '../../../common/types/cards'
import {pool, sql} from './db'

export async function createDeck(
	user_id: Uuid,
	deck_name: string,
	cards: Array<PartialCardT>
): Promise<string> {
	const flippedCards: {
		names: Array<string>
		rarities: Array<RarityT>
	} = {
		names: [],
		rarities: [],
	}

	cards.forEach((card) => {
		flippedCards.names.push(card.name)
		flippedCards.rarities.push(card.rarity)
	})

	try {
		const result = await pool.query(
			sql`
				INSERT INTO decks (user_id,deck_name) VALUES ($1, $2) RETURNING deck_code
			`,
			[user_id, deck_name]
		)

		if (!result.rows) return 'failure'

		const deck_code = result.rows[0].deck_code

		await pool.query(
			sql`
				INSERT INTO deck_cards (deck_code,card_name,rarity) SELECT * FROM UNNEST (
					$1::uuid[],
					$2::text[],
					$3::text[]
				)
			`,
			[Array(cards.length).fill(deck_code), flippedCards.names, flippedCards.rarities]
		)

		return 'success'
	} catch (err) {
		console.log(err)
		return 'failure'
	}
}
