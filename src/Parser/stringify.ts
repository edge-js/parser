/*
 * edge-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { generate } from 'astring'

/**
 * Convert the acorn AST to a Javascript expression string
 */
export function stringify(astExpression: any): string {
	return generate(astExpression)
}
