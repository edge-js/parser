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
import { EdgeError } from 'edge-error'

export default {
	toStatement(statement: any, filename: string, parser: Parser) {
		parser.stack.defineScope()

		statement.params.forEach((param) => {
			if (param.type === 'Identifier') {
				parser.stack.defineVariable(param.name)
			} else if (param.type === 'ObjectPattern') {
				parser.utils.collectObjectExpressionProperties(param).forEach((prop) => {
					parser.stack.defineVariable(prop)
				})
			} else {
				const { line, col } = parser.utils.getExpressionLoc(param)
				throw new EdgeError(
					`Report this error to the maintainers: Unexpected arrow function property type ${param.type}`,
					'E_PARSER_ERROR',
					{
						line,
						col,
						filename,
					}
				)
			}
		})

		statement.body = transformAst(statement.body, filename, parser)

		parser.stack.clearScope()

		return statement
	},
}
