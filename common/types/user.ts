import {PartialCardT, PartialCardWithCopiesT, PartialPackT} from './cards'

export type userInfoT = {
	username: string
	uuid: string
	userSecret: string
}

export type signupResultT = {result: 'username_taken' | 'email_taken' | 'success' | 'failure'}
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
