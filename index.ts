/*
 * edge-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

export { Parser } from './src/Parser'
export { EdgeBuffer } from './src/EdgeBuffer'
export { ParserTagDefinitionContract, AcornLoc } from './src/Contracts'
import * as ExpressionsList from './src/Expressions'

/**
 * Names of supported expressions
 */
export const expressions = Object
  .keys(ExpressionsList)
  .reduce((result, name) => {
    result[name] = name
    return result
  }, {}) as { [P in keyof typeof ExpressionsList]: P }
