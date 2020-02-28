[edge-parser](../README.md) › ["EdgeBuffer/index"](../modules/_edgebuffer_index_.md) › [EdgeBuffer](_edgebuffer_index_.edgebuffer.md)

# Class: EdgeBuffer

Buffer class to store compiled template lines and form a
callable function from it.

## Hierarchy

* **EdgeBuffer**

## Index

### Constructors

* [constructor](_edgebuffer_index_.edgebuffer.md#constructor)

### Methods

* [dedent](_edgebuffer_index_.edgebuffer.md#dedent)
* [flush](_edgebuffer_index_.edgebuffer.md#flush)
* [indent](_edgebuffer_index_.edgebuffer.md#indent)
* [wrap](_edgebuffer_index_.edgebuffer.md#wrap)
* [writeInterpol](_edgebuffer_index_.edgebuffer.md#writeinterpol)
* [writeLine](_edgebuffer_index_.edgebuffer.md#writeline)
* [writeRaw](_edgebuffer_index_.edgebuffer.md#writeraw)
* [writeStatement](_edgebuffer_index_.edgebuffer.md#writestatement)

## Constructors

###  constructor

\+ **new EdgeBuffer**(`outputVar`: string): *[EdgeBuffer](_edgebuffer_index_.edgebuffer.md)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`outputVar` | string | "out" |

**Returns:** *[EdgeBuffer](_edgebuffer_index_.edgebuffer.md)*

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
