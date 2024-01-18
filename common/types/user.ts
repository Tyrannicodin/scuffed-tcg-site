export type userInfoT = {
	username: string
	uuid: string
	userSecret: string
}

export type signupResultT = {result: 'username_taken' | 'email_taken' | 'success' | 'failure'}
export type Uuid = string

export type passwordResultT = 'success' | 'no_match' | 'length_small' | 'case_upper' | 'case_lower' | 'number' | 'special'
export type usernameResultT = 'success' | 'missing' | 'long' | 'whitespace'
