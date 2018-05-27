// @ts-check

/**
 * edge-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const test = require('japa')
const os = require('os')
const dedent = require('dedent')

const tags = {
  if: {
    block: true,
  }
}

const Parser = require('..')

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
    } catch ({ message, loc }) {
      assert.equal(message, 'E_UNALLOWED_EXPRESSION: ClassDeclaration is not allowed')
      assert.equal(loc.line, 4)
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
    } catch ({ message, loc }) {
      assert.equal(message, 'Unexpected token ')
      assert.equal(loc.line, 5)
    }
  })
})
