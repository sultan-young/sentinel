import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import { dirname, resolve, basename } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'node:module'
import terser from '@rollup/plugin-terser'
import clear from 'rollup-plugin-clear'

const require = createRequire(import.meta.url)

const build_target = process.env.TARGET
if (!build_target) {
	throw new Error('TARGET package must be specified')
}

const currentURL = new URL(import.meta.url)
const currentPath = fileURLToPath(currentURL)
const currentDirectory = dirname(currentPath)
// packages路径
const packagesDir = resolve(currentDirectory, 'packages')
// 要打包的lib目录
const targetPackageDir = resolve(packagesDir, build_target)
// 要打包的lib名称
const targetName = basename(targetPackageDir)
// 版本号
const masterVersion = require('./package.json')
// dist目录
const outputDist = resolve(targetPackageDir, `dist`)

const common_config = {
	input: `${targetPackageDir}/src/index.ts`,
	output: {
		banner: `/* 【hp f2e】-${targetName} version ' + ${masterVersion} */`,
		footer: '/* Thanks MITO */',
	},
	plugins: [
		clear({
			targets: [outputDist]
		}),
		typescript({
			tsconfig: 'tsconfig.build.json',
			compilerOptions: {
				declarationDir: `${outputDist}/packages/`, // 类型声明文件的输出目录
			}
		}),
		commonjs(),
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
		// plugins: [terser()],
	},
}

// rollup.config.js
/**
 * @type {import('rollup').RollupOptions}
 */
// 打包步骤 ts => ESM => EJS
export default [esmPackage, cjsPackage, iifePackage]
