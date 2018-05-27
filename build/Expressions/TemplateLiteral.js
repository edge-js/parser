"use strict";
/**
 * @module Parser
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    toStatement(statement, parser) {
        statement.expressions = statement.expressions.map((expression) => {
            return parser.parseStatement(expression);
        });
        return statement;
    },
};
