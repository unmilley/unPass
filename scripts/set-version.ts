import { readFile, writeFile } from 'fs/promises'

const main = async () => {
	const { version } = await import('../package.json')
	const TAURI_PATH = ['src-tauri/tauri.conf.json', 'src-tauri/Cargo.toml']

	try {
		for (const path of TAURI_PATH) {
			const fileContent = await readFile(path, 'utf8')
			const splittedFileContent = fileContent.split('\n')
			const id = splittedFileContent.findIndex((val) => /version/.test(val))
			if (id === -1) throw new Error(`Version not found in '${path}'`)

			const changeVersion = (item: string): string => {
				if (item.includes('"version":')) {
					return item.replace(/"version":\s*"[^"]*"/, `"version": "${version}"`)
				} else if (item.includes('version =')) {
					return item.replace(/version\s*=\s*"[^"]*"/, `version = "${version}"`)
				} else if (item.includes("'version':")) {
					return item.replace(/'version':\s*'[^']*'/, `'version': '${version}'`)
				}
				return item
			}

			splittedFileContent[id] = changeVersion(splittedFileContent[id])
			const newContent = splittedFileContent.join('\n')
			await writeFile(path, newContent, 'utf8')
			console.log(`✔️  The file(${path}) has been updated successfully`)
		}
	} catch (error) {
		console.error('❌ Error when working with a file:', error)
		process.exit(1)
	}
}

main()
