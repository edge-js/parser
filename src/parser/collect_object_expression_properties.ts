/*
 * edge-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export function collectObjectExpressionProperties(expression: any): string[] {
  return expression.properties.map((prop: any) => {
    if (prop.value.type !== 'Identifier') {
      throw new Error('Object destructuring should not reference dynamic properties')
    }
    return prop.value.name
  })
}

export function collectArrayExpressionProperties(expression: any): string[] {
  return expression.elements.map((prop: any) => {
    if (prop.type !== 'Identifier') {
      throw new Error('Array destructuring should not reference dynamic properties')
    }
    return prop.name
  })
}
