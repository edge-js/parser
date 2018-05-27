"use strict";
/**
 * @module Parser
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    toStatement(statement, parser) {
        statement.test = parser.parseStatement(statement.test);
        statement.consequent = parser.parseStatement(statement.consequent);
        statement.alternate = parser.parseStatement(statement.alternate);
        return statement;
    },
};
