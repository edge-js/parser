/*
* edge-parser
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import {
  TagToken,
  LexerTagDefinitionContract,
  RawToken,
  NewLineToken,
  MustacheToken,
} from 'edge-lexer'

import { Parser } from '../Parser'
import { EdgeBuffer } from '../EdgeBuffer'

/**
 * The parser needs the `compile` method on every tag
 */
export interface ParseTagDefininationContract extends LexerTagDefinitionContract {
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

/**
 * ------------------------------------------------------------------------
 * Parser tokens allows a custom filename for each token. This is helpful
 * when tokens of multiple files are merged together before they are
 * passed to parser.
 * ------------------------------------------------------------------------
 */
export type ParserNewLineToken = NewLineToken & {
  filename?: string,
}

export type ParserRawToken = RawToken & {
  filename?: string,
}

export type ParserTagToken = TagToken & {
  filename?: string,
  children: ParserToken[];
}

export type ParserMustacheToken = MustacheToken & {
  filename?: string,
}

export type ParserToken = ParserNewLineToken | ParserRawToken | ParserTagToken | ParserMustacheToken
