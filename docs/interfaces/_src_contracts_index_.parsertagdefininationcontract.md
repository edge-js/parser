[edge-parser](../README.md) › ["src/Contracts/index"](../modules/_src_contracts_index_.md) › [ParserTagDefininationContract](_src_contracts_index_.parsertagdefininationcontract.md)

# Interface: ParserTagDefininationContract

The parser needs the `compile` method on every tag

## Hierarchy

* LexerTagDefinitionContract

  ↳ **ParserTagDefininationContract**

## Index

### Properties

* [block](_src_contracts_index_.parsertagdefininationcontract.md#block)
* [seekable](_src_contracts_index_.parsertagdefininationcontract.md#seekable)

### Methods

* [compile](_src_contracts_index_.parsertagdefininationcontract.md#compile)

## Properties

###  block

• **block**: *boolean*

*Inherited from [ParserTagDefininationContract](_src_contracts_index_.parsertagdefininationcontract.md).[block](_src_contracts_index_.parsertagdefininationcontract.md#block)*

___

###  seekable

• **seekable**: *boolean*

*Inherited from [ParserTagDefininationContract](_src_contracts_index_.parsertagdefininationcontract.md).[seekable](_src_contracts_index_.parsertagdefininationcontract.md#seekable)*

## Methods

###  compile

▸ **compile**(`parser`: [Parser](../classes/_src_parser_index_.parser.md), `buffer`: [EdgeBuffer](../classes/_src_edgebuffer_index_.edgebuffer.md), `token`: TagToken): *void*

**Parameters:**

Name | Type |
------ | ------ |
`parser` | [Parser](../classes/_src_parser_index_.parser.md) |
`buffer` | [EdgeBuffer](../classes/_src_edgebuffer_index_.edgebuffer.md) |
`token` | TagToken |

**Returns:** *void*
