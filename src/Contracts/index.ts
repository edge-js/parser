/**
 * @module Parser
 */

interface IParser {
  parseStatement<T> (statement: T): T
  parseTemplate (template: string): string
  statementToString (statement: any): string
}

export { IParser as IParser }
