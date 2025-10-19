const Key = () => {
	let KEY = ''
	return { get: () => KEY }
}

export const key = Key()
