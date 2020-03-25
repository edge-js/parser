[edge-parser](../README.md) › ["src/Contracts/index"](../modules/_src_contracts_index_.md) › [ParserTagDefinitionContract](_src_contracts_index_.parsertagdefinitioncontract.md)

# Interface: ParserTagDefinitionContract

The parser needs the `compile` method on every tag

## Hierarchy

* LexerTagDefinitionContract

  ↳ **ParserTagDefinitionContract**

## Index

### Properties

* [block](_src_contracts_index_.parsertagdefinitioncontract.md#block)
* [seekable](_src_contracts_index_.parsertagdefinitioncontract.md#seekable)

### Methods

* [compile](_src_contracts_index_.parsertagdefinitioncontract.md#compile)

## Properties

###  block

• **block**: *boolean*

*Inherited from [ParserTagDefinitionContract](_src_contracts_index_.parsertagdefinitioncontract.md).[block](_src_contracts_index_.parsertagdefinitioncontract.md#block)*

___

###  seekable

• **seekable**: *boolean*

*Inherited from [ParserTagDefinitionContract](_src_contracts_index_.parsertagdefinitioncontract.md).[seekable](_src_contracts_index_.parsertagdefinitioncontract.md#seekable)*

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
