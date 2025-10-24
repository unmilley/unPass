import 'dotenv/config'
import { readFile, writeFile } from 'fs/promises'

const key = process.env.KEY_PASS
if (!key) {
	console.error('❌ Env key not found')

	process.exit(1)
}

async function replaceInFileAsync(filePath: string, searchString: string, replacementString: string) {
	try {
		const fileContent = await readFile(filePath, 'utf8')
		const newContent = fileContent.replace(searchString, replacementString)
		await writeFile(filePath, newContent, 'utf8')

		console.log('✔️ The file(`key.ts`) has been updated successfully')
	} catch (error) {
		console.error('❌ Error when working with a file:', error)
		process.exit(1)
	}
}

async function main() {
	await replaceInFileAsync('app/src/constants/key.ts', `KEY = ''`, `KEY = '${key}'`)
}

main()
