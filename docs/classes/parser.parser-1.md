> **[edge-parser](../README.md)**

[Globals](../README.md) / [parser](../modules/parser.md) / [Parser](parser.parser-1.md) /

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

const fn = parser.parseTemplate(template)
console.log(fn)
```

## Hierarchy

* **Parser**

### Index

#### Constructors

* [constructor](parser.parser-1.md#constructor)

#### Properties

* [options](parser.parser-1.md#options)
* [tags](parser.parser-1.md#tags)

#### Methods

* [acornToEdgeExpression](parser.parser-1.md#acorntoedgeexpression)
* [generateAst](parser.parser-1.md#generateast)
* [generateTokens](parser.parser-1.md#generatetokens)
* [parseJsString](parser.parser-1.md#parsejsstring)
* [parseTemplate](parser.parser-1.md#parsetemplate)
* [patchLoc](parser.parser-1.md#patchloc)
* [processToken](parser.parser-1.md#processtoken)
* [processTokens](parser.parser-1.md#processtokens)
* [statementToString](parser.parser-1.md#statementtostring)

## Constructors

###  constructor

\+ **new Parser**(`tags`: object, `options`: object): *[Parser](parser.parser-1.md)*

**Parameters:**

Name | Type |
------ | ------ |
`tags` | object |
`options` | object |

**Returns:** *[Parser](parser.parser-1.md)*

## Properties

###  options

• **options**: *object*

#### Type declaration:

___

###  tags

• **tags**: *object*

#### Type declaration:

● \[▪ **key**: *string*\]: [ITag](../modules/parser.md#itag)

## Methods

###  acornToEdgeExpression

▸ **acornToEdgeExpression**(`statement`: any): *any*

Parses an acorn statement further to make it work with Edge eco-system. Since
Acorn is a pure Javascript parser, we need to modify it's expressions to
make them work properly with Edge.

Also this method will raise an exception, if the expression is not one of
the [whitelisted expressions](/README.md#supported-expressions).

**`example`** 
```js
const ast = acorn.parse('`Hello ${username}`', { locations: true })
console.log(parser.acornToEdgeExpression(ast.body[0]))
```

**Parameters:**

Name | Type |
------ | ------ |
`statement` | any |

**Returns:** *any*

___

###  generateAst

▸ **generateAst**(`arg`: string, `lexerLoc`: `LexerLoc`): *any*

Generates the ast of a string using Acorn. This method has handful of
conveniences over using `acorn.parse` directly.

1. It will patch the `loc` node of acorn to match the lineno within the template
   body.
2. Patches the `loc` in acorn exceptions.

**`example`** 
```
parse.generateAst('`Hello ${username}`', 1)
```

**Parameters:**

Name | Type |
------ | ------ |
`arg` | string |
`lexerLoc` | `LexerLoc` |

**Returns:** *any*

___

###  generateTokens

▸ **generateTokens**(`template`: string): *`Token`[]*

Generate lexer tokens for a given template string.

**`example`** 
```js
parse.generateTokens('Hello {{ username }}')
```

**Parameters:**

Name | Type |
------ | ------ |
`template` | string |

**Returns:** *`Token`[]*

___

###  parseJsString

▸ **parseJsString**(`jsArg`: string, `loc`: `LexerLoc`): *any*

Parses a string by generating it's AST using `acorn` and then processing
the statement using [acornToEdgeExpression](parser.parser-1.md#acorntoedgeexpression) method.

As a **tag creator**, this is the method you will need most of the time, unless
you want todo use [generateAst](parser.parser-1.md#generateast) and [acornToEdgeExpression](parser.parser-1.md#acorntoedgeexpression) seperately for some
advanced use cases.

**Parameters:**

Name | Type |
------ | ------ |
`jsArg` | string |
`loc` | `LexerLoc` |

**Returns:** *any*

___

###  parseTemplate

▸ **parseTemplate**(`template`: string): *string*

Parse the entire template to a top-level invokable function string.

```js
const fs = require('fs')
const template = fs.readFileSync('welcome.edge', 'utf-8')

const parser = new Parser({}, { filename: 'welcome.edge' })
const fn = parser.parseTemplate(template)

console.log(fn)
```

**Parameters:**

Name | Type |
------ | ------ |
`template` | string |

**Returns:** *string*

___

###  patchLoc

▸ **patchLoc**(`loc`: [IAcornLoc](../modules/parser.md#iacornloc), `lexerLoc`: `LexerLoc`): *void*

Patch the loc node of acorn. Acorn generates loc from the expression passed
to it, which means each expression passed to acorn will have lineno as `0`.

However, we want to patch it to the it's origin line in the template body.

**Parameters:**

Name | Type |
------ | ------ |
`loc` | [IAcornLoc](../modules/parser.md#iacornloc) |
`lexerLoc` | `LexerLoc` |

**Returns:** *void*

___

###  processToken

▸ **processToken**(`token`: any, `buffer`: [EdgeBuffer](parser.edgebuffer.md)): *void*

Process a given [edge-lexer](https://github.com/edge-js/lexer) token and
write it's output to the edge buffer.

**Parameters:**

Name | Type |
------ | ------ |
`token` | any |
`buffer` | [EdgeBuffer](parser.edgebuffer.md) |

**Returns:** *void*

___

###  processTokens

▸ **processTokens**(`tokens`: any, `wrapAsFunction`: boolean): *string*

Process ast tokens and write them to the buffer as string. The `wrapAsFunction`
defines, whether or not to wrap the output of template inside a scoped
function.

**`example`** 
```js
const fs = require('fs')
const template = fs.readFileSync('welcome.edge', 'utf-8')

const tokens = parser.generateTokens(template)
parser.processTokens(tokens, false)
```

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`tokens` | any | - |
`wrapAsFunction` | boolean | true |

**Returns:** *string*

___

###  statementToString

▸ **statementToString**(`statement`: any): *string*

Converts the acorn statement to it's string representation.

**`example`** 
```js
const ast = acorn.parse('`Hello ${username}`', { locations: true })
const statement = parser.acornToEdgeExpression(ast.body[0])

console.log(parser.statementToString(statement))
```

**Parameters:**

Name | Type |
------ | ------ |
`statement` | any |

**Returns:** *string*