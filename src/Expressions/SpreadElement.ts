/*
 * edge-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Parser } from '../Parser'

export default {
	toStatement(statement: any, filename: string, parser: Parser): object {
		statement.argument = parser.utils.transformAst(statement.argument, filename, parser)
		return statement
	},
}
