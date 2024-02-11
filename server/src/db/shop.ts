import {pool, sql} from './db'
import {getFormattedDate} from '../../../common/functions/daily-shop'
import {ShopT} from '../../../common/types/shop'

export async function updateShop() {
	try {
		const date = getFormattedDate()

		// Delete old items
		await pool.query(
			sql`
                DELETE FROM shop_cards WHERE shop_date != $1;
            `,
			[date]
		)
		await pool.query(
			sql`
                DELETE FROM shop_packs WHERE shop_date != $1;
            `,
			[date]
		)
		await pool.query(
			sql`
                DELETE FROM purchases_cards WHERE purchase_time != $1;
            `,
			[date]
		)
		await pool.query(
			sql`
                DELETE FROM purchases_packs WHERE purchase_time != $1;
            `,
			[date]
		)

		// Get if today already has items
		const mostRecentUpdateDate = await pool.query(
			sql`
                SELECT shop_date FROM shop_cards WHERE shop_date = $1 LIMIT 1;
            `,
			[date]
		)

		// If items were already inserted today return
		if (mostRecentUpdateDate.rows.length > 0) return

		// Insert new items into shop
		await pool.query(
			sql`
                DELETE FROM shop_packs WHERE shop_date != $1;
            `,
			[date]
		)
		await pool.query(
			sql`
                INSERT INTO shop_packs (SELECT packs.pack_name,$1 FROM packs CROSS JOIN (SELECT * FROM packs)
                ORDER BY random() LIMIT 7);
            `,
			[date]
		)
		await pool.query(
			sql`
                INSERT INTO shop_packs (item_name, shop_date) VALUES ('All Cards Pack',$1);
            `,
			[date]
		)
		await pool.query(
			sql`
                INSERT INTO shop_packs (item_name, shop_date) VALUES ('All Cards Pack',$1);
            `,
			[date]
		)
		await pool.query(
			sql`
                INSERT INTO shop_cards (SELECT hermit_cards.card_name,hermit_cards.rarity,'hermit',$1
                FROM hermit_cards CROSS JOIN (SELECT * FROM hermit_cards WHERE rarity != 'Mythic')
				WHERE hermit_cards.rarity != 'Mythic' ORDER BY random() LIMIT 14);
            `,
			[date]
		)
		await pool.query(
			sql`
                INSERT INTO shop_cards (SELECT effect_cards.card_name,effect_cards.rarity,'effect',$1
                FROM effect_cards CROSS JOIN (SELECT * FROM effect_cards WHERE rarity != 'Mythic')
				WHERE effect_cards.rarity != 'Mythic' ORDER BY random() LIMIT 14);
            `,
			[date]
		)
	} catch (err) {
		console.log(err)
	}
}

export async function getShop(): Promise<ShopT> {
	try {
		const date = getFormattedDate()
		const hermitCardRows = await pool.query(
			sql`
            SELECT * FROM shop_cards WHERE shop_date = $1 AND item_type = 'hermit';
        `,
			[date]
		)
		const effectCardRows = await pool.query(
			sql`
            SELECT * FROM shop_cards WHERE shop_date = $1 AND item_type = 'effect';
        `,
			[date]
		)
		const pack_rows = await pool.query(
			sql`
            SELECT * FROM shop_packs WHERE shop_date = $1;
        `,
			[date]
		)

		const hermitCards = hermitCardRows.rows
		const effectCards = effectCardRows.rows
		const packs = pack_rows.rows

		return {
			hermitCards: hermitCards.map((card) => {
				return {name: card.item_name, rarity: card.item_rarity}
			}),
			effectCards: effectCards.map((card) => {
				return {name: card.item_name, rarity: card.item_rarity}
			}),
			packs: packs.map((pack) => {
				return {name: pack.item_name}
			}),
		}
	} catch (err) {
		console.log(err)

		return {hermitCards: [], effectCards: [], packs: []}
	}
}
