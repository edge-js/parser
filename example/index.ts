/*
* edge-parser
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { Parser } from '../index'

const parser = new Parser({}, { filename: 'eval.edge' })
console.log(parser.parse('Hello {{ username }}'))
