[edge-parser](../README.md) › ["Contracts/index"](_contracts_index_.md)

# External module: "Contracts/index"


## Index

### Interfaces

* [ParseTagDefininationContract](../interfaces/_contracts_index_.parsetagdefininationcontract.md)

### Type aliases

* [AcornLoc](_contracts_index_.md#acornloc)
* [ParserMustacheToken](_contracts_index_.md#parsermustachetoken)
* [ParserNewLineToken](_contracts_index_.md#parsernewlinetoken)
* [ParserRawToken](_contracts_index_.md#parserrawtoken)
* [ParserTagToken](_contracts_index_.md#parsertagtoken)
* [ParserToken](_contracts_index_.md#parsertoken)

## Type aliases

###  AcornLoc

Ƭ **AcornLoc**: *object*

Loc node from Acorn

#### Type declaration:

___

###  ParserMustacheToken

Ƭ **ParserMustacheToken**: *MustacheToken & object*

___

###  ParserNewLineToken

Ƭ **ParserNewLineToken**: *NewLineToken & object*

------------------------------------------------------------------------
Parser tokens allows a custom filename for each token. This is helpful
when tokens of multiple files are merged together before they are
passed to parser.
------------------------------------------------------------------------

___

###  ParserRawToken

Ƭ **ParserRawToken**: *RawToken & object*

___

###  ParserTagToken

Ƭ **ParserTagToken**: *TagToken & object*

___

###  ParserToken

Ƭ **ParserToken**: *[ParserNewLineToken](_contracts_index_.md#parsernewlinetoken) | [ParserRawToken](_contracts_index_.md#parserrawtoken) | [ParserTagToken](_contracts_index_.md#parsertagtoken) | [ParserMustacheToken](_contracts_index_.md#parsermustachetoken)*