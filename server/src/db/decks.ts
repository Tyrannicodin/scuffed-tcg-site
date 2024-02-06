import {Uuid} from '../../../common/types/user'
import {PartialCardT, RarityT} from '../../../common/types/cards'
import {pool, sql} from './db'

export async function addDeckToUser(
	uuid: string,
	deckName: string,
	cards: Array<PartialCardT> = []
): Promise<string> {
	try {
		const code = await pool.query(
			sql`
				INSERT INTO decks (user_id,deck_name) VALUES ($1,$2) RETURNING deck_code;
			`,
			[uuid, deckName]
		)

		if (cards.length > 0) {
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

			await pool.query(
				sql`
					INSERT INTO deck_cards (deck_code,card_name,rarity) SELECT * FROM UNNEST (
						$1::text[],
						$2::text[],
						$3::text[]
					)
				`,
				[
					Array(cards.length).fill(code.rows[0].deck_code),
					flippedCards.names,
					flippedCards.rarities,
				]
			)
		}

		return code.rows[0].deck_code
	} catch (err) {
		console.log(err)
		return 'failure'
	}
}

export async function importDeck(uuid: string, deckCode: string): Promise<string> {
	try {
		const result = await pool.query(
			sql`
				SELECT * FROM decks
				LEFT JOIN deck_cards on (decks.deck_code = deck_cards.deck_code)
				WHERE decks.deck_code = $1;
			`,
			[deckCode]
		)
		if (result.rows.length === 0) return 'failure'

		const cards: Array<PartialCardT> = []

		result.rows.forEach((row: any) => {
			const partialCard: PartialCardT = {
				name: row.card_name,
				rarity: row.rarity,
			}

			cards.push(partialCard)
		})

		return addDeckToUser(uuid, result.rows[0].deck_name, cards)
	} catch (err) {
		console.log(err)
		return 'failure'
	}
}

export async function modifyDeck(
	deckCode: string,
	deckName: string,
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
			[deckCode, deckName]
		)
		await pool.query(
			sql`
				DELETE FROM deck_cards WHERE deck_code = $1;
			`,
			[deckCode]
		)
		await pool.query(
			sql`
				INSERT INTO deck_cards (deck_code,card_name,rarity) SELECT * FROM UNNEST (
					$1::text[],
					$2::text[],
					$3::text[]
				)
			`,
			[Array(cards.length).fill(deckCode), flippedCards.names, flippedCards.rarities]
		)

		return 'success'
	} catch (err) {
		console.log(err)
		return 'failure'
	}
}

export async function disassosicateDeck(deckCode: string) {
	try {
		await pool.query(
			sql`
				UPDATE decks SET user_id = null WHERE deck_code = $1;
			`,
			[deckCode]
		)

		return 'success'
	} catch (err) {
		console.log(err)
		return 'failure'
	}
}
