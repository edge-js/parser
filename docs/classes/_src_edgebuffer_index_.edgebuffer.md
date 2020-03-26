[edge-parser](../README.md) › ["src/EdgeBuffer/index"](../modules/_src_edgebuffer_index_.md) › [EdgeBuffer](_src_edgebuffer_index_.edgebuffer.md)

# Class: EdgeBuffer

Buffer class to construct template

## Hierarchy

* **EdgeBuffer**

## Index

### Constructors

* [constructor](_src_edgebuffer_index_.edgebuffer.md#constructor)

### Properties

* [buffer](_src_edgebuffer_index_.edgebuffer.md#private-buffer)
* [compiledOutput](_src_edgebuffer_index_.edgebuffer.md#private-compiledoutput)
* [currentFileName](_src_edgebuffer_index_.edgebuffer.md#private-currentfilename)
* [currentLineNumber](_src_edgebuffer_index_.edgebuffer.md#private-currentlinenumber)
* [filename](_src_edgebuffer_index_.edgebuffer.md#private-filename)
* [isolated](_src_edgebuffer_index_.edgebuffer.md#private-isolated)
* [prefix](_src_edgebuffer_index_.edgebuffer.md#private-prefix)
* [suffix](_src_edgebuffer_index_.edgebuffer.md#private-suffix)

### Accessors

* [size](_src_edgebuffer_index_.edgebuffer.md#size)

### Methods

* [flush](_src_edgebuffer_index_.edgebuffer.md#flush)
* [outputExpression](_src_edgebuffer_index_.edgebuffer.md#outputexpression)
* [outputRaw](_src_edgebuffer_index_.edgebuffer.md#outputraw)
* [setup](_src_edgebuffer_index_.edgebuffer.md#private-setup)
* [teardown](_src_edgebuffer_index_.edgebuffer.md#private-teardown)
* [updateFileName](_src_edgebuffer_index_.edgebuffer.md#private-updatefilename)
* [updateLineNumber](_src_edgebuffer_index_.edgebuffer.md#private-updatelinenumber)
* [wrap](_src_edgebuffer_index_.edgebuffer.md#wrap)
* [writeExpression](_src_edgebuffer_index_.edgebuffer.md#writeexpression)
* [writeStatement](_src_edgebuffer_index_.edgebuffer.md#writestatement)

### Object literals

* [options](_src_edgebuffer_index_.edgebuffer.md#private-options)

## Constructors

###  constructor

\+ **new EdgeBuffer**(`filename`: string, `isolated`: boolean, `options?`: undefined | object): *[EdgeBuffer](_src_edgebuffer_index_.edgebuffer.md)*

**Parameters:**

Name | Type |
------ | ------ |
`filename` | string |
`isolated` | boolean |
`options?` | undefined &#124; object |

**Returns:** *[EdgeBuffer](_src_edgebuffer_index_.edgebuffer.md)*

## Properties

### `Private` buffer

• **buffer**: *string[]* = []

Collected lines

___

### `Private` compiledOutput

• **compiledOutput**: *string | undefined*

Cached compiled output. Once this value is set, the `flush`
method will become a noop

___

### `Private` currentFileName

• **currentFileName**: *string* = this.filename

Current runtime filename

___

### `Private` currentLineNumber

• **currentLineNumber**: *number* = 1

Current runtime line number

___

### `Private` filename

• **filename**: *string*

___

### `Private` isolated

• **isolated**: *boolean*

___

### `Private` prefix

• **prefix**: *string[]* = []

___

### `Private` suffix

• **suffix**: *string[]* = []

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

### `Private` setup

▸ **setup**(`buffer`: string[]): *void*

Setup template with initial set of lines

**Parameters:**

Name | Type |
------ | ------ |
`buffer` | string[] |

**Returns:** *void*

___

### `Private` teardown

▸ **teardown**(`buffer`: string[]): *void*

Tear down template by writing final set of lines

**Parameters:**

Name | Type |
------ | ------ |
`buffer` | string[] |

**Returns:** *void*

___

### `Private` updateFileName

▸ **updateFileName**(`filename`: string): *void*

Update the filename at runtime

**Parameters:**

Name | Type |
------ | ------ |
`filename` | string |

**Returns:** *void*

___

### `Private` updateLineNumber

▸ **updateLineNumber**(`lineNumber`: number): *void*

Update the line number at runtime

**Parameters:**

Name | Type |
------ | ------ |
`lineNumber` | number |

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

## Object literals

### `Private` options

### ▪ **options**: *object*

###  fileNameVar

• **fileNameVar**: *string* = "$filename"

###  lineVar

• **lineVar**: *string* = "$lineNumber"

###  outputVar

• **outputVar**: *string* = "out"
