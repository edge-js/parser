/*
 * edge-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'japa'
import { Stack } from '../src/Stack'

test.group('Stack', () => {
	test('define variable', (assert) => {
		const stack = new Stack()
		stack.defineVariable('username')
		stack.defineVariable('age')

		assert.isTrue(stack.has('username'))
		assert.isTrue(stack.has('age'))
		assert.deepEqual(stack.list(), ['username', 'age'])
		assert.deepEqual(stack.getState(), {
			localVariables: ['username', 'age'],
			scopes: [],
		})
	})

	test('define scope and variables inside it', (assert) => {
		const stack = new Stack()
		stack.defineVariable('username')
		stack.defineScope()
		stack.defineVariable('age')

		assert.isTrue(stack.has('username'))
		assert.isTrue(stack.has('age'))
		assert.deepEqual(stack.list(), ['age', 'username'])
		assert.deepEqual(stack.getState(), {
			localVariables: ['username'],
			scopes: [['age']],
		})
	})

	test("clear scope and it's variables", (assert) => {
		const stack = new Stack()
		stack.defineVariable('username')
		stack.defineScope()
		stack.defineVariable('age')
		stack.clearScope()

		assert.isTrue(stack.has('username'))
		assert.isFalse(stack.has('age'))
		assert.deepEqual(stack.list(), ['username'])
		assert.deepEqual(stack.getState(), {
			localVariables: ['username'],
			scopes: [],
		})
	})
})
