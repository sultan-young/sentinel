import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import { dirname, resolve, basename } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'node:module';
import terser from '@rollup/plugin-terser';

const require = createRequire(import.meta.url);

const build_target = process.env.TARGET
if (!build_target) {
	throw new Error('TARGET package must be specified')
}

const currentURL = new URL(import.meta.url)
const currentPath = fileURLToPath(currentURL)
const currentDirectory = dirname(currentPath)
const packagesDir = resolve(currentDirectory, 'packages')
const targetPackageDir = resolve(packagesDir, build_target)
const targetName = basename(targetPackageDir)
const masterVersion = require('./package.json');
const outputDist =  resolve(currentDirectory, 'dist')
console.log('masterVersion: ', outputDist, outputDist);
// console.log('targetName: ', targetName);

const common_config = {
	input: `${targetPackageDir}/src/index.ts`,
	output: {
		banner: `/* 【hp f2e】-${targetName} version ' + ${masterVersion} */`,
		footer: '/* Thanks MITO */'
	  },
	plugins: [
		commonjs(),
		typescript({
			tsconfig: 'tsconfig.build.json',
		}),
		nodeResolve({
			extensions: ['.js', '.jsx', '.ts'],
		}),
		json(),
	],
}

const esmPackage = {
	...common_config,
	output: {
		file: `${outputDist}/${targetName}.esm.js`,
		format: 'esm',
		sourcemap: true,
	},
}

const cjsPackage = {
	...common_config,
	output: {
		file: `${outputDist}/${targetName}.js`,
		format: 'cjs',
		sourcemap: true,
	},
}

const iifePackage = {
	...common_config,
	output: {
		file: `${outputDist}/${targetName}.iife.min.js`,
		format: 'iife',
		sourcemap: true,
		name: 'hpSentinel',
		plugins: [terser()]
	},
}

// rollup.config.js
/**
 * @type {import('rollup').RollupOptions}
 */
// 打包步骤 ts => ESM => EJS
export default [esmPackage, cjsPackage, iifePackage]
