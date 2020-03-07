/*
* edge-parser
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { EdgeError } from 'edge-error'
import { parse as acornParse, Token } from 'acorn'
import { LexerLoc } from 'edge-lexer/build/src/Contracts'

import { AcornLoc } from '../Contracts'

/**
 * Patch the acorn loc to point to the correct line number
 * inside the original template engine
 */
function patchLoc (loc: AcornLoc, lexerLoc: LexerLoc): void {
  loc.start.line = (loc.start.line + lexerLoc.start.line) - 1
  loc.end.line = (loc.end.line + lexerLoc.start.line) - 1

  /**
   * Patch the column also, when it's the first line. The reason we do this, since
   * the first line in the actual edge file may contain the Javascript expression
   * at a different column all together
   */
  if (loc.start.line === 1) {
    loc.start.column = loc.start.column + lexerLoc.start.col
  }
}

/**
 * Generates and returns the acorn AST for a given Javascript expression. Assuming
 * the Javascript expression is embedded into the edge lexer token, this method
 * expects you to pass the token loc and the filename.
 */
export function generateAST (jsArg: string, lexerLoc: LexerLoc, filename: string): any {
  const acornOptions = {
    locations: true,
    ecmaVersion: 7 as const,
    onToken: (token: Token) => patchLoc(token.loc!, lexerLoc),
  }

  try {
    const ast = acornParse(jsArg, acornOptions)
    return ast['body'][0]
  } catch (error) {
    /**
     * The error loc is not passed via `onToken` event, so need
     * to patch is here seperately
     */
    const line = (error.loc.line + lexerLoc.start.line) - 1
    const col = error.loc.line === 1 ? error.loc.column + lexerLoc.start.col : error.loc.column
    throw new EdgeError(error.message.replace(/\(\d+:\d+\)/, ''), 'E_ACORN_ERROR', {
      line,
      col,
      filename,
    })
  }
}
