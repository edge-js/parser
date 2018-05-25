"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    toStatement(statement, parser) {
        statement.properties = statement.properties.map((node) => {
            if (node.shorthand) {
                node.computed = true;
                node.shorthand = false;
            }
            if (node.computed === true) {
                node.key = parser.parseStatement(node.key);
            }
            node.value = parser.parseStatement(node.value);
            return node;
        });
        return statement;
    },
};
