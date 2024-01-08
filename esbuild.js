import {build} from 'esbuild'

await build({
	entryPoints: ['./server/src'],
	tsconfig: './server/tsconfig.json',
	platform: 'node',
	packages: 'external',
	format: 'esm',
	bundle: true,
	outfile: 'server/dist/index.js'
})

console.log('Build complete')
