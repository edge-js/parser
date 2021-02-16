import { Assert } from 'japa/build/src/Assert'

declare module 'japa/build/src/Assert' {
  interface Assert {
    stringEqual(actual: string, expected: string, message?: string): void
  }
}

Assert.use((chai) => {
  chai.assert.stringEqual = function stringEqual(val: string, exp: string, msg?: string) {
    new chai.Assertion(val.split(/\r\n|\n/), msg).to.deep.equal(exp.split(/\r\n|\n/))
  }
})
