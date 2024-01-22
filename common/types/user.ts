import {PartialCardT, PartialCardWithCopiesT, PartialPackT} from './cards'

export type userInfoT = {
	username: string
	uuid: string
	userSecret: string
}

export type userCreateResultT = {
	result: 'username_taken' | 'email_taken' | 'success' | 'db_connection' | 'failure'
}
export type Uuid = string

export type PastPurchasesT = {
	type: 'card' | 'pack'
	purchase: PartialCardT | PartialPackT
	date: number
}

export type UserInfoT = {
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
