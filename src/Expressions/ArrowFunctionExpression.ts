/*
 * edge-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { transformAst } from '../Parser/transformAst'
import { Parser } from '../Parser'

export default {
	toStatement(statement: any, filename: string, parser: Parser) {
		parser.stack.defineScope()

		statement.params.forEach((param) => {
			if (param.type === 'Identifier') {
				parser.stack.defineVariable(param.name)
			} else {
				throw new Error(
					`Report this error to the maintainers: Expected Arrow function params to be an identifier. Instead received ${param.type}`
				)
			}
		})

		statement.body = transformAst(statement.body, filename, parser)

		parser.stack.clearScope()

		return statement
	},
}
