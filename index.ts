/*
 * edge-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export { Stack } from './src/stack/index.js'
export { Parser } from './src/parser/index.js'
export { EdgeBuffer } from './src/edge_buffer/index.js'

import * as ExpressionsList from './src/expressions/index.js'

/**
 * Names of supported expressions
 */
export const expressions = Object.keys(ExpressionsList).reduce((result, name) => {
  // @ts-ignore
  result[name] = name
  return result
}, {}) as { [P in keyof typeof ExpressionsList]: P }
