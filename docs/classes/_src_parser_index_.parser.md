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

* [localVariables](_src_parser_index_.parser.md#private-localvariables)
* [options](_src_parser_index_.parser.md#options)
* [tags](_src_parser_index_.parser.md#tags)

### Methods

* [defineLocalVariable](_src_parser_index_.parser.md#definelocalvariable)
* [getLocalVariables](_src_parser_index_.parser.md#getlocalvariables)
* [parse](_src_parser_index_.parser.md#parse)
* [processEscapedMustache](_src_parser_index_.parser.md#private-processescapedmustache)
* [processEscapedTagToken](_src_parser_index_.parser.md#private-processescapedtagtoken)
* [processMustache](_src_parser_index_.parser.md#private-processmustache)
* [processToken](_src_parser_index_.parser.md#processtoken)
* [removeLocalVariable](_src_parser_index_.parser.md#removelocalvariable)
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

### `Private` localVariables

• **localVariables**: *Set‹string›* = new Set()

___

###  options

• **options**: *object*

#### Type declaration:

* **filename**: *string*

___

###  tags

• **tags**: *object*

#### Type declaration:

* \[ **key**: *string*\]: [ParserTagDefinitionContract](../interfaces/_src_contracts_index_.parsertagdefinitioncontract.md)

## Methods

###  defineLocalVariable

▸ **defineLocalVariable**(`name`: string): *this*

Define a local variable. Once it is defined, the parser will not attempt
to resolve the value from the state and instead uses the variable
name directly.

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

**Returns:** *this*

___

###  getLocalVariables

▸ **getLocalVariables**(): *string[]*

Get a reference of defined local variables

**Returns:** *string[]*

___

###  parse

▸ **parse**(`template`: string): *string*

Parse a template to an executable function

**Parameters:**

Name | Type |
------ | ------ |
`template` | string |

**Returns:** *string*

___

### `Private` processEscapedMustache

▸ **processEscapedMustache**(`token`: MustacheToken, `buffer`: [EdgeBuffer](_src_edgebuffer_index_.edgebuffer.md)): *void*

Process escaped tag token by writing it as it is. However, the children
inside a tag are still processed.

**Parameters:**

Name | Type |
------ | ------ |
`token` | MustacheToken |
`buffer` | [EdgeBuffer](_src_edgebuffer_index_.edgebuffer.md) |

**Returns:** *void*

___

### `Private` processEscapedTagToken

▸ **processEscapedTagToken**(`token`: TagToken, `buffer`: [EdgeBuffer](_src_edgebuffer_index_.edgebuffer.md)): *void*

Process escaped tag token by writing it as it is. However, the children
inside a tag are still processed.

**Parameters:**

Name | Type |
------ | ------ |
`token` | TagToken |
`buffer` | [EdgeBuffer](_src_edgebuffer_index_.edgebuffer.md) |

**Returns:** *void*

___

### `Private` processMustache

▸ **processMustache**(`__namedParameters`: object, `buffer`: [EdgeBuffer](_src_edgebuffer_index_.edgebuffer.md)): *void*

Process mustache token

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`filename` | string |
`loc` | object |
`properties` | object |
`type` | MustacheTypes |

▪ **buffer**: *[EdgeBuffer](_src_edgebuffer_index_.edgebuffer.md)*

**Returns:** *void*

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

###  removeLocalVariable

▸ **removeLocalVariable**(`name`: string): *this*

Remove earlier defined local variable

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

**Returns:** *this*

___

###  tokenize

▸ **tokenize**(`template`: string, `filename?`: undefined | string): *object | object | object | object | object[]*

Convert template to tokens

**Parameters:**

Name | Type |
------ | ------ |
`template` | string |
`filename?` | undefined &#124; string |

**Returns:** *object | object | object | object | object[]*

## Object literals

###  utils

### ▪ **utils**: *object*

Parser utilities work with the AST

###  generateAST

• **generateAST**: *[generateAST](../modules/_src_parser_generateast_.md#generateast)*

###  makeCtxCallable

• **makeCtxCallable**: *[makeCtxCallable](../modules/_src_parser_makectxcallable_.md#makectxcallable)*

###  makeStatePropertyAccessor

• **makeStatePropertyAccessor**: *[makeStatePropertyAccessor](../modules/_src_parser_makestatepropertyaccessor_.md#makestatepropertyaccessor)*

###  stringify

• **stringify**: *[stringify](../modules/_src_parser_stringify_.md#stringify)*

###  transformAst

• **transformAst**: *[transformAst](../modules/_src_parser_transformast_.md#transformast)*
