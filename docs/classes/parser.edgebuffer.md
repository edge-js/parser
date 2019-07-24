> **[edge-parser](../README.md)**

[Globals](../README.md) / [parser](../modules/parser.md) / [EdgeBuffer](parser.edgebuffer.md) /

# Class: EdgeBuffer

Buffer class to store compiled template lines and form a
callable function from it.

## Hierarchy

* **EdgeBuffer**

## Index

### Constructors

* [constructor](parser.edgebuffer.md#constructor)

### Methods

* [dedent](parser.edgebuffer.md#dedent)
* [flush](parser.edgebuffer.md#flush)
* [indent](parser.edgebuffer.md#indent)
* [wrap](parser.edgebuffer.md#wrap)
* [writeInterpol](parser.edgebuffer.md#writeinterpol)
* [writeLine](parser.edgebuffer.md#writeline)
* [writeRaw](parser.edgebuffer.md#writeraw)
* [writeStatement](parser.edgebuffer.md#writestatement)

## Constructors

###  constructor

\+ **new EdgeBuffer**(`outputVar`: string): *[EdgeBuffer](parser.edgebuffer.md)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`outputVar` | string | "out" |

**Returns:** *[EdgeBuffer](parser.edgebuffer.md)*

## Methods

###  dedent

▸ **dedent**(): *void*

Decrease output by 2 spaces

**Returns:** *void*

___

###  flush

▸ **flush**(`wrapAsFunction`: boolean): *string*

Return all the lines from the buffer wrapped inside a self
invoked function.

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`wrapAsFunction` | boolean | true |

**Returns:** *string*

___

###  indent

▸ **indent**(): *void*

Indent output by 2 spaces

**Returns:** *void*

___

###  wrap

▸ **wrap**(`prefix`: string, `suffix`: string): *void*

Wrap the final output with a suffix and prefix

**Parameters:**

Name | Type |
------ | ------ |
`prefix` | string |
`suffix` | string |

**Returns:** *void*

___

###  writeInterpol

▸ **writeInterpol**(`text`: string): *void*

Write string as interpolation to the output

**Parameters:**

Name | Type |
------ | ------ |
`text` | string |

**Returns:** *void*

___

###  writeLine

▸ **writeLine**(`text`: string): *void*

Write a new line to the output

**Parameters:**

Name | Type |
------ | ------ |
`text` | string |

**Returns:** *void*

___

###  writeRaw

▸ **writeRaw**(`text`: string): *void*

Writes raw text to the output

**Parameters:**

Name | Type |
------ | ------ |
`text` | string |

**Returns:** *void*

___

###  writeStatement

▸ **writeStatement**(`text`: string): *void*

Write a new statement. Statements are not written to the
output. `if (something) {` is a statement.

**Parameters:**

Name | Type |
------ | ------ |
`text` | string |

**Returns:** *void*