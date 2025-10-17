export type AccountData = {
	title: string
	login: string
	password: string
	description: string
}

export type Account = {
	title: string
	url: string | undefined

	data: AccountData[]
}
