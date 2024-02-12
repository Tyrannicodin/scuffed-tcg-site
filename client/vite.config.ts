import path from 'path'
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {CONFIG} from '../common/config'
import env from 'env-var'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	define: {
		__ENV__: JSON.stringify(env.get('NODE_ENV').asString()),
		__PORT__: JSON.stringify(CONFIG.port),
	},
	resolve: {
		alias: {
			server: path.resolve(__dirname, '../server'),
			common: path.resolve(__dirname, '../common'),
			types: path.resolve(__dirname, './src/types'),
			sagas: path.resolve(__dirname, './src/sagas'),
			components: path.resolve(__dirname, './src/components'),
			logic: path.resolve(__dirname, './src/logic'),
			store: path.resolve(__dirname, './src/store'),
			socket: path.resolve(__dirname, './src/socket'),
		},
	},
	css: {
		modules: {
			localsConvention: 'camelCase',
		},
	},
	build: {
		minify: 'terser',
	},
	server: {
		port: CONFIG.clientDevPort || 3002,
	},
})
