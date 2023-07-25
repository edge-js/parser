/*
 * edge-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { TagToken, LexerTagDefinitionContract, MustacheToken } from 'edge-lexer/types'

import { Parser } from './parser/index.js'
import { EdgeBuffer } from './edge_buffer/index.js'

/**
 * The parser needs the `compile` method on every tag
 */
export interface ParserTagDefinitionContract extends LexerTagDefinitionContract {
  compile(parser: Parser, buffer: EdgeBuffer, token: TagToken): void
}

/**
 * Loc node from Acorn
 */
export type AcornLoc = {
  start: {
    line: number
    column: number
  }
  end: {
    line: number
    column: number
  }
}

export type TagTransformer = (tag: TagToken) => void
export type MustacheTransformer = (tag: MustacheToken) => void
export type ClaimTagFn = (name: string) => LexerTagDefinitionContract | null
export type OnLineFn = (line: string) => string

/**
 * Parser options
 */
export type ParserOptions = {
  /**
   * Is parsing in async mode
   */
  async?: boolean

  /**
   * Modify the line before it is being processed by the lexer
   */
  onLine?: OnLineFn

  /**
   * Modify the tag before it is being processed by the parser
   */
  onTag?: TagTransformer

  /**
   * Modify the mustache block before it is being processed by the parser
   */
  onMustache?: MustacheTransformer

  /**
   * Claim un-registered tags
   */
  claimTag?: ClaimTagFn

  /**
   * Nested or flat path to the escape method for escaping values.
   */
  escapeCallPath: string | [string, string]

  /**
   * Name of the property to be used for accessing the values from
   * the template. Leave it to an empty string, if properties
   * are available directly (meaning without a subpath).
   */
  statePropertyName: string

  /**
   * An array of local variables to be accessible directly. Define these
   * so that the parser doesn't access them from the state property.
   */
  localVariables?: string[]
}
