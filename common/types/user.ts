import {PartialCardT, PartialCardWithCopiesT, PartialPackT} from './cards'

export type userInfoT = {
	username: string
	uuid: string
	userSecret: string
}

export type userCreateResultT = {
	result: 'username_taken' | 'success' | 'db_connection' | 'failure'
}
export type Uuid = string

export type PastPurchasesT = {
	type: 'card' | 'pack' | 'import'
	purchase: PartialCardT | PartialPackT
	date: number
}

export type userInventoryT = {
	library: Array<PartialCardWithCopiesT>
	tokens: number
	pastPurchases: Array<PastPurchasesT>
}

export type passwordResultT =
	| 'success'
	| 'no_match'
	| 'length_small'
	| 'case_upper'
	| 'case_lower'
	| 'number'
	| 'special'
export type usernameResultT = 'success' | 'missing' | 'long' | 'whitespace'
