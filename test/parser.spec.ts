/*
 * edge-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import './assert-extend'

import test from 'japa'
import { EOL } from 'os'
import { parse as acornParse } from 'acorn'
import dedent from 'dedent-js'

import { Parser } from '../src/Parser'
import { MustacheToken, TagToken } from 'edge-lexer/build/src/Contracts'

function normalizeNewLines (value) {
  return value.replace(/out\s\+=\s'\\n'/, `out += ${EOL === '\n' ? `'\\n'` : `'\\r\\n'`}`)
}

const tags = {
  if: class If {
    public static block = true
    public static seekable = true
    public static selfclosed = false
    public static compile () {
    }
  },
}

test.group('Parser', () => {
  test('report correct line number when expression is not allowed', (assert) => {
    assert.plan(2)

    const parser = new Parser(tags, { filename: 'foo.edge' })
    const template = dedent`
    Hello {{ username }}

    Let's define a class {{
      class User {}
    }}
    `

    try {
      parser.parseTemplate(template)
    } catch ({ message, stack }) {
      assert.equal(message, 'ClassDeclaration is not supported')
      assert.equal(stack.split('\n')[1], '    at (foo.edge:4:2)')
    }
  })

  test('report syntax errors with correct line number', (assert) => {
    assert.plan(2)

    const parser = new Parser(tags, { filename: 'foo.edge' })
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
    } catch ({ message, stack }) {
      assert.equal(message, 'Unexpected token ')
      assert.equal(stack.split('\n')[1], '    at (foo.edge:5:16)')
    }
  })

  test('patch line number of all the tokens inside the top level expressions', (assert) => {
    const parser = new Parser(tags, { filename: 'foo.edge' })
    const template = dedent`
    Hello world!

    The list of friends are {{
      users.map((user) => {
        return user.username
      })
    }}
    `

    const tokens = parser.generateLexerTokens(template)
    const mustacheToken = tokens.find((token) => token.type === 'mustache')
    const mustacheExpression = parser.generateEdgeExpression(
      (mustacheToken as MustacheToken).properties.jsArg,
      (mustacheToken as MustacheToken).loc,
    )

    assert.equal(mustacheExpression.loc.start.line, 4)
    assert.equal(mustacheExpression.callee.loc.start.line, 4)
    assert.equal(mustacheExpression.arguments[0].loc.start.line, 4)
    assert.equal(mustacheExpression.arguments[0].body.body[0].loc.start.line, 5)
    assert.equal(mustacheExpression.arguments[0].body.body[0].argument.loc.start.line, 5)
    assert.equal(mustacheExpression.arguments[0].body.body[0].argument.object.loc.start.line, 5)
    assert.equal(mustacheExpression.arguments[0].body.body[0].argument.property.loc.start.line, 5)
  })

  test('parse acorn statement to edge statement', (assert) => {
    const parser = new Parser(tags, { filename: 'foo.edge' })
    const ast = acornParse('`Hello ${username}`', { locations: true }) as any

    const parsedStatement = parser.acornToEdgeExpression(ast.body[0])

    assert.equal(parsedStatement.type, 'TemplateLiteral')
  })

  test('convert acorn expression to its string representation', (assert) => {
    const parser = new Parser(tags, { filename: 'foo.edge' })
    const ast = acornParse('`Hello ${username}`', { locations: true }) as any

    const parsedStatement = parser.acornToEdgeExpression(ast.body[0])

    assert.equal(parser.stringifyExpression(parsedStatement), '\`Hello ${ctx.resolve(\'username\')}\`')
  })

  test('parse template string to invokable function string', (assert) => {
    const parser = new Parser(tags, { filename: 'foo.edge' })
    const fn = parser.parseTemplate('Hello {{ username }}')

    assert.stringEqual(fn, normalizeNewLines(dedent`(function (template, ctx) {
      let out = '';
      out += 'Hello ';
      out += \`\${ctx.escape(ctx.resolve('username'))}\`;
      return out;
    })(template, ctx)`))
  })

  test('parse multiline template string to invokable function string', (assert) => {
    const parser = new Parser(tags, { filename: 'foo.edge' })
    const fn = parser.parseTemplate(dedent `He'llo
      {{ username }}
    `)

    assert.stringEqual(fn, normalizeNewLines(dedent`(function (template, ctx) {
      let out = '';
      out += 'He\\'llo';
      out += '\\n';
      out += \`\${ctx.escape(ctx.resolve('username'))}\`;
      return out;
    })(template, ctx)`))
  })

  test('process parser tokens and do not wrap them inside scoped function', (assert) => {
    const parser = new Parser(tags, { filename: 'foo.edge' })
    const output = parser.parseTemplate('Hello {{ username }}', false)

    assert.stringEqual(output, normalizeNewLines(dedent`\n
    ${'  '}let out = '';
    ${'  '}out += 'Hello ';
    ${'  '}out += \`\${ctx.escape(ctx.resolve('username'))}\`;
    ${'  '}return out;`))
  })

  test('pass tag details to tag implementation when exists', (assert) => {
    assert.plan(2)

    const customTags = {
      if: class If {
        public static block = true
        public static seekable = true
        public static selfclosed = false
        public static compile (_parser, _buffer, token: TagToken) {
          assert.equal(token.properties.jsArg, 'username')
          assert.equal(token.properties.name, 'if')
        }
      },
    }

    const parser = new Parser(customTags, { filename: 'foo.edge' })
    parser.parseTemplate(dedent`
    @if(username)
    @endif
    `)
  })

  test('report correct columns in errors inside mustache statement', (assert) => {
    assert.plan(2)

    const parser = new Parser(tags, { filename: 'foo.edge' })
    try {
      parser.parseTemplate(dedent`
        Hello {{ user\ name }}
      `)
    } catch ({ message, line, col }) {
      assert.equal(line, 1)
      assert.equal(col, 14)
    }
  })

  test('report correct columns in errors inside safe mustache statement', (assert) => {
    assert.plan(2)

    const parser = new Parser(tags, { filename: 'foo.edge' })
    try {
      parser.parseTemplate(dedent`
        Hello {{{ user\ name }}}
      `)
    } catch ({ message, line, col }) {
      assert.equal(line, 1)
      assert.equal(col, 15)
    }
  })

  test('report correct columns in errors in multiline mustache', (assert) => {
    assert.plan(2)

    const parser = new Parser(tags, { filename: 'foo.edge' })
    try {
      parser.parseTemplate(dedent`
        Hello {{
          user username
        }}
      `)
    } catch ({ message, line, col }) {
      assert.equal(line, 2)
      assert.equal(col, 7)
    }
  })
})
