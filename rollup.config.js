import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'

// rollup.config.js
/**
 * @type {import('rollup').RollupOptions}
 */
// 打包步骤 ts => ESM => EJS
export default {
	input: 'src/index.ts',
	plugins: [
		typescript({
			tsconfig: './tsconfig.json',
		}),
		nodeResolve({
			extensions: ['.js', '.jsx', '.ts'],
		}),
		commonjs(),
		json(),
	],
	output: {
		dir: 'dist',
		format: 'esm',
	},
	external: ['koa', 'koa-router'],
}
