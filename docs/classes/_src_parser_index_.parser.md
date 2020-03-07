[edge-parser](../README.md) › ["src/Parser/index"](../modules/_src_parser_index_.md) › [Parser](_src_parser_index_.parser.md)

# Class: Parser

Edge parser converts template strings to an invokable function. This module
uses [edge-lexer](https://github.com/edge-js/lexer) to generate a list
of tokens and process them against [acorn](https://npm.im/acorn).

Edge has concepts of Tags, which are not implemented by this module and must
be provided by the consumer.

```js
// Tags are optional
const tags = {}

// File name is required for better error reporting
const options = { filename: 'welcome.edge' }

const parser = new Parser(tags, options)
const template = require('fs').readFileSync('welcome.edge', 'utf-8')

const tokens = parser.parse(template)
console.log(fn)
```

## Hierarchy

* **Parser**

## Index

### Constructors

* [constructor](_src_parser_index_.parser.md#constructor)

### Properties

* [options](_src_parser_index_.parser.md#options)
* [tags](_src_parser_index_.parser.md#tags)

### Methods

* [parse](_src_parser_index_.parser.md#parse)
* [processToken](_src_parser_index_.parser.md#processtoken)
* [tokenize](_src_parser_index_.parser.md#tokenize)

### Object literals

* [utils](_src_parser_index_.parser.md#utils)

## Constructors

###  constructor

\+ **new Parser**(`tags`: object, `options`: object): *[Parser](_src_parser_index_.parser.md)*

**Parameters:**

▪ **tags**: *object*

▪ **options**: *object*

Name | Type |
------ | ------ |
`filename` | string |

**Returns:** *[Parser](_src_parser_index_.parser.md)*

## Properties

###  options

• **options**: *object*

#### Type declaration:

* **filename**: *string*

___

###  tags

• **tags**: *object*

#### Type declaration:

* \[ **key**: *string*\]: [ParserTagDefininationContract](../interfaces/_src_contracts_index_.parsertagdefininationcontract.md)

## Methods

###  parse

▸ **parse**(`template`: string): *string*

Parse a template to an executable function

**Parameters:**

Name | Type |
------ | ------ |
`template` | string |

**Returns:** *string*

___

###  processToken

▸ **processToken**(`token`: Token, `buffer`: [EdgeBuffer](_src_edgebuffer_index_.edgebuffer.md)): *void*

Process a lexer token. The output gets written to the buffer

**Parameters:**

Name | Type |
------ | ------ |
`token` | Token |
`buffer` | [EdgeBuffer](_src_edgebuffer_index_.edgebuffer.md) |

**Returns:** *void*

___

###  tokenize

▸ **tokenize**(`template`: string): *object | object | object | object[]*

Convert template to tokens

**Parameters:**

Name | Type |
------ | ------ |
`template` | string |

**Returns:** *object | object | object | object[]*

## Object literals

###  utils

### ▪ **utils**: *object*

Parser utilities work with the AST

###  generateAST

• **generateAST**: *[generateAST](../modules/_src_parser_generateast_.md#generateast)*

###  makeCallableExpression

• **makeCallableExpression**: *[makeCallableExpression](../modules/_src_parser_makecallableexpression_.md#makecallableexpression)*

###  stringify

• **stringify**: *[stringify](../modules/_src_parser_stringify_.md#stringify)*

###  transformAst

• **transformAst**: *[transformAst](../modules/_src_parser_transformast_.md#transformast)*
