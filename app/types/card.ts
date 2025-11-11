export type CardData = {
	title?: string
	number?: string
	date?: string
	cvv?: string
	pin?: string
	secretWord?: string
	description?: string
}

export type Card = {
	title: string
	id: string
	favicon?: string

	data: CardData[]
}
