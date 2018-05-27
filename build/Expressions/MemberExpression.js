"use strict";
/**
 * @module Parser
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    toStatement(statement, parser) {
        statement.object = parser.parseStatement(statement.object);
        return statement;
    },
};
