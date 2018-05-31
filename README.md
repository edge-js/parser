# Edge Parser

This repo is the **parser to convert edge templates** inside a self invoked Javascript function. Later you can invoke this function by providing a context.

Example:

**Input**

```
Hello {{ username }}
```

**Output**

```
(function (ctx) {
  let out = ''
  out += 'Hello '
  out += `${ctx.escape(ctx.resolve('username'))}`
  out += '\n'
  return out
})(ctx)
```

Notice of use of `ctx` in the function body. Parser doesn't provide the implementation of `ctx`, the runtime of template engine should provide it.

## Supported Expressions

The following expressions are supported by the parser.

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

