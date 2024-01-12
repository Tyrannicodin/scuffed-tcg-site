import pg from 'pg'
import {signupResultT, Uuid} from '../../../common/types/user'
import {grabCardsFromGoogleSheets} from './sheets'

const {Pool} = pg

// This is just for syntax highlighting, it doesn't do anything.
const sql = (strings: TemplateStringsArray, ...expr: any[]) =>
	strings.map((str, index) => str + (expr.length > index ? String(expr[index]) : '')).join('')

export const pool = new Pool({
	user: 'postgres',
	password: 'p5J40EmGU24',
	host: 'localhost',
	port: 5432,
	database: 'scuffed_tcg',
})

export const createTables = async () => {
	try {
		pool.query(sql`
             --Dropping ability_cost is a bandaid, will fix properly later
			ALTER TABLE IF EXISTS libraries DROP CONSTRAINT card_constr;
            DROP TABLE IF EXISTS  ability_cost;
			DROP TABLE IF EXISTS  hermit_cards;
			DROP TABLE IF EXISTS  effect_cards;
			DROP TABLE IF EXISTS  cards;
            
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
            CREATE TABLE IF NOT EXISTS cards(
                card_name varchar(31) NOT NULL,
                rarity varchar(31) NOT NULL,
                expansion varchar(255) NOT NULL,
                card_update integer NOT NULL,
                main_type varchar(255) NOT NULL,
                sub_type varchar(255) NOT NULL,
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
                copies integer NOT NULL
                --CONSTRAINT card_constr FOREIGN KEY (card_name, rarity) REFERENCES cards(card_name, rarity)
            );
			ALTER TABLE libraries ADD CONSTRAINT card_constr FOREIGN KEY (card_name, rarity) REFERENCES cards(card_name, rarity);
        `)
	} catch (err) {
		console.log(err)
	}
}

export const createUser = async (
	username: string,
	email: string,
	hash: string
): Promise<signupResultT> => {
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

		const result = await pool.query(
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
		console.log(err)
		return {result: 'failure'}
	}
}

export const selectUserUUID = async (username: string, hash: string): Promise<Uuid | null> => {
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

export const selectUserRowFromUuid = async (uuid: Uuid): Promise<Record<string, any> | null> => {
	try {
		const result = await pool.query(
			sql`
                SELECT uuid,username,tokens,picture,is_admin FROM users WHERE uuid = $1;
            `,
			[uuid]
		)

		if (result.rowCount && result.rowCount > 0) {
			return result.rows[0]
		}
	} catch (err) {
		console.log(err)
	}
	return null
}

export const addCardsToDatabase = async () => {
	const cards = await grabCardsFromGoogleSheets()
	const effectCards = cards?.effectCards
	const hermitCards = cards?.hermitCards
	const itemCards = cards?.itemCards
	if (!effectCards || !hermitCards || !itemCards) return

	try {
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
                );
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
                );
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
		await pool.query(
			sql`
                INSERT INTO ability_cost (card_name,rarity,is_secondary,item_type) SELECT * FROM UNNEST (
                    $1::text[],
                    $2::text[],
                    $3::boolean[],
                    $4::text[]
                );
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
                );
            `,
			[effectCards.names, effectCards.rarities, effectCards.description]
		)
	} catch (err) {
		console.log(err)
	}
	return null
}

export const deleteUser = async (username: string): Promise<signupResultT> => {
	return {result: 'success'}
}
