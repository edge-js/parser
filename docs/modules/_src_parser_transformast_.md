[edge-parser](../README.md) › ["src/Parser/transformAst"](_src_parser_transformast_.md)

# Module: "src/Parser/transformAst"

## Index

### Functions

* [transformAst](_src_parser_transformast_.md#transformast)

## Functions

###  transformAst

▸ **transformAst**(`astExpression`: any, `filename`: string, `localVariables`: Set‹string›): *any*

Transform acorn AST to Edge AST. This must always be performed before
writing it to the compiled template buffer.

**Parameters:**

Name | Type |
------ | ------ |
`astExpression` | any |
`filename` | string |
`localVariables` | Set‹string› |

**Returns:** *any*
