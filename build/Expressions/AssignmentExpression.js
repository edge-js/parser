"use strict";
/**
 * @module Parser
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    toStatement(statement, parser) {
        statement.right = parser.parseStatement(statement.right);
        return statement;
    },
};
