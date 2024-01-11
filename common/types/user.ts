export type userInfoT = {
	username: string
	userSecret: string
}

export type signupResultT = 'username_taken' | 'email_taken' | 'success' | 'failure'
export type UuidT = string | null
