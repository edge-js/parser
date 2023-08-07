# edge-parser
> Parser to convert edge templates to invokable functions

[![gh-workflow-image]][gh-workflow-url] [![npm-image]][npm-url] ![][typescript-image] [![license-image]][license-url]

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

## Table of contents

- [Table of contents](#table-of-contents)
- [Usage](#usage)
- [Parser API](#parser-api)
  - [generateAST(jsExpression, lexerLoc, filename)](#generateastjsexpression-lexerloc-filename)
  - [transformAst(acornAst, filename)](#transformastacornast-filename)
  - [tokenize (template, options: { filename })](#tokenize-template-options--filename-)
  - [stringify(expression)](#stringifyexpression)
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
  - [BlockStatement](#blockstatement)
  - [ChainExpression](#chainexpression)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

This repo is the **parser to convert edge templates** to a self invoked Javascript function.

## Usage

Install the package from npm registry as follows:

```sh
npm i edge-parser

# yarn
yarn add edge-parser
```

and then use it as follows

```js
import { Parser, EdgeBuffer, Stack } from 'edge-parser'

const filename = 'eval.edge'

const parser = new Parser({}, new Stack(), {
  statePropertyName: 'state',
  escapeCallPath: 'escape',
  toAttributesCallPath: 'toAttributes',
})

const buffer = new EdgeBuffer(filename, {
  outputVar: 'out',
  rethrowCallPath: 'reThrow'
})

parser
  .tokenize('Hello {{ username }}', { filename })
  .forEach((token) => parser.processToken(token, buffer))

const output = buffer.flush()
console.log(output)
```

- `filename` is required to ensure that exceptions stack traces point back to the correct filename.
- `statePropertyName` is the variable name from which the values should be accessed. For example: `{{ username }}` will be compiled as `state.username`. Leave it to empty, if state is not nested inside an object.
- `escapeCallPath` Reference to the `escape` method for escaping interpolation values. For example: `{{ username }}` will be compiled as `escape(state.username)`. The `escape` method should escape only strings and return the other data types as it is.
- `toAttributesCallPath`: Reference to the function that will convert an object to HTML attributes.
- `outputVar` is the variable name that holds the output of the compiled template.
- `rethrowCallPath` Reference to the `reThrow` method to raise the template exceptions with the current `$filename` and `$lineNumber`. Check the following compiled output to see how this function is called.

**Compiled output**

```js
let out = ''
let $lineNumber = 1
let $filename = 'eval.edge'
try {
  out += 'Hello '
  out += `${escape(state.username)}`
} catch (error) {
  reThrow(error, $filename, $lineNumber)
}
return out
```

You can wrap the compiled output inside a function and invoke it as follows

```ts
/**
 * Convert string to a function
 */
const fn = new Function('state, escape, reThrow', output)

/**
 * Template state
 */
const state = { username: 'virk' }

/**
 * Escape function
 */
function escape(value: any) {
  return value
}

/**
 * Rethrow function
 */
function reThrow(error: Error) {
  throw error
}

console.log(fn(state, escape, reThrow))
```

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

#### tokenize (template, options: { filename })

Returns an array of [lexer tokens](https://github.com/edge-js/lexer) for the given template. The method is a shortcut to self import the lexer module and then generating tokens.

```ts
const tokens = parser.tokenize('Hello {{ username }}', {
  filename: 'eval.edge',
})
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

#### BlockStatement

Here the `map` callback is the block statement

```
{{
  users.map(() => {})
}}
```

#### ChainExpression

Support for optional chaining

```
{{ user?.username }}
```

#### NewExpression

```js
{{ new User() }}
```

#### ReturnStatement
In the following example `return` keyword is a return statement

```js
users.map((user) => {
  return user.username
})
```

#### ThisExpression
Support for the this keyword

```js
{{ this.state }}
```

#### SpreadElement
Support for the spread element

```js
{{ [...users] }}
```

[gh-workflow-image]: https://img.shields.io/github/actions/workflow/status/edge-js/parser/checks.yml?style=for-the-badge
[gh-workflow-url]: https://github.com/edge-js/parser/actions/workflows/checks.yml "Github action"

[npm-image]: https://img.shields.io/npm/v/edge-parser.svg?style=for-the-badge&logo=npm
[npm-url]: https://npmjs.org/package/edge-parser 'npm'

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript

[license-url]: LICENSE.md
[license-image]: https://img.shields.io/github/license/edge-js/lexer?style=for-the-badge
