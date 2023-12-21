# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Changes `FetchHandler` to be compatible with the `fetch` API.
### Fixed
- Handle errors in the `aws-lambda` `Handler` created by `toProxyHandler`
### Added
- Support for Express via `addRoute`

## [0.3.1] - 2023-11-27
### Fixed
- Allow responses without a content type (for example redirects).

## [0.3.0] - 2023-11-17
### Added
- Support for `application/x-www-form-urlencoded`
- Export `HttpError` class

## [0.2.1] - 2023-11-16
### Added
- Better support for error responses with `unwrapError`.

## [0.2.0] - 2023-11-16
### Changed
- Added a `validate` method for validating responses.

## [0.1.0] - 2023-11-16
### Changed
- Renamed to `@oselvar/openapi-validator`.
- Refactored the code to use a `Validator` class to validate objects independently.
- Thrown errors have to be handled explicitly.
- Use `Response.json()` to create a JSON response.

## [0.0.4] - 2023-11-13
### Fixed
- Try to fix npm release

## [0.0.3] - 2023-11-13
### Fixed
- Try to fix npm release

## [0.0.2] - 2023-11-13
### Fixed
- Try to fix npm release

## [0.0.1] - 2023-11-13
### Added
- First release

## [0.0.0] - 2023-11-13
### Added
- First implementation

[Unreleased]: https://github.com/rcmachado/changelog/compare/v0.3.1...HEAD
[0.3.1]: https://github.com/rcmachado/changelog/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/rcmachado/changelog/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/rcmachado/changelog/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/rcmachado/changelog/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/rcmachado/changelog/compare/v0.0.4...v0.1.0
[0.0.4]: https://github.com/rcmachado/changelog/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/rcmachado/changelog/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/rcmachado/changelog/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/rcmachado/changelog/compare/v0.0.0...v0.0.1
[0.0.0]: https://github.com/rcmachado/changelog/compare/dc9169d6918a38300db35e2e01d372e1c4f4d7d9...v0.0.0
