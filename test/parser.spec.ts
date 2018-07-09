/*
 * edge-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import * as test from 'japa'
import * as dedent from 'dedent'
import { Parser } from '../src/Parser'
import { EdgeBuffer } from '../src/EdgeBuffer'
import { IBlockNode } from 'edge-lexer/build/src/Contracts'

const tags = {
  if: class If {
    public static block = true
    public static seekable = true
    public static selfclosed = false
    public static compile (parser: Parser, buffer: EdgeBuffer, tag: IBlockNode) {
    }
  },
}

test.group('Parser', () => {
  test('report correct line number when expression is not allowed', (assert) => {
    assert.plan(2)

    const parser = new Parser(tags)
    const template = dedent`
    Hello {{ username }}

    Let's define a class {{
      class User {}
    }}
    `

    try {
      parser.parseTemplate(template)
    } catch ({ message, line }) {
      assert.equal(message, 'E_UNALLOWED_EXPRESSION: ClassDeclaration is not allowed')
      assert.equal(line, 4)
    }
  })

  test('report syntax errors with correct line number', (assert) => {
    assert.plan(2)

    const parser = new Parser(tags)
    const template = dedent`
    Hello world!

    The list of friends are {{
      users.map((user) => {
        return user username
      })
    }}
    `

    try {
      parser.parseTemplate(template)
    } catch ({ message, line }) {
      assert.equal(message, 'Unexpected token ')
      assert.equal(line, 5)
    }
  })
})
