[edge-parser](../README.md) › ["Contracts/index"](../modules/_contracts_index_.md) › [ParseTagDefininationContract](_contracts_index_.parsetagdefininationcontract.md)

# Interface: ParseTagDefininationContract


The parser needs the `compile` method on every tag

## Hierarchy

* LexerTagDefinitionContract

  ↳ **ParseTagDefininationContract**

## Index

### Properties

* [block](_contracts_index_.parsetagdefininationcontract.md#block)
* [seekable](_contracts_index_.parsetagdefininationcontract.md#seekable)

### Methods

* [compile](_contracts_index_.parsetagdefininationcontract.md#compile)

## Properties

###  block

• **block**: *boolean*

*Inherited from void*

___

###  seekable

• **seekable**: *boolean*

*Inherited from void*

## Methods

###  compile

▸ **compile**(`parser`: [Parser](../classes/_parser_index_.parser.md), `buffer`: [EdgeBuffer](../classes/_edgebuffer_index_.edgebuffer.md), `token`: TagToken): *void*

**Parameters:**

Name | Type |
------ | ------ |
`parser` | [Parser](../classes/_parser_index_.parser.md) |
`buffer` | [EdgeBuffer](../classes/_edgebuffer_index_.edgebuffer.md) |
`token` | TagToken |

**Returns:** *void*