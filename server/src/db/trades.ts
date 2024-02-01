import {userInfoT} from '../../../common/types/user'
import {pool, sql} from './db'
import {PartialCardWithCopiesT} from '../../../common/types/cards'
import {getSaleResultT, genericSaleResultT} from '../../../common/types/trades'
import {Sale} from '../../../common/models/trade'

export async function createSale(
	user: userInfoT,
	card: PartialCardWithCopiesT,
	cost: number
): Promise<genericSaleResultT> {
	try {
		await pool.query(
			sql`
                INSERT INTO sales (user_id, card_name, card_rarity, copies, price, list_time)
				VALUES ($1, $2, $3, $4, $5, $6)
            `,
			[
				user.uuid,
				card.card.name,
				card.card.rarity,
				card.copies,
				cost,
				Math.round(Date.now() / 1000),
			]
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
                SELECT sales.sale_id, sales.card_name, sales.card_rarity, sales.price, sales.copies, sales.list_time, users.username FROM sales
				LEFT JOIN users ON (sales.user_id) = (users.user_id);
            `
		)
		const saleObjects: Sale[] = sales.rows.map(
			(row) =>
				new Sale({
					id: row.sale_id,
					seller: row.username,
					card: {name: row.card_name, rarity: row.card_rarity},
					price: row.price,
					copies: row.copies,
					timestamp: row.list_time,
				})
		)
		return {sales: saleObjects}
	} catch (err) {
		console.log(err)
		return {sales: []}
	}
}

export async function getSale(uuid: string): Promise<genericSaleResultT> {
	try {
		const sales = await pool.query(
			sql`SELECT sales.sale_id, sales.card_name, sales.card_rarity, sales.price, sales.copies, sales.list_time, users.username
			FROM sales LEFT JOIN users ON (sales.user_id) = (users.user_id)
			WHERE sales.sale_id = $1;`,
			[uuid]
		)
		const sale = sales.rows[0]
		return {result: 'success',
			sale: new Sale({
			id: sale.sale_id,
			seller: sale.username,
			card: {name: sale.card_name, rarity: sale.card_rarity},
			price: sale.price,
			copies: sale.copies,
			timestamp: sale.list_time,
		})}
	} catch (err) {
		console.log(err)
		return {result: 'failure'}
	}
}

export async function deleteSale(uuid:string): Promise<genericSaleResultT> {
	try {
		await pool.query(
			sql`DELETE FROM sales WHERE sale_id = $1`,
			[uuid]
		)
		return {result: 'success'}
	} catch (err) {
		console.log(err)
		return {result: 'failure'}
	}
}
