"use strict";
/*
 * edge-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/
Object.defineProperty(exports, "__esModule", { value: true });
function getCallExpression(args) {
    return {
        type: 'CallExpression',
        callee: {
            type: 'MemberExpression',
            object: {
                type: 'Identifier',
                name: 'ctx',
            },
            property: {
                type: 'Identifier',
                name: 'safe',
            },
        },
        arguments: args,
    };
}
exports.getCallExpression = getCallExpression;
