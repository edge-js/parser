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
import { makeCallable } from '../src/parser/expression_builder/callable.js'

test.group('make escape callable function', () => {
  test('make path to a function', ({ assert }) => {
    assert.equal(
      generate(
        makeCallable('escape', [
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
        makeCallable(
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
