<a name="2.0.3"></a>

## [2.0.3](https://github.com/edge-js/parser/compare/v2.0.2...v2.0.3) (2018-11-09)

<a name="2.0.2"></a>

## [2.0.2](https://github.com/edge-js/parser/compare/v2.0.0...v2.0.2) (2018-11-09)

### Bug Fixes

- **parser:** report correct column number ([98b06b5](https://github.com/edge-js/parser/commit/98b06b5))

<a name="2.0.1"></a>

## [2.0.1](https://github.com/edge-js/parser/compare/v2.0.0...v2.0.1) (2018-11-09)

### Bug Fixes

- **parser:** report correct column number ([98b06b5](https://github.com/edge-js/parser/commit/98b06b5))

<a name="2.0.0"></a>

# [2.0.0](https://github.com/edge-js/parser/compare/v1.0.16...v2.0.0) (2018-11-05)

<a name="1.0.16"></a>

## [1.0.16](https://github.com/poppinss/edge-parser/compare/v1.0.15...v1.0.16) (2018-07-12)

### Features

- **parser:** expose parseTokens method and make options public ([3a30ff4](https://github.com/poppinss/edge-parser/commit/3a30ff4))

<a name="1.0.15"></a>

## [1.0.15](https://github.com/poppinss/edge-parser/compare/v1.0.14...v1.0.15) (2018-07-10)

### Bug Fixes

- **parser:** patch loc for all the tokens of acorn ([1c4c24e](https://github.com/poppinss/edge-parser/commit/1c4c24e))

<a name="1.0.14"></a>

## [1.0.14](https://github.com/poppinss/edge-parser/compare/v1.0.13...v1.0.14) (2018-07-10)

<a name="1.0.13"></a>

## [1.0.13](https://github.com/poppinss/edge-parser/compare/v1.0.12...v1.0.13) (2018-07-09)

### Features

- **parser:** expose generateTokens method to generate lexer tokens ([9c5073f](https://github.com/poppinss/edge-parser/commit/9c5073f))

<a name="1.0.12"></a>

## [1.0.12](https://github.com/poppinss/edge-parser/compare/v1.0.11...v1.0.12) (2018-07-09)

<a name="1.0.11"></a>

## [1.0.11](https://github.com/poppinss/edge-parser/compare/v1.0.10...v1.0.11) (2018-07-07)

<a name="1.0.10"></a>

## [1.0.10](https://github.com/poppinss/edge-parser/compare/v1.0.9...v1.0.10) (2018-07-07)

### Features

- **buffer:** add support for wrapping statements ([5242f7d](https://github.com/poppinss/edge-parser/commit/5242f7d))

<a name="1.0.9"></a>

## [1.0.9](https://github.com/poppinss/edge-parser/compare/v1.0.8...v1.0.9) (2018-07-05)

### Bug Fixes

- **objectexpression:** turn off shorthand objects ([c43444f](https://github.com/poppinss/edge-parser/commit/c43444f))

### Features

- **AssignmentExpression:** add support ([c920387](https://github.com/poppinss/edge-parser/commit/c920387))

<a name="1.0.8"></a>

## [1.0.8](https://github.com/poppinss/edge-parser/compare/v1.0.7...v1.0.8) (2018-07-04)

<a name="1.0.7"></a>

## [1.0.7](https://github.com/poppinss/edge-parser/compare/v1.0.6...v1.0.7) (2018-07-04)

### Code Refactoring

- **parser:** patch the loc node of ast in place ([4314ded](https://github.com/poppinss/edge-parser/commit/4314ded))

### BREAKING CHANGES

- **parser:** removed patchNodeLine

<a name="1.0.5"></a>

## [1.0.5](https://github.com/poppinss/edge-parser/compare/v1.0.4...v1.0.5) (2018-07-02)

### Features

- **buffer:** add support to return unwrapped lines ([da27c99](https://github.com/poppinss/edge-parser/commit/da27c99))
- **parser:** add support for unwrapped templates ([853ba21](https://github.com/poppinss/edge-parser/commit/853ba21))

<a name="1.0.3"></a>

## [1.0.3](https://github.com/poppinss/edge-parser/compare/v1.0.2...v1.0.3) (2018-07-01)

### Bug Fixes

- **newline:** use os.EOL convert \n to new lines ([4fa76a9](https://github.com/poppinss/edge-parser/commit/4fa76a9))

<a name="1.0.2"></a>

## [1.0.2](https://github.com/poppinss/edge-parser/compare/v1.0.0...v1.0.2) (2018-06-01)

### Bug Fixes

- **buffer:** escape quotes inside raw strings ([cd659d0](https://github.com/poppinss/edge-parser/commit/cd659d0))

<a name="1.0.1"></a>

## [1.0.1](https://github.com/poppinss/edge-parser/compare/v1.0.0...v1.0.1) (2018-06-01)

<a name="1.0.0"></a>

# 1.0.0 (2018-05-31)

### Bug Fixes

- **buffer:** append new line with writeLine statement ([d4852f5](https://github.com/poppinss/edge-parser/commit/d4852f5))
- **parser:** export must use es6 export syntax ([b6a1e61](https://github.com/poppinss/edge-parser/commit/b6a1e61))
- **parser:** wrap mustache nodes inside escape call ([432cfed](https://github.com/poppinss/edge-parser/commit/432cfed))

### Features

- cover all allowed expression ([5a415d8](https://github.com/poppinss/edge-parser/commit/5a415d8))
- initial commit ([971bbd9](https://github.com/poppinss/edge-parser/commit/971bbd9))
- **buffer:** add writeStatement method ([be705fd](https://github.com/poppinss/edge-parser/commit/be705fd))
- **buffer:** expose edge buffer interface ([b01d34b](https://github.com/poppinss/edge-parser/commit/b01d34b))
- **errors:** patch lineno in errors ([ca7e93f](https://github.com/poppinss/edge-parser/commit/ca7e93f))
- **parser:** handle block tokens too ([08a4ded](https://github.com/poppinss/edge-parser/commit/08a4ded))
- **parser:** parse eacaped and safe mustache tokens ([2dafb5e](https://github.com/poppinss/edge-parser/commit/2dafb5e))
