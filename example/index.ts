/*
 * edge-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Parser } from '../index'
import { EdgeBuffer } from '../index'

const filename = 'eval.edge'
const parser = new Parser({})
const buffer = new EdgeBuffer(filename)
const ctx = {
	escape(value: any) {
		return value
	},
	reThrow(error: Error) {
		throw error
	},
}

parser
	.tokenize('Hello {{ username }}', { filename })
	.forEach((token) => parser.processToken(token, buffer))

/**
 * Compiled output
 */
const output = buffer.flush()
console.log({ compiled: output })

/**
 * Wrap inside function and invoke it
 */
const fn = new Function('', `return function template (state, ctx) { ${output} }`)()
console.log(fn({ username: 'virk' }, ctx))
