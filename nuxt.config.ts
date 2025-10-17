import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
	modules: ['@nuxt/icon'],

	css: ['~/assets/css/main.css'],

	ssr: false,
	vite: {
		plugins: [tailwindcss()],
		clearScreen: false,
		envPrefix: ['VITE_', 'TAURI_'],
		server: { strictPort: true },
	},
	ignore: ['**/src-tauri/**'],
})
