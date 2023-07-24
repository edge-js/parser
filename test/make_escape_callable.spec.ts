/*
 * edge
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { generate } from 'astring'
import { makeEscapeCallable } from '../src/parser/make_escape_callable.js'

test.group('make escape callable function', () => {
  test('make path to a function', ({ assert }) => {
    assert.equal(
      generate(
        makeEscapeCallable('escape', [
          {
            type: 'Literal',
            value: 'foo',
          },
        ])
      ),
      'escape("foo")'
    )
  })

  test('make path to an object property', ({ assert }) => {
    assert.equal(
      generate(
        makeEscapeCallable(
          ['ctx', 'escape'],
          [
            {
              type: 'Literal',
              value: 'foo',
            },
          ]
        )
      ),
      'ctx.escape("foo")'
    )
  })
})
