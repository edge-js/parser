[edge-parser](../README.md) › ["src/Parser/generateAst"](_src_parser_generateast_.md)

# External module: "src/Parser/generateAst"

## Index

### Functions

* [generateAST](_src_parser_generateast_.md#generateast)

## Functions

###  generateAST

▸ **generateAST**(`jsArg`: string, `lexerLoc`: LexerLoc, `filename`: string): *any*

Generates and returns the acorn AST for a given Javascript expression. Assuming
the Javascript expression is embedded into the edge lexer token, this method
expects you to pass the token loc and the filename.

**Parameters:**

Name | Type |
------ | ------ |
`jsArg` | string |
`lexerLoc` | LexerLoc |
`filename` | string |

**Returns:** *any*
