import {userInfoT} from '../../../common/types/user'
import {pool, sql} from './db'
import {PartialCardT} from '../../../common/types/cards'
import {getSaleResultT, saleCreationResultT} from '../../../common/types/trades'
import {Sale} from '../../../common/models/trade'

export async function createSale(
	user: userInfoT,
	card: PartialCardT,
	cost: number
): Promise<saleCreationResultT> {
	try {
		await pool.query(
			sql`
                INSERT INTO sales (user_id, card_name, rarity, cost) VALUES ($1, $2, $3, $4)
            `,
			[user.uuid, card.name, card.rarity, cost]
		)
		return {result: 'success'}
	} catch (err) {
		console.log(err)
		return {result: 'failure'}
	}
}

export async function getSales(): Promise<getSaleResultT> {
	try {
		const sales = await pool.query(
			sql`
                SELECT sales.user_id, sales.card_name, sales.card_rarity, sales.price FROM sales
            `
		)
		const saleObjects: Sale[] = []
		sales.rows.forEach(async (row) => {
			saleObjects.push(
				new Sale({
					seller: row.user_id,
					card: {name: row.card_name, rarity: row.card_rarity},
					price: row.price,
				})
			)
		})
		return {sales: saleObjects}
	} catch (err) {
		console.log(err)
		return {sales: []}
	}
}
