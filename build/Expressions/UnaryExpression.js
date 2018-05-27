"use strict";
/**
 * @module Parser
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    toStatement(statement, parser) {
        statement.argument = parser.parseStatement(statement.argument);
        return statement;
    },
};
