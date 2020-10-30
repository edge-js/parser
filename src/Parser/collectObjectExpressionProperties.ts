/*
 * edge-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Returns Acorn complaint AST for a collable expression
 */
export function collectObjectExpressionProperties(expression: any): string[] {
	return expression.properties.map((prop) => {
		if (prop.value.type !== 'Identifier') {
			throw new Error('Object destructuring should not reference dynamic properties')
		}
		return prop.value.name
	})
}
