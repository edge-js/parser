"use strict";
/**
 * @module Parser
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    toObject(statement, parser) {
        statement.expressions = statement.expressions.map((expression) => parser.parseStatement(expression));
    },
    toStatement(statement, parser) {
        statement.expressions = statement.expressions.map((expression) => parser.parseStatement(expression));
        return statement;
    },
};
