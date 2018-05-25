interface IParser {
  parseStatement<T> (statement: T): T
  toString (): string
  toObject (): object[]
}

export { IParser as IParser }
