import {Uuid} from '../../../common/types/user'
import {PartialCardT, RarityT} from '../../../common/types/cards'
import {pool, sql} from './db'

export async function addDeckToUser(uuid: string, name: string): Promise<string> {
	try {
		const code = await pool.query(
			sql`
				INSERT INTO decks (user_id,deck_name) VALUES ($1,$2) RETURNING deck_code;
			`,
			[uuid, name]
		)
		return code.rows[0].deck_code
	} catch (err) {
		console.log(err)
		return 'failure'
	}
}

export async function modifyDeck(
	deck_code: string,
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
		await pool.query(
			sql`
				UPDATE decks SET deck_name = $2 WHERE deck_code = $1;
			`,
			[deck_code, deck_name]
		)
		await pool.query(
			sql`
				DELETE FROM deck_cards WHERE deck_code = $1;
			`,
			[deck_code]
		)
		await pool.query(
			sql`
				INSERT INTO deck_cards (deck_code,card_name,rarity) SELECT * FROM UNNEST (
					$1::text[],
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
