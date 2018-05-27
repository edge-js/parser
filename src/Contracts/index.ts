/**
 * @module Parser
 */

import EdgeBuffer from '../EdgeBuffer'
import Contracts from 'edge-lexer/build/Contracts'

interface IParser {
  parseStatement (statement: any): any
  parseTemplate (template: string): string
  statementToString (statement: any): string
  parseJsArg (arg: string, lineno: number): any
  processToken (token: Contracts.IBlockNode | Contracts.IMustacheNode | Contracts.INode, buffer: EdgeBuffer): void
}

interface ITagInstance {
  compile (parser: IParser, buffer: EdgeBuffer, token: Contracts.IBlockNode): void
  run ()
}

interface ITag {
  new( ): ITagInstance
}

interface IEdgeBuffer {
  indent (): void
  dedent (): void
  writeLine (text: string): void
  writeInterpol (text: string): void
  flush (): string
}

export { IParser as IParser }
export { ITag as ITag }
export { ITagInstance as ITagInstance }
export { IEdgeBuffer as IEdgeBuffer }
