import {PastPurchasesT, Uuid, userCreateResultT} from '../../../common/types/user'
import {User, userDefs} from '../../../common/models/user'
import {PartialCardT, PartialCardWithCopiesT, RarityT} from '../../../common/types/cards'
import {DBKEY, pool, sql} from './db'
import {getFormattedDate} from '../../../common/functions/daily-shop'
import {privateDecrypt, publicEncrypt} from 'crypto'
import {authenticator} from 'otplib'
import {DeckWithPartialCardT} from '../../../common/types/deck'
import {deleteDeck} from './decks'

export async function createUser(username: string, hash: string): Promise<userCreateResultT> {
	try {
		const unique_check = await pool.query(
			sql`
                SELECT * FROM users WHERE username = $1;
            `,
			[username]
		)

		if (unique_check.rows.length > 0 && unique_check.rows[0].username === username) {
			return {result: 'username_taken'}
		}

		await pool.query(
			sql`
                INSERT INTO users (salted_hash, username, token_secret, tokens, is_admin) VALUES (
                    crypt($1, gen_salt('bf', 15)),
                    $2,
					$3,
                    0,
                    'false'
                );
            `,
			[hash, username, publicEncrypt(DBKEY, Buffer.from(authenticator.generateSecret(), 'utf-8'))]
		)

		return {result: 'success'}
	} catch (err) {
		if (!(err instanceof Error)) return {result: 'failure'}
		if (err.message.includes('ECONNREFUSED')) return {result: 'db_connection'}
		return {result: 'failure'}
	}
}

export async function selectUserUUID(username: string, hash: string): Promise<Uuid | null> {
	try {
		const uuid = await pool.query(
			sql`
                SELECT user_id FROM users WHERE username = $1 and salted_hash = crypt($2, salted_hash);
            `,
			[username, hash]
		)

		if (uuid.rowCount && uuid.rowCount > 0) {
			return uuid.rows[0].user_id
		}
	} catch (err) {
		console.log(err)
	}
	return null
}

export async function selectUserUUIDUnsecure(username: string): Promise<Uuid | null> {
	try {
		const uuid = await pool.query(
			sql`
                SELECT user_id FROM users WHERE username = $1;
            `,
			[username]
		)

		if (uuid.rowCount && uuid.rowCount > 0) {
			return uuid.rows[0].user_id
		}
	} catch (err) {
		console.log(err)
	}
	return null
}

export async function selectUserInfoFromUuid(uuid: Uuid): Promise<User | null> {
	try {
		const result = await pool.query(
			sql`
				SELECT users.user_id,users.username,users.tokens,users.picture,users.is_admin,
				libraries.card_name,libraries.rarity,libraries.copies
				FROM users
				LEFT JOIN libraries ON (libraries.user_id = users.user_id)
				WHERE users.user_id = $1;
            `,
			[uuid]
		)

		const purchasesQuery = await pool.query(
			sql`
				SELECT purchases_cards.user_id, purchases_cards.purchase_name, purchases_cards.purchase_rarity,
				purchases_cards.purchase_time FROM purchases_cards WHERE purchases_cards.user_id = $1
				UNION ALL SELECT purchases_packs.user_id, purchases_packs.purchase_name, null,
				purchases_packs.purchase_time FROM purchases_packs WHERE purchases_packs.user_id = $1;
			`,
			[uuid]
		)

		const deckQuery = await pool.query(
			sql`
				SELECT * from decks LEFT JOIN deck_cards on (decks.deck_code = deck_cards.deck_code)
				WHERE decks.user_id = $1;
			`,
			[uuid]
		)

		if (!result.rowCount) {
			return null
		}

		const library: Array<PartialCardWithCopiesT> = []
		const purchases: Array<PastPurchasesT> = []
		const decks: Array<DeckWithPartialCardT> = []

		result.rows.forEach((row: any) => {
			const partialCard: PartialCardWithCopiesT = {
				card: {
					name: row.card_name,
					rarity: row.rarity,
				},
				copies: row.copies,
			}

			library.push(partialCard)
		})

		purchasesQuery.rows.forEach((row: any) => {
			const purchase: PastPurchasesT = {
				purchase: {
					name: row.purchase_name,
					rarity: row.purchase_rarity,
				},
				type: row.purchase_rarity ? 'card' : 'pack',
				date: row.purchase_time,
			}

			purchases.push(purchase)
		})

		deckQuery.rows.forEach((row: any) => {
			const previousDeck = decks.find((deck) => deck.id === row.deck_code)
			if (previousDeck !== undefined) {
				previousDeck.cards.push({
					name: row.card_name,
					rarity: row.rarity,
				})
				return
			}
			if (!row.card_name) {
				const newDeck: DeckWithPartialCardT = {
					name: row.deck_name,
					id: row.deck_code,
					cards: [],
				}
				decks.push(newDeck)
				return
			}
			const newDeck: DeckWithPartialCardT = {
				name: row.deck_name,
				id: row.deck_code,
				cards: [
					{
						name: row.card_name,
						rarity: row.rarity,
					},
				],
			}

			decks.push(newDeck)
		})

		const userDef: userDefs = {
			uuid: result.rows[0].user_id,
			username: result.rows[0].username,
			tokens: result.rows[0].tokens,
			picture: result.rows[0].picture,
			is_admin: result.rows[0].is_admin,
			library: library,
			decks: decks,
			purchases: purchases,
		}

		return new User(userDef)
	} catch (err) {
		console.log(err)
	}
	return null
}

export async function selectUserTokenSecret(user: User): Promise<string> {
	try {
		const result = await pool.query(
			sql`
				SELECT users.token_secret FROM users WHERE users.user_id = $1;
			`,
			[user.uuid]
		)

		if (!result || result.rows.length != 1) return ''
		if (!DBKEY) return ''
		return privateDecrypt(DBKEY, result.rows[0].token_secret).toString('utf-8')
	} catch (err) {
		console.log(err)
		return ''
	}
}

export async function updateUserInfo(user: User) {
	const updatedUser = await selectUserInfoFromUuid(user.uuid)
	if (!updatedUser) return user
	updatedUser.authed = user.authed
	updatedUser.secret = user.secret
	return updatedUser
}

export async function deleteUser(uuid: string) {
	try {
		const userDecks = await pool.query(
			sql`
				SELECT decks.deck_code FROM decks WHERE decks.user_id=$1;
			`,
			[uuid]
		)
		userDecks.rows.forEach(async (row) => {
			await deleteDeck(row.deck_code)
		})
		await pool.query(
			sql`
				DELETE FROM libraries WHERE libraries.user_id=$1;
			`,
			[uuid]
		)
		await pool.query(
			sql`
				DELETE FROM purchases_cards WHERE purchases_cards.user_id=$1;
			`,
			[uuid]
		)
		await pool.query(
			sql`
				DELETE FROM purchases_packs WHERE purchases_packs.user_id=$1;
			`,
			[uuid]
		)
		await pool.query(
			sql`
				DELETE FROM sales WHERE sales.user_id=$1;
			`
		)
		await pool.query(
			sql`
                DELETE FROM users WHERE users.user_id=$1;
            `,
			[uuid]
		)
		return {result: 'success'}
	} catch (err) {
		console.log(err)
		return {result: 'failure'}
	}
}

export async function updateUserPassword(user: User, newPassword: string) {
	try {
		await pool.query(
			sql`
				UPDATE users SET salted_hash=crypt($1, gen_salt('bf', 15)) WHERE user_id=$2
			`,
			[newPassword, user.uuid]
		)
		return 'success'
	} catch (err) {
		console.log(err)
		return 'failure'
	}
}

export async function addPurchaseToUser(uuid: string, purchase: PastPurchasesT): Promise<string> {
	const purchaseDate = getFormattedDate()
	try {
		if (purchase.type === 'card') {
			await pool.query(
				sql`
					INSERT INTO purchases_cards (user_id,purchase_name,purchase_rarity,purchase_time) VALUES (
						$1,$2,$3,$4
					);
				`,
				[uuid, purchase.purchase.name, (purchase.purchase as PartialCardT).rarity, purchaseDate]
			)
		} else if (purchase.type === 'pack') {
			await pool.query(
				sql`
					INSERT INTO purchases_packs (user_id,purchase_name,purchase_time) VALUES (
						$1,$2,$3
					);
				`,
				[uuid, purchase.purchase.name, purchaseDate]
			)
		}
		return 'success'
	} catch (err) {
		console.log(err)
		return 'failure'
	}
}

export async function updateUserTokens(uuid: string, tokens: number) {
	await pool.query(
		sql`
            UPDATE users SET tokens = tokens + $2 WHERE user_id = $1;
        `,
		[uuid, tokens]
	)
}

export async function addCardsToUser(uuid: string, cards: Array<PartialCardT>): Promise<string> {
	const flippedCards: {
		names: Array<string>
		rarities: Array<RarityT>
		copies: Array<number>
	} = {
		names: [],
		rarities: [],
		copies: [],
	}

	cards.forEach((card, index) => {
		if (cards.findIndex((v) => v.name === card.name && v.rarity === card.rarity) < index) return
		flippedCards.names.push(card.name)
		flippedCards.rarities.push(card.rarity)
		flippedCards.copies.push(
			cards.filter((v) => v.name === card.name && v.rarity === card.rarity).length
		)
	})

	try {
		await pool.query(
			sql`
				INSERT INTO libraries (user_id,card_name,rarity,copies) SELECT * FROM UNNEST (
					$1::uuid[],
					$2::text[],
					$3::text[],
					$4::int[]
				) ON CONFLICT (user_id,card_name,rarity) DO UPDATE SET copies = libraries.copies + (SELECT * FROM UNNEST (
					$4::int[]
				) LIMIT 1);
			`,
			[
				Array(flippedCards.names.length).fill(uuid),
				flippedCards.names,
				flippedCards.rarities,
				flippedCards.copies,
			]
		)
		return 'success'
	} catch (err) {
		console.log(err)
		return 'failure'
	}
}

export async function removeCardsFromUser(
	uuid: string,
	cards: Array<PartialCardT>,
	copies: number = 1
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
				UPDATE libraries SET copies = copies - $4 WHERE user_id = (SELECT * FROM UNNEST (
					$1::uuid[]
				)) AND card_name = (SELECT * FROM UNNEST (
					$2::text[]
				)) AND rarity = (SELECT * FROM UNNEST (
					$3::text[]
				));
			`,
			[Array(cards.length).fill(uuid), flippedCards.names, flippedCards.rarities, copies]
		)
		await pool.query(sql`DELETE FROM libraries WHERE copies = 0;`)
		return 'success'
	} catch (err) {
		console.log(err)
		return 'failure'
	}
}
