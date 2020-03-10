[edge-parser](../README.md) › ["src/EdgeBuffer/index"](../modules/_src_edgebuffer_index_.md) › [EdgeBuffer](_src_edgebuffer_index_.edgebuffer.md)

# Class: EdgeBuffer

Buffer class to construct template

## Hierarchy

* **EdgeBuffer**

## Index

### Constructors

* [constructor](_src_edgebuffer_index_.edgebuffer.md#constructor)

### Accessors

* [size](_src_edgebuffer_index_.edgebuffer.md#size)

### Methods

* [flush](_src_edgebuffer_index_.edgebuffer.md#flush)
* [outputExpression](_src_edgebuffer_index_.edgebuffer.md#outputexpression)
* [outputRaw](_src_edgebuffer_index_.edgebuffer.md#outputraw)
* [wrap](_src_edgebuffer_index_.edgebuffer.md#wrap)
* [writeExpression](_src_edgebuffer_index_.edgebuffer.md#writeexpression)
* [writeStatement](_src_edgebuffer_index_.edgebuffer.md#writestatement)

## Constructors

###  constructor

\+ **new EdgeBuffer**(`filename`: string, `wrapInsideFunction`: boolean, `options?`: undefined | object): *[EdgeBuffer](_src_edgebuffer_index_.edgebuffer.md)*

**Parameters:**

Name | Type |
------ | ------ |
`filename` | string |
`wrapInsideFunction` | boolean |
`options?` | undefined &#124; object |

**Returns:** *[EdgeBuffer](_src_edgebuffer_index_.edgebuffer.md)*

## Accessors

###  size

• **get size**(): *number*

Returns the size of buffer text

**Returns:** *number*

## Methods

###  flush

▸ **flush**(): *string*

Return template as a string

**Returns:** *string*

___

###  outputExpression

▸ **outputExpression**(`text`: string, `filename`: string, `lineNumber`: number, `wrapInsideBackTicks`: boolean): *void*

Write JS expression to the output variable

**Parameters:**

Name | Type |
------ | ------ |
`text` | string |
`filename` | string |
`lineNumber` | number |
`wrapInsideBackTicks` | boolean |

**Returns:** *void*

___

###  outputRaw

▸ **outputRaw**(`text`: string): *void*

Write raw text to the output variable

**Parameters:**

Name | Type |
------ | ------ |
`text` | string |

**Returns:** *void*

___

###  wrap

▸ **wrap**(`prefix`: string, `suffix`: string): *void*

Wrap template with a custom prefix and suffix

**Parameters:**

Name | Type |
------ | ------ |
`prefix` | string |
`suffix` | string |

**Returns:** *void*

___

###  writeExpression

▸ **writeExpression**(`text`: string, `filename`: string, `lineNumber`: number): *void*

Write JS expression

**Parameters:**

Name | Type |
------ | ------ |
`text` | string |
`filename` | string |
`lineNumber` | number |

**Returns:** *void*

___

###  writeStatement

▸ **writeStatement**(`text`: string, `filename`: string, `lineNumber`: number): *void*

Write JS statement. Statements are not suffixed with a semi-colon. It
means, they can be used for writing `if/else` statements.

**Parameters:**

Name | Type |
------ | ------ |
`text` | string |
`filename` | string |
`lineNumber` | number |

**Returns:** *void*
