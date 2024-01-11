import pg from 'pg'
import {signupResultT, UuidT} from '../../../common/types/user'

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
                card_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                card_name varchar(255) NOT NULL,
                rarity varchar(255) NOT NULL,
                main_type varchar(255) NOT NULL,
                sub_type varchar(255) NOT NULL,
                picture varchar(1027) NOT NULL,
                tokens integer NOT NULL
            );
            CREATE TABLE IF NOT EXISTS hermit_cards(
                card_id uuid REFERENCES cards(card_id),
                health integer NOT NULL,
                primary_move varchar(255) NOT NULL,
                primary_dmg integer NOT NULL,
                secondary_move varchar(255) NOT NULL,
                secondary_dmg integer NOT NULL
            );
            CREATE TABLE IF NOT EXISTS effect_cards(
                card_id uuid REFERENCES cards(card_id),
                effect_description varchar(255) NOT NULL
            );
            CREATE TABLE IF NOT EXISTS libraries(
                user_id uuid REFERENCES users(user_id),
                card_id uuid REFERENCES cards(card_id),
                copies integer NOT NULL
            );
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

		if (unique_check.rows.length > 0 && unique_check.rows[0].username) {
			return 'username_taken'
		} else if (unique_check.rows.length > 0 && unique_check.rows[0].email) {
			return 'email_taken'
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

		return 'success'
	} catch (err) {
		console.log(err)
		return 'failure'
	}
}

export const selectUserUUID = async (username: string, hash: string): Promise<UuidT> => {
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
