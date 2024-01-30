import {PastPurchasesT, Uuid, userCreateResultT} from '../../../common/types/user'
import {User, userDefs} from '../../../common/models/user'
import {PartialCardT, PartialCardWithCopiesT, RarityT} from '../../../common/types/cards'
import {pool, sql} from './db'
import {getFormattedDate} from '../../../common/functions/daily-shop'

export async function createUser(
	username: string,
	email: string,
	hash: string
): Promise<userCreateResultT> {
	try {
		const unique_check = await pool.query(
			sql`
                SELECT * FROM users WHERE username = $1 OR email = $2;
            `,
			[username, email]
		)

		if (unique_check.rows.length > 0 && unique_check.rows[0].username === username) {
			return {result: 'username_taken'}
		} else if (unique_check.rows.length > 0 && unique_check.rows[0].email === email) {
			return {result: 'email_taken'}
		}

		await pool.query(
			sql`
                INSERT INTO users (salted_hash, username, email, tokens, is_admin) VALUES (
                    crypt($1, gen_salt('bf', 15)),
                    $2,
                    $3,
                    0,
                    'false'
                );
            `,
			[hash, username, email]
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
				SELECT * FROM purchases WHERE user_id = $1;
			`,
			[uuid]
		)

		if (!result.rowCount) {
			return null
		}

		const library: Array<PartialCardWithCopiesT> = []
		const purchases: Array<PastPurchasesT> = []

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
				type: row.is_pack_purchase ? 'pack' : 'card',
				date: row.purchase_time,
			}

			purchases.push(purchase)
		})

		const userDef: userDefs = {
			uuid: result.rows[0].user_id,
			username: result.rows[0].username,
			tokens: result.rows[0].tokens,
			picture: result.rows[0].picture,
			is_admin: result.rows[0].is_admin,
			library: library,
			purchases: purchases,
		}

		return new User(userDef)
	} catch (err) {
		console.log(err)
	}
	return null
}

export async function updateUserInfo(user: User) {
	try {
		const result = await pool.query(
			sql`
				SELECT users.user_id,users.username,users.tokens,users.picture,users.is_admin,
				libraries.card_name,libraries.rarity,libraries.copies
				FROM users
				LEFT JOIN libraries ON (libraries.user_id = users.user_id)
				WHERE users.user_id = $1;
            `,
			[user.uuid]
		)

		const purchasesQuery = await pool.query(
			sql`
				SELECT * FROM purchases WHERE user_id = $1;
			`,
			[user.uuid]
		)

		if (!result.rowCount) {
			return user
		}

		const library: Array<PartialCardWithCopiesT> = []
		const purchases: Array<PastPurchasesT> = []

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
				type: row.is_pack_purchase ? 'pack' : 'card',
				date: row.purchase_time,
			}

			purchases.push(purchase)
		})

		const userDef: userDefs = {
			uuid: result.rows[0].uuid,
			username: result.rows[0].username,
			tokens: result.rows[0].tokens,
			picture: result.rows[0].picture,
			is_admin: result.rows[0].is_admin,
			library: library,
			purchases: purchases,
		}

		const updatedUser = new User(userDef)
		updatedUser.authed = user.authed
		updatedUser.secret = user.secret
		return updatedUser
	} catch (err) {
		console.log(err)
	}
	return user
}

export async function deleteUser(username: string) {
	try {
		await pool.query(
			sql`
                DELETE FROM users WHERE username = $1;
            `,
			[username]
		)
		return {result: 'success'}
	} catch (err) {
		return {result: 'failure'}
	}
}

export async function addPurchaseToUser(uuid: string, purchase: PastPurchasesT): Promise<string> {
	const purchaseDate = getFormattedDate()
	try {
		await pool.query(
			sql`
				INSERT INTO purchases (user_id,purchase_name,purchase_rarity,purchase_time,is_pack_purchase) VALUES (
                    $1,$2,$3,$4,$5
                );
			`,
			[
				uuid,
				purchase.purchase.name,
				purchase.type === 'card' ? (purchase.purchase as PartialCardT).rarity : null,
				purchaseDate,
				purchase.type === 'pack' ? true : false,
			]
		)
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
				UPDATE libraries SET copies = copies - $4 FROM ( SELECT * FROM UNNEST (
					$1::uuid[],
					$2::text[],
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
