import { AES, enc } from 'crypto-js'

/**
 * ("meow", "key") => "U2FsdGVkX1+lnEkuUjM/mHLRYliOjp5pkg31kL+Y1NQ="
 */
export const encrypt = (text: string, secretKey: string): string => {
	if (!text) return ''
	const combine = `${text}_${secretKey}`
	return AES.encrypt(combine, secretKey).toString()
}

/**
 * ("U2FsdGVkX1+lnEkuUjM/mHLRYliOjp5pkg31kL+Y1NQ=", "key") => "meow"
 */
export const decrypt = (encryptedText: string, secretKey: string): string => {
	try {
		const bytes = AES.decrypt(encryptedText, secretKey)
		return bytes.toString(enc.Utf8).replace(`_${secretKey}`, '')
	} catch {
		return ''
	}
}

export const changeKey = (encryptedText: string, oldKey: string, newKey: string): string => {
	const decoded = decrypt(encryptedText, oldKey)
	return encrypt(decoded, newKey)
}
