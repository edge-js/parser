"use strict";
/**
 * @module Parser
 */
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * edge-parser
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/
const NE = require("node-exceptions");
class UnAllowedExpressionException extends NE.LogicalException {
    static invoke(expression, line, column) {
        const message = `${expression} is not allowed`;
        const error = new this(message, 500, 'E_UNALLOWED_EXPRESSION');
        error.loc = { line, column };
        return error;
    }
    constructor(message, status, code, errShLink) {
        super(message, status, code, errShLink);
    }
}
exports.UnAllowedExpressionException = UnAllowedExpressionException;
