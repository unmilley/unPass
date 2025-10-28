/**
 * Converts a URL to a domain name with a capital letter and colon at the end.
 *
 * This method extracts the domain name from the passed URL and returns it in a special format.
 * If the URL is invalid or empty, the method will return an empty string.
 *
 * @param {string} url - The `transformDomain` function takes a URL as input and transforms the domain
 * part of the URL into a formatted string.
 * @returns {string} The transformDomain function takes a URL as input, extracts the hostname, removes the last
 * part of the domain, capitalizes the first letter of each part, and returns the transformed domain as
 * a string with spaces between the parts.
 *
 *  @example
 * transformDomain('https://github.com') // 'Github'
 * transformDomain('https://e.mail.ru') // 'E Mail'
 */
export const transformDomain = (url: string): string => {
	if (!url) return ''
	try {
		const { hostname } = new URL(url)
		const parts = hostname.split('.')
		parts.splice(-1)

		return parts.map((p) => `${p.charAt(0).toUpperCase() + p.slice(1)}`).join(' ')
	} catch {
		return ''
	}
}
