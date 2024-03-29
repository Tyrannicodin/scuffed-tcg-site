import {google} from 'googleapis'
import env from 'env-var'
import 'dotenv/config'

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
const CREDENTIALS = env.get('GOOGLE_INFO').asJsonObject()

function saveCredentials(client: any) {
	const keys = CREDENTIALS as Record<string, string>
	if (keys === undefined) return
	const payload = JSON.stringify({
		type: 'authorized_user',
		client_id: keys.client_id,
		client_secret: keys.client_secret,
		refresh_token: client.credentials.refresh_token,
	})
}

async function authorize() {
	var client = new google.auth.GoogleAuth({
		scopes: SCOPES,
		credentials: CREDENTIALS,
	})
	if ((client as any).credentials) {
		await saveCredentials(client)
	}
	return client
}

function getItemTypeArray(name: string, rarity: string, costCell: string, isSecondary: boolean) {
	const typeConversions: Record<string, string> = {
		Anr: 'anarchist',
		Ath: 'athlete',
		Bal: 'balanced',
		Brd: 'bard',
		Bld: 'builder',
		Exp: 'explorer',
		Chl: 'challenger',
		Clct: 'collector',
		Dpl: 'diplomat',
		Frm: 'farm',
		Hst: 'historian',
		Inv: 'inventor',
		Lpr: 'looper',
		Min: 'miner',
		Pcf: 'pacifist',
		Prnk: 'prankster',
		PvP: 'pvp',
		Red: 'redstone',
		Scv: 'scavenger',
		Spd: 'speedrunner',
		Trf: 'terraform',
		Wld: 'untyped',
	}

	const costs = costCell.split(' ')
	const output = costs.flatMap((cost) => {
		const type = Object.keys(typeConversions).reduce((acc, curr) => {
			if (cost.includes(curr)) return typeConversions[curr]
			return acc
		}, '')
		const amount = Number(cost.replace(new RegExp(/\D/, 'gm'), ''))
		return Array(amount).fill([name, rarity, isSecondary, type])
	})
	return output
}

export function generateItemCards(types: Set<string>) {
	const itemCardMap: Record<string, any> = {
		names: [],
		rarities: [],
		expansions: [],
		updates: [],
		types: [],
		subtypes: [],
		tokens: [],
	}

	types.forEach((type) => {
		itemCardMap.names.push(`${type}`)
		itemCardMap.rarities.push('Free')
		itemCardMap.expansions.push('Hermitcraft')
		itemCardMap.updates.push(0)
		itemCardMap.types.push('item')
		itemCardMap.subtypes.push(type)
		itemCardMap.tokens.push(0)
	})

	types.forEach((type) => {
		itemCardMap.names.push(`${type} x2`)
		itemCardMap.rarities.push('Rare')
		itemCardMap.expansions.push('Hermitcraft')
		itemCardMap.updates.push(0)
		itemCardMap.types.push('item')
		itemCardMap.subtypes.push(type)
		itemCardMap.tokens.push(2)
	})

	return itemCardMap
}

function toHex(dict: any): string {
	if (!dict.rgbColor) return 'ffffff'
	const colors = dict.rgbColor
	if (!colors.red && !colors.green && !colors.blue) return 'ffffff'
	const red = colors.red ? Math.floor(colors.red * 255).toString(16) : '00'
	const green = colors.green ? Math.floor(colors.green * 255).toString(16) : '00'
	const blue = colors.blue ? Math.floor(colors.blue * 255).toString(16) : '00'
	return `${red}${green}${blue}`
}

async function getCards(auth: any) {
	const sheets = google.sheets({version: 'v4', auth})
	const res = await sheets.spreadsheets.get({
		spreadsheetId: '1vGk1DPQFWvf6JO73COMVv0Bp2F-i1IMGQOr5Zdvq0Vg',
		ranges: ['Hermits!A2:N', 'Effects!A2:G'],
		includeGridData: true,
	})
	const data = res.data

	if (!data.sheets || data.sheets.length < 2) return

	const hermitsSheet = data.sheets[0]
	const effectsSheet = data.sheets[1]

	if (!hermitsSheet.data || !effectsSheet.data) return

	const hermits = hermitsSheet.data[0].rowData
	const effects = effectsSheet.data[0].rowData

	if (!hermits || !effects) return

	const hermitCardMap: Record<string, any> = {
		names: [],
		rarities: [],
		expansions: [],
		updates: [],
		types: [],
		subtypes: [],
		tokens: [],
		health: [],
		primaryMoveName: [],
		primaryMoveDamage: [],
		primaryMoveAbility: [],
		primaryMoveCost: [],
		secondaryMoveName: [],
		secondaryMoveDamage: [],
		secondaryMoveAbility: [],
		secondaryMoveCost: [],
		moveCosts: [],
	}

	const effectCardMap: Record<string, any> = {
		names: [],
		rarities: [],
		expansions: [],
		updates: [],
		types: [],
		subtypes: [],
		tokens: [],
		description: [],
	}

	const expansionMap: Record<string, any> = {
		names: [],
		colors: [],
	}

	const typeMap: Record<string, any> = {
		names: [],
		colors: [],
	}

	hermits.map((row: any) => {
		const values = row.values
		if (!values) return
		if (
			!values[0].formattedValue ||
			!values[2].formattedValue ||
			!values[6].formattedValue ||
			!values[9].formattedValue
		)
			return
		hermitCardMap.names.push(values[0].formattedValue)
		hermitCardMap.rarities.push(values[2].formattedValue)
		hermitCardMap.expansions.push(values[11].formattedValue)
		hermitCardMap.updates.push(values[13].formattedValue)
		hermitCardMap.types.push('hermit')
		hermitCardMap.subtypes.push(values[1].formattedValue)
		hermitCardMap.tokens.push(
			values[10].formattedValue !== 'N/A' ? values[10].formattedValue : null
		)
		hermitCardMap.health.push(values[3].formattedValue)
		hermitCardMap.primaryMoveName.push(values[4].formattedValue)
		hermitCardMap.primaryMoveDamage.push(values[5].formattedValue)
		hermitCardMap.primaryMoveAbility.push(values[4].note)
		hermitCardMap.primaryMoveCost.push(
			...getItemTypeArray(
				values[0].formattedValue,
				values[2].formattedValue,
				values[6].formattedValue,
				false
			)
		)
		hermitCardMap.secondaryMoveName.push(values[7].formattedValue)
		hermitCardMap.secondaryMoveDamage.push(values[8].formattedValue)
		hermitCardMap.secondaryMoveAbility.push(values[7].note)
		hermitCardMap.secondaryMoveCost.push(
			...getItemTypeArray(
				values[0].formattedValue,
				values[2].formattedValue,
				values[9].formattedValue,
				true
			)
		)

		if (!expansionMap.names.includes(values[11].formattedValue)) {
			expansionMap.names.push(values[11].formattedValue)
			expansionMap.colors.push(toHex(values[11].effectiveFormat?.backgroundColorStyle))
		}

		if (!typeMap.names.includes(values[1].formattedValue)) {
			typeMap.names.push(values[1].formattedValue)
			typeMap.colors.push(toHex(values[1].effectiveFormat?.backgroundColorStyle))
		}
	})

	const hermitCardCosts = [...hermitCardMap.primaryMoveCost, ...hermitCardMap.secondaryMoveCost]
	hermitCardMap.moveCosts = hermitCardCosts[0].map((_: any, colIndex: any) =>
		hermitCardCosts.map((row) => row[colIndex])
	)

	effects.map((row: any) => {
		const values = row.values
		if (!values) return
		if (!values[0].formattedValue) return
		effectCardMap.names.push(values[0].formattedValue)
		effectCardMap.rarities.push(values[2].formattedValue)
		effectCardMap.expansions.push(values[3].formattedValue)
		effectCardMap.updates.push(values[6].formattedValue)
		effectCardMap.types.push('effect')
		effectCardMap.subtypes.push(values[1].formattedValue)
		effectCardMap.tokens.push(values[5].formattedValue !== 'N/A' ? values[5].formattedValue : null)
		effectCardMap.description.push(values[1].note)

		if (!expansionMap.names.includes(values[3].formattedValue)) {
			expansionMap.names.push(values[3].formattedValue)
			expansionMap.colors.push(toHex(values[3].effectiveFormat?.backgroundColorStyle))
		}

		if (!typeMap.names.includes(values[1].formattedValue)) {
			typeMap.names.push(values[1].formattedValue)
			typeMap.colors.push(toHex(values[1].effectiveFormat?.backgroundColorStyle))
		}
	})

	return {
		hermitCards: hermitCardMap,
		effectCards: effectCardMap,
		itemCards: generateItemCards(new Set(hermitCardMap.subtypes)),
		expansions: expansionMap,
		types: typeMap,
	}
}

export async function grabCardsFromGoogleSheets() {
	return await authorize().then(getCards).catch(console.error)
}
