/*
* edge-parser
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { TagToken, LexerTagDefinitionContract } from 'edge-lexer'

import { Parser } from '../Parser'
import { EdgeBuffer } from '../EdgeBuffer'

/**
 * The parser needs the `compile` method on every tag
 */
export interface ParserTagDefinitionContract extends LexerTagDefinitionContract {
  compile (parser: Parser, buffer: EdgeBuffer, token: TagToken): void
}

/**
 * Loc node from Acorn
 */
export type AcornLoc = {
  start: {
    line: number
    column: number,
  },
  end: {
    line: number
    column: number,
  },
}
