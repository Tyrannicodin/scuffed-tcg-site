import pg from 'pg'
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
	pool.query(sql`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        CREATE TABLE IF NOT EXISTS users(
            user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            salted_hash varchar(255) NOT NULL,
            email varchar(255) NOT NULL,
            username varchar(255) NOT NULL,
            tokens integer NOT NULL,
            picture varchar(255) NOT NULL
        );
        CREATE TABLE IF NOT EXISTS cards(
            card_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            card_name varchar(255) NOT NULL,
            rarity varchar(255) NOT NULL,
            main_type varchar(255) NOT NULL,
            sub_type varchar(255) NOT NULL,
            picture varchar(1027) NOT NULL,
            tokens integer
        );
        CREATE TABLE IF NOT EXISTS hermit_cards(
            card_id uuid REFERENCES cards(card_id),
            health integer,
            primary_move varchar(255),
            primary_dmg integer,
            secondary_move varchar(255),
            secondary_dmg integer
        );
        CREATE TABLE IF NOT EXISTS effect_cards(
            card_id uuid REFERENCES cards(card_id),
            effect_description varchar(255)
        );
        CREATE TABLE IF NOT EXISTS libraries(
            user_id uuid REFERENCES users(user_id),
            card_id uuid REFERENCES cards(card_id),
            copies integer
        );
    `)
}
