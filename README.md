# Edge Parser
> Parser to convert edge template to invokable functions

[![circleci-image]][circleci-url] [![npm-image]][npm-url] ![][typescript-image] [![license-image]][license-url]

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of contents

- [Usage](#usage)
- [Parser API](#parser-api)
    - [generateEdgeExpression(template, lexerLoc)](#generateedgeexpressiontemplate-lexerloc)
    - [generateAcornExpression(template, lexerLoc)](#generateacornexpressiontemplate-lexerloc)
    - [generateLexerTokens (template)](#generatelexertokens-template)
    - [acornToEdgeExpression(expression)](#acorntoedgeexpressionexpression)
    - [stringifyExpression(expression)](#stringifyexpressionexpression)
    - [parseTemplate(template)](#parsetemplatetemplate)
    - [processLexerToken(token, buffer)](#processlexertokentoken-buffer)
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
- [Context expectations](#context-expectations)
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

parser.parseTemplate(`Hello {{ username }}`)
```

**Output**

```js
(function (template, ctx) {
  let out = ''
  out += 'Hello '
  out += `${ctx.escape(ctx.resolve('username'))}`
  return out
})(template, ctx)
```

> Notice of use of `ctx` in the function body. Parser doesn't provide the implementation of `ctx`, the runtime of template engine should provide it.

## Parser API
Along with parsing the main template, the parser also exposes the API, that tags can use to selectively parse the content of a tag.

#### generateEdgeExpression(template, lexerLoc)
Parses a string as a Javascript expression. The output is a valid [Estree expression](https://github.com/estree/estree).

The following example returns a [BinaryExpression](https://astexplorer.net/#/gist/0b6250a81804270a026fe39e3bc33fb6/latest)

```ts
parser.generateEdgeExpression('2 + 2', {
  start: { line: 1, col: 1 },
  end: { line: 1, col: 1 },
})
```

#### generateAcornExpression(template, lexerLoc)
The method is same as `generateEdgeExpression`, instead it will not transform the expression to be compatible with the Edge runtime environment.

This method is helpful, when you want to parse a string to generate it's AST and then cherry pick nested expressions and then process them further.

The following example returns a [BinaryExpression](https://astexplorer.net/#/gist/0b6250a81804270a026fe39e3bc33fb6/latest)

```ts
parser.generateAcornExpression('2 + 2', {
  start: { line: 1, col: 1 },
  end: { line: 1, col: 1 },
})
```

#### generateLexerTokens (template)
Returns an array of [lexer tokens](https://github.com/edge-js/lexer) for the given template. The method is a shortcut to self import the lexer module and then generating tokens.

```ts
const tokens = parser.generateLexerTokens('Hello {{ username }}')
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

#### acornToEdgeExpression(expression)
Convert an acorn expression to be compatible with the Edge runtime. 

```ts
const expression = parser.generateAcornExpression('2 + 2', {
  start: { line: 1, col: 1 },
  end: { line: 1, col: 1 },
})

parser.acornToEdgeExpression(expression)
```

#### stringifyExpression(expression)
Convert edge or acorn expression back to a string. This is helpful, when you mutate some nodes inside the expression and now want a valid Javascript string out of it.

```ts
const expression = parser.generateEdgeExpression('2 + 2', {
  start: { line: 1, col: 1 },
  end: { line: 1, col: 1 },
})

expression.left.value = 3

parser.stringifyExpression(expression) // returns 3 + 2
```

#### parseTemplate(template)
Parse a template to an invokable function. This is what you will use most of the time.

```ts
parser.parseTemplate('Hello {{ username }}')
```

**Output**

```ts
(function (template, ctx) {
  let out = ''
  out += 'Hello '
  out += `${ctx.escape(ctx.resolve('username'))}`
  return out
})(template, ctx)
```

#### processLexerToken(token, buffer)
You will often find yourself using this method as a tag author, when you want to recursively process all children of your tag

```ts
const byPass = {
  block: true,
  seekable: false,
  name: 'bypass',

  compile (parser, buffer, token) {
    token.children.forEach((child) => parser.processLexerToken(child, buffer))
  }
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

The identifier is wrapped inside `ctx.resolve`. The `resolve` method job is to resolve the value.

In following statement `username` is the identifier

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

## Context expectations

Context must have following methods to work with the core parser.

```ts
class Context {
  // Resolve value for a key
  resolve(key: string): any

  // make input HTML safe
  escape (input: string): string
}
```

## API Docs
Following are the autogenerated files via Typedoc

* [API](docs/README.md)

[circleci-image]: https://img.shields.io/circleci/project/github/edge-js/parser/master.svg?style=for-the-badge&logo=circleci
[circleci-url]: https://circleci.com/gh/edge-js/parser "circleci"

[npm-image]: https://img.shields.io/npm/v/edge-parser.svg?style=for-the-badge&logo=npm
[npm-url]: https://npmjs.org/package/edge-parser "npm"

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript

[license-url]: LICENSE.md
[license-image]: https://img.shields.io/aur/license/pac.svg?style=for-the-badge
