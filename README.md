<div align="center"><img src="https://res.cloudinary.com/adonis-js/image/upload/q_100/v1600679850/edge-banner_wao6ex.png" width="600px"></div>

# Edge Parser

> Parser to convert edge template to invokable functions

[![circleci-image]][circleci-url] [![npm-image]][npm-url] ![][typescript-image] [![license-image]][license-url]

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of contents

- [Usage](#usage)
- [Parser API](#parser-api)
    - [generateAST(jsExpression, lexerLoc, filename)](#generateastjsexpression-lexerloc-filename)
    - [transformAst(acornAst, filename)](#transformastacornast-filename)
    - [tokenize (template)](#tokenize-template)
    - [stringify(expression)](#stringifyexpression)
    - [parse(template)](#parsetemplate)
    - [processToken(token, buffer)](#processtokentoken-buffer)
- [Supported Expressions](#supported-expressions)
    - [Identifier](#identifier)
    - [Literal](#literal)
    - [ArrayExpression](#arrayexpression)
    - [ObjectExpression](#objectexpression)
    - [UnaryExpression](#unaryexpression)
    - [BinaryExpression](#binaryexpression)
    - [LogicalExpression](#logicalexpression)
    - [MemberExpression](#memberexpression)
    - [ConditionalExpression](#conditionalexpression)
    - [CallExpression](#callexpression)
    - [SequenceExpression](#sequenceexpression)
    - [TemplateLiteral](#templateliteral)
    - [ArrowFunctionExpression](#arrowfunctionexpression)
    - [AwaitExpression](#awaitexpression)
    - [FunctionDeclaration](#functiondeclaration)
- [Template expectations](#template-expectations)
- [API Docs](#api-docs)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

This repo is the **parser to convert edge templates** to a self invoked Javascript function. Later you can invoke this function by providing a [context](#context-expectations).

## Usage

Install the package from npm registry as follows:

```sh
npm i edge-parser

# yarn
yarn add edge-parser
```

and then use it as follows

```js
import { Parser } from 'edge-parser'

const tagsIfAny = {}
const parser = new Parser(tagsIfAny, { filename: 'foo.edge' })

parser.parse(`Hello {{ username }}`)
```

**Output**

```js
let out = ''
let $lineNumber = 1
let $filename = 'eval.edge'
try {
  out += 'Hello '
  out += `${ctx.escape(state.username)}`
} catch (error) {
  ctx.reThrow(error, $filename, $lineNumber)
}
return out
```

> Notice of use of `ctx` in the function body. Parser doesn't provide the implementation of `ctx`, the runtime of template engine should provide it.

## Parser API

Along with parsing the main template, the parser also exposes the API, that tags can use to selectively parse the content of a tag.

#### generateAST(jsExpression, lexerLoc, filename)

Parses a string as a Javascript expression. The output is a valid [Estree expression](https://github.com/estree/estree)

The following example returns a [BinaryExpression](https://astexplorer.net/#/gist/0b6250a81804270a026fe39e3bc33fb6/latest)

```ts
const loc = {
  start: { line: 1, col: 1 },
  end: { line: 1, col: 1 },
}
const filename = 'eval.edge'

parser.utils.generateAST('2 + 2', loc, filename)
```

#### transformAst(acornAst, filename)

Transform the acorn AST and make it compatible with Edge runtime. This method mutates the inner nodes of the original AST.

```ts
const loc = {
  start: { line: 1, col: 1 },
  end: { line: 1, col: 1 },
}
const filename = 'eval.edge'

parser.utils.transformAst(parser.utils.generateAST('2 + 2', loc, filename), filename)
```

#### tokenize (template)

Returns an array of [lexer tokens](https://github.com/edge-js/lexer) for the given template. The method is a shortcut to self import the lexer module and then generating tokens.

```ts
const tokens = parser.tokenize('Hello {{ username }}')
```

**Output**

```json
[
  {
    "type": "raw",
    "line": 1,
    "value": "Hello "
  },
  {
    "type": "mustache",
    "filename": "eval.edge",
    "loc": {
      "start": {
        "line": 1,
        "col": 8
      },
      "end": {
        "line": 1,
        "col": 20
      }
    },
    "properties": {
      "jsArg": " username "
    }
  }
]
```

#### stringify(expression)

Convert edge or acorn expression back to a string. This is helpful, when you mutate some nodes inside the expression and now want a valid Javascript string out of it.

```ts
const expression = parser.utils.generateAST(
  '2 + 2',
  {
    start: { line: 1, col: 1 },
    end: { line: 1, col: 1 },
  },
  'eval.edge'
)

expression.left.value = 3
parser.utils.stringify(expression) // returns 3 + 2
```

#### parse(template)

Parse a template to an `IIFE`. This is what you will use most of the time.

```ts
parser.parse('Hello {{ username }}')
```

**Output**

```js
let out = ''
let $lineNumber = 1
let $filename = 'eval.edge'
try {
  out += 'Hello '
  out += `${ctx.escape(state.username)}`
} catch (error) {
  ctx.reThrow(error, $filename, $lineNumber)
}
return out
```

#### processToken(token, buffer)

You will often find yourself using this method as a tag author, when you want to recursively process all children of your tag

```ts
const byPass = {
  block: true,
  seekable: false,
  name: 'bypass',

  compile(parser, buffer, token) {
    token.children.forEach((child) => parser.processToken(child, buffer))
  },
}
```

and then use it as

```edge
@bypass
  Hello {{ username }}
@endbypass
```

## Supported Expressions

The following expressions are supported by the parser. Can you also access the list of supported expressions as

```js
import { expressions } from 'edge-parser'
```

#### Identifier

The identifier are prefixed with `state.` In following statement `username` is the identifier

```
Hello {{ username }}
```

#### Literal

A string literal

```
Hello {{ 'Guest' }}
```

#### ArrayExpression

The `[1, 2, 3, 4]` is an array expression.

```
Evens are {{
  [1, 2, 3, 4].filter((num) => num % 2 === 0)
}}
```

#### ObjectExpression

The `{ username: 'virk' }` is an Object expression

```
{{ toJSON({ username: 'virk' })  }}
```

#### UnaryExpression

Following are examples of `UnaryExpression`.

```
{{ typeof(username) }}

{{ !!username }}
```

#### BinaryExpression

Here `{{ 2 + 2 }}` is the binary expression

```
{{ 2 + 2 }} = 4
```

#### LogicalExpression

Following is the example of `LogicalExpression`.

```
{{ username || admin.username }}
```

#### MemberExpression

```
{{ username.toUpperCase() }}
```

#### ConditionalExpression

```
{{ username ? username : 'Guest' }}
```

#### CallExpression

```
{{ upper(username) }}
```

#### SequenceExpression

Sequence is not supported in mustache blocks and instead used inside tags. For example:

Everything inside `()` is a sequence expression.

```
@component('button', text = 'Submit', type = 'Primary')
```

#### TemplateLiteral

```
{{ Hello `${username}` }}
```

#### ArrowFunctionExpression

```
{{
  users.map((user) => {
    return user.username
  })
}}
```

#### AwaitExpression

```
{{ await foo() }}
```

#### FunctionDeclaration

```
{{ function foo () {} }}
```

## Template expectations

You must define a context object with `escape` and `reThrow` methods when executing the parser compiled function

```ts
const ctx = {
  escape(value) {
    if (typeof value === 'string') {
      return escapedValue
    }

    return value
  },

  reThrow(error, fileName, lineNumber) {},
}
```

## API Docs

Following are the auto generated files via Type doc

- [API](docs/README.md)

[circleci-image]: https://img.shields.io/circleci/project/github/edge-js/parser/master.svg?style=for-the-badge&logo=circleci
[circleci-url]: https://circleci.com/gh/edge-js/parser 'circleci'
[npm-image]: https://img.shields.io/npm/v/edge-parser.svg?style=for-the-badge&logo=npm
[npm-url]: https://npmjs.org/package/edge-parser 'npm'
[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[license-url]: LICENSE.md
[license-image]: https://img.shields.io/github/license/edge-js/lexer?style=for-the-badge
