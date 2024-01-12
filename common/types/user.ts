export type userInfoT = {
	username: string
	userSecret: string
}

export type signupResultT = {result: 'username_taken' | 'email_taken' | 'success' | 'failure'}
export type Uuid = string
