# Changelog

## Unreleased
* Refactoring: builders incapsulation
* INSERT ... SELECT

## 0.7.3 — 2016-08-13
### Added
- SELECT ... UNION ... SELECT

### Changed
- LIMIT by default is empty array, so query now without default values.

### Fixed
* Fixed insert and builders tests

## 0.7.2 — 2016-08-02
### Added
- Added boolean operators in `where` in addition: `!=`, `>`, `<`, `>=`, `<=`

### Changed
- MySQL connection: disconnect state fixed.

### Fixed
* Fixed `where` array mutation

## 0.7.1 — 2016-08-01
### Added
- Changelog

### Changed
- Readme changelog intro and roadmap


## 0.7.0 — 2016-07-31
### Added
- INSERT batch implementation

### Fixed
- Docs, Tests for insert, coverage tuning

### Update
- Started builders incapsulation process
