// @ts-check

/*
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
const { readdirSync, readFileSync, statSync } = require('fs')
const { join } = require('path')

const tags = {
  if: {
    block: true,
  }
}

const Parser = require('../build/Parser').default
const basePath = join(__dirname, '../fixtures')

test.group('Fixtures', () => {
  const dirs = readdirSync(basePath).filter((file) => {
    return statSync(join(basePath, file)).isDirectory()
  })

  dirs.forEach((dir) => {
    const dirBasePath = join(basePath, dir)

    test(dir, (assert) => {
      const template = readFileSync(join(dirBasePath, 'index.edge'), 'utf-8')
      const out = readFileSync(join(dirBasePath, 'index.js'), 'utf-8')

      const parser = new Parser(tags)
      const output = parser.parseTemplate(template)
      assert.equal(output, out)
    })
  })
})
