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

## Index

### Constructors

* [constructor](parser.parser-1.md#constructor)

### Properties

* [options](parser.parser-1.md#options)
* [tags](parser.parser-1.md#tags)

### Methods

* [acornToEdgeExpression](parser.parser-1.md#acorntoedgeexpression)
* [generateAcornExpression](parser.parser-1.md#generateacornexpression)
* [generateEdgeExpression](parser.parser-1.md#generateedgeexpression)
* [generateLexerTokens](parser.parser-1.md#generatelexertokens)
* [parseTemplate](parser.parser-1.md#parsetemplate)
* [processLexerToken](parser.parser-1.md#processlexertoken)
* [stringifyExpression](parser.parser-1.md#stringifyexpression)

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

● \[▪ **key**: *string*\]: [ParseTagDefininationContract](../interfaces/parser.parsetagdefininationcontract.md)

## Methods

###  acornToEdgeExpression

▸ **acornToEdgeExpression**(`expression`: any): *any*

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
`expression` | any |

**Returns:** *any*

___

###  generateAcornExpression

▸ **generateAcornExpression**(`arg`: string, `lexerLoc`: `LexerLoc`): *any*

Generates the ast of a string using Acorn. This method has handful of
conveniences over using `acorn.parse` directly.

1. It will patch the `loc` node of acorn to match the lineno within the template
   body.
2. Patches the `loc` in acorn exceptions.
3. Returns the first expression in the Node.body

**`example`** 
```
const expression = parse.generateAcornExpression('`Hello ${username}`', 1)
console.log(expression.type)
```

**Parameters:**

Name | Type |
------ | ------ |
`arg` | string |
`lexerLoc` | `LexerLoc` |

**Returns:** *any*

___

###  generateEdgeExpression

▸ **generateEdgeExpression**(`jsArg`: string, `loc`: `LexerLoc`): *any*

Parses a string by generating it's AST using `acorn` and then processing
the statement using [acornToEdgeExpression](parser.parser-1.md#acorntoedgeexpression) method.

As a **tag creator**, this is the method you will need most of the time, unless
you want todo use [generateAcornExpression](parser.parser-1.md#generateacornexpression) and [acornToEdgeExpression](parser.parser-1.md#acorntoedgeexpression) seperately
for some advanced use cases.

**Parameters:**

Name | Type |
------ | ------ |
`jsArg` | string |
`loc` | `LexerLoc` |

**Returns:** *any*

___

###  generateLexerTokens

▸ **generateLexerTokens**(`template`: string): *`Token`[]*

Generate lexer tokens for a given template string.

**`example`** 
```js
parse.generateLexerTokens('Hello {{ username }}')
```

**Parameters:**

Name | Type |
------ | ------ |
`template` | string |

**Returns:** *`Token`[]*

___

###  parseTemplate

▸ **parseTemplate**(`template`: string, `wrapAsFunction`: boolean): *string*

Parse the entire template to a top-level invokable function string.

```js
const fs = require('fs')
const template = fs.readFileSync('welcome.edge', 'utf-8')

const parser = new Parser({}, { filename: 'welcome.edge' })
const fn = parser.parseTemplate(template)

console.log(fn)
```

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`template` | string | - |
`wrapAsFunction` | boolean | false |

**Returns:** *string*

___

###  processLexerToken

▸ **processLexerToken**(`token`: `Token`, `buffer`: [EdgeBuffer](parser.edgebuffer.md)): *void*

Process a given [edge-lexer](https://github.com/edge-js/lexer) token and
write it's output to the edge buffer.

**Parameters:**

Name | Type |
------ | ------ |
`token` | `Token` |
`buffer` | [EdgeBuffer](parser.edgebuffer.md) |

**Returns:** *void*

___

###  stringifyExpression

▸ **stringifyExpression**(`expression`: any): *string*

Converts the acorn statement to it's string representation.

**`example`** 
```js
const ast = acorn.parse('`Hello ${username}`', { locations: true })
const statement = parser.stringifyExpression(ast.body[0])

console.log(parser.stringifyExpression(statement))
```

**Parameters:**

Name | Type |
------ | ------ |
`expression` | any |

**Returns:** *string*