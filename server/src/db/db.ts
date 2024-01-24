import pg from 'pg'
import {HermitCard} from '../../../common/models/hermit-card'
import {EffectCard} from '../../../common/models/effect-card'
import {ItemCard} from '../../../common/models/item-card'
import {grabCardsFromGoogleSheets} from './sheets'
import {userInfoT} from '../../../common/types/user'

const {Pool} = pg

// This is just for syntax highlighting, it doesn't do anything.
export const sql = (strings: TemplateStringsArray, ...expr: any[]) =>
	strings.map((str, index) => str + (expr.length > index ? String(expr[index]) : '')).join('')

export const pool = new Pool({
	user: 'postgres',
	password: 'p5J40EmGU24',
	host: 'localhost',
	port: 5432,
	database: 'scuffed_tcg',
})

export async function createTables() {
	try {
		pool.query(sql`
			SET CLIENT_ENCODING TO 'UTF8';
            
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
            CREATE EXTENSION IF NOT EXISTS "pgcrypto";
            CREATE TABLE IF NOT EXISTS users(
                user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                salted_hash varchar(255) NOT NULL,
                username varchar(255) NOT NULL UNIQUE,
                email varchar(255) NOT NULL UNIQUE,
                tokens integer NOT NULL,
                picture varchar(255),
                is_admin boolean NOT NULL
            );
			CREATE TABLE IF NOT EXISTS expansions(
				expansion_name varchar(31) PRIMARY KEY,
				expansion_color varchar(6) NOT NULL
			);
			CREATE TABLE IF NOT EXISTS types(
				type_name varchar(31) PRIMARY KEY,
				type_color varchar(6) NOT NULL
			);
            CREATE TABLE IF NOT EXISTS cards(
                card_name varchar(31) NOT NULL,
                rarity varchar(31) NOT NULL,
                expansion varchar(255) REFERENCES expansions(expansion_name),
                card_update integer NOT NULL,
                main_type varchar(255) NOT NULL,
                sub_type varchar(255) REFERENCES types(type_name),
                picture varchar(1027),
                tokens integer,
                PRIMARY KEY (card_name, rarity)
            );
            CREATE TABLE IF NOT EXISTS hermit_cards(
                card_name varchar(255),
                rarity varchar(255),
                health integer NOT NULL,
                primary_move varchar(255) NOT NULL,
                primary_dmg integer NOT NULL,
                primary_ability varchar(1027),
                secondary_move varchar(255) NOT NULL,
                secondary_dmg integer NOT NULL,
                secondary_ability varchar(1027),
                UNIQUE (card_name, rarity),
                FOREIGN KEY (card_name, rarity) REFERENCES cards(card_name, rarity)
            );
            CREATE TABLE IF NOT EXISTS ability_cost(
                card_name varchar(255),
                rarity varchar(255),
                is_secondary boolean,
                item_type varchar(255),
                FOREIGN KEY (card_name, rarity) REFERENCES cards(card_name, rarity)
            );
            CREATE TABLE IF NOT EXISTS effect_cards(
                card_name varchar(255),
                rarity varchar(255),
                effect_description varchar(1027) NOT NULL,
                UNIQUE (card_name, rarity),
                FOREIGN KEY (card_name, rarity) REFERENCES cards(card_name, rarity)
            );
            CREATE TABLE IF NOT EXISTS libraries(
                user_id uuid REFERENCES users(user_id),
                card_name varchar(255),
                rarity varchar(255),
                copies integer NOT NULL,
				PRIMARY KEY (user_id, card_name, rarity),
                FOREIGN KEY (card_name, rarity) REFERENCES cards(card_name, rarity)
            );
			CREATE TABLE IF NOT EXISTS decks(
                deck_code varchar(7) PRIMARY KEY DEFAULT substr(digest(random()::text, 'sha1')::text, 3, 7),
				user_id uuid REFERENCES users(user_id),
				deck_name varchar(255)
            );
			CREATE TABLE IF NOT EXISTS deck_cards(
                deck_code varchar(7) REFERENCES decks(deck_code),
                card_name varchar(255),
                rarity varchar(255),
                FOREIGN KEY (card_name, rarity) REFERENCES cards(card_name, rarity)
            );
			CREATE TABLE IF NOT EXISTS purchases(
                user_id uuid REFERENCES users(user_id),
                purchase_name varchar(255) NOT NULL,
				purchase_rarity varchar(255),
				purchase_time varchar(255) NOT NULL,
				is_pack_purchase boolean NOT NULL
            );
			CREATE TABLE IF NOT EXISTS sales(
				user_id uuid REFERENCES users(user_id),
                card_name varchar(255),
                rarity varchar(255),
                cost integer NOT NULL,
				PRIMARY KEY (user_id, card_name, rarity),
                FOREIGN KEY (card_name, rarity) REFERENCES cards(card_name, rarity)
			);
        `)
	} catch (err) {
		console.log(err)
	}
}

export async function destroyTables(): Promise<string> {
	try {
		await pool.query(
			sql`
				DROP TABLE ability_cost CASCADE;
				DROP TABLE libraries CASCADE;
				DROP TABLE deck_cards CASCADE;
				DROP TABLE decks CASCADE;
				DROP TABLE hermit_cards CASCADE;
				DROP TABLE effect_cards CASCADE;
				DROP TABLE cards CASCADE;
				DROP TABLE expansions CASCADE;
				DROP TABLE types CASCADE;
				DROP TABLE users CASCADE;
			`
		)
		return 'success'
	} catch (err) {
		return 'failure'
	}
}

export async function addCardsToDatabase() {
	const cards = await grabCardsFromGoogleSheets()
	const effectCards = cards?.effectCards
	const hermitCards = cards?.hermitCards
	const itemCards = cards?.itemCards
	const expansions = cards?.expansions
	const types = cards?.types
	if (!effectCards || !hermitCards || !itemCards || !expansions || !types) return

	try {
		// Insert expansions
		await pool.query(
			sql`
                INSERT INTO expansions (expansion_name,expansion_color) SELECT * FROM UNNEST (
                    $1::text[],
                    $2::text[]
                ) ON CONFLICT DO NOTHING;
            `,
			[expansions.names, expansions.colors]
		)
		// Insert types
		await pool.query(
			sql`
                INSERT INTO types (type_name,type_color) SELECT * FROM UNNEST (
                    $1::text[],
                    $2::text[]
                ) ON CONFLICT DO NOTHING;
            `,
			[types.names, types.colors]
		)
		// Insert cards to main sheet
		await pool.query(
			sql`
                INSERT INTO cards (card_name,rarity,expansion,card_update,main_type,sub_type,tokens) SELECT * FROM UNNEST (
                    $1::text[],
                    $2::text[],
                    $3::text[],
                    $4::int[],
                    $5::text[],
                    $6::text[],
                    $7::int[]
                ) ON CONFLICT DO NOTHING;
            `,
			[
				[...hermitCards.names, ...effectCards.names, ...itemCards.names],
				[...hermitCards.rarities, ...effectCards.rarities, ...itemCards.rarities],
				[...hermitCards.expansions, ...effectCards.expansions, ...itemCards.expansions],
				[...hermitCards.updates, ...effectCards.updates, ...itemCards.updates],
				[...hermitCards.types, ...effectCards.types, ...itemCards.types],
				[...hermitCards.subtypes, ...effectCards.subtypes, ...itemCards.subtypes],
				[...hermitCards.tokens, ...effectCards.tokens, ...itemCards.tokens],
			]
		)

		// Insert Hermit cards to the Hermit card sheet
		await pool.query(
			sql`
                INSERT INTO hermit_cards (card_name,rarity,health,primary_move,primary_dmg,primary_ability,secondary_move,secondary_dmg,secondary_ability) SELECT * FROM UNNEST (
                    $1::text[],
                    $2::text[],
                    $3::int[],
                    $4::text[],
                    $5::int[],
                    $6::text[],
                    $7::text[],
                    $8::int[],
                    $9::text[]
                ) ON CONFLICT DO NOTHING;
            `,
			[
				hermitCards.names,
				hermitCards.rarities,
				hermitCards.health,
				hermitCards.primaryMoveName,
				hermitCards.primaryMoveDamage,
				hermitCards.primaryMoveAbility,
				hermitCards.secondaryMoveName,
				hermitCards.secondaryMoveDamage,
				hermitCards.secondaryMoveAbility,
			]
		)
		// Insert hermit card ability costs
		await pool.query(sql`DELETE FROM ability_cost;`)
		await pool.query(
			sql`
                INSERT INTO ability_cost (card_name,rarity,is_secondary,item_type) SELECT * FROM UNNEST (
                    $1::text[],
                    $2::text[],
                    $3::boolean[],
                    $4::text[]
                ) ON CONFLICT DO NOTHING;
            `,
			[
				hermitCards.moveCosts[0],
				hermitCards.moveCosts[1],
				hermitCards.moveCosts[2],
				hermitCards.moveCosts[3],
			]
		)
		// Insert Effect cards to the Effect card sheet
		await pool.query(
			sql`
                INSERT INTO effect_cards (card_name,rarity,effect_description) SELECT * FROM UNNEST (
                    $1::text[],
                    $2::text[],
                    $3::text[]
                ) ON CONFLICT DO NOTHING;
            `,
			[effectCards.names, effectCards.rarities, effectCards.description]
		)
	} catch (err) {
		console.log(err)
	}
	return null
}

export type cardObjectsResult = {
	hermitCards: HermitCard[]
	effectCards: EffectCard[]
	itemCards: ItemCard[]
}

export async function createCardObjects(): Promise<cardObjectsResult> {
	const defaultReturn = {
		hermitCards: [],
		effectCards: [],
		itemCards: [],
	}

	try {
		const result = await pool.query(
			sql`
                SELECT cards.card_name, cards.rarity, cards.expansion, cards.card_update, cards.main_type, cards.sub_type, 
                       cards.picture, cards.tokens ,
                       hermit_cards.health, hermit_cards.primary_move, hermit_cards.primary_dmg, hermit_cards.primary_ability,
                       hermit_cards.secondary_move, hermit_cards.secondary_ability, hermit_cards.secondary_dmg,
                       effect_cards.effect_description,
					   expansions.expansion_color,
					   types.type_color,
					   ability_cost.is_secondary, ability_cost.item_type
                       FROM cards
                LEFT JOIN hermit_cards ON (cards.card_name, cards.rarity) = (hermit_cards.card_name, hermit_cards.rarity)
                LEFT JOIN effect_cards ON (cards.card_name, cards.rarity) = (effect_cards.card_name, effect_cards.rarity)
				LEFT JOIN expansions ON (expansions.expansion_name) = (cards.expansion)
				LEFT JOIN types ON (types.type_name) = (cards.sub_type)
				LEFT JOIN ability_cost ON (cards.card_name, cards.rarity) = (ability_cost.card_name, ability_cost.rarity);
            `
		)

		if (!result.rowCount) return defaultReturn

		const hermitCards: Array<HermitCard> = []
		const effectCards: Array<EffectCard> = []
		const itemCards: Array<ItemCard> = []
		result.rows.forEach((row: any) => {
			if (
				row.main_type === 'hermit' &&
				(hermitCards.length === 0 ||
					!hermitCards.some((card) => card.name === row.card_name && card.rarity === row.rarity))
			) {
				hermitCards.push(
					new HermitCard({
						name: row.card_name,
						rarity: row.rarity,
						expansion: {
							name: row.expansion,
							color: row.expansion_color,
						},
						update: row.card_update,
						hermitType: {
							name: row.sub_type,
							color: row.type_color,
						},
						picture: row.picture,
						tokens: row.tokens,
						health: row.health,
						primaryAttack: {
							name: row.primary_move,
							damage: row.primary_dmg,
							ability: row.primary_ability,
							cost: [],
						},
						secondaryAttack: {
							name: row.secondary_move,
							damage: row.secondary_dmg,
							ability: row.secondary_ability,
							cost: [],
						},
					})
				)

				if (row.is_secondary) {
					hermitCards[hermitCards.length - 1].secondaryAttack.cost.push(row.item_type)
				} else {
					hermitCards[hermitCards.length - 1].primaryAttack.cost.push(row.item_type)
				}
			} else if (row.main_type === 'hermit') {
				const card = hermitCards.find(
					(card) => card.name === row.card_name && card.rarity === row.rarity
				)
				if (!card) return
				if (row.is_secondary) {
					card.secondaryAttack.cost.push(row.item_type)
				} else {
					card.primaryAttack.cost.push(row.item_type)
				}
			} else if (row.main_type === 'effect') {
				effectCards.push(
					new EffectCard({
						name: row.card_name,
						rarity: row.rarity,
						expansion: {
							name: row.expansion,
							color: row.expansion_color,
						},
						update: row.card_update,
						picture: row.picture,
						tokens: row.tokens,
						category: row.sub_type,
						description: row.effect_description,
					})
				)
			} else if (row.main_type === 'item') {
				itemCards.push(
					new ItemCard({
						name: row.card_name,
						rarity: row.rarity,
						expansion: {
							name: 'Item Card',
							color: 'FFFFFF',
						},
						update: row.card_update,
						picture: row.picture,
						hermitType: {
							name: row.sub_type,
							color: row.type_color,
						},
						tokens: row.tokens,
					})
				)
			}
		})

		return {hermitCards, effectCards, itemCards}
	} catch (err) {
		console.log(err)
		return defaultReturn
	}
}
