# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup
- Core ToxBlock class implementation
- Gemini AI integration
- Comprehensive test suite
- TypeScript support with strict configuration
- ESLint and Prettier configuration
- Jest testing framework setup
- GitHub Actions CI/CD pipeline
- Professional documentation

## [1.0.0] - 2024-01-XX

### Added
- **Core Features**
  - `ToxBlock` class for profanity detection
  - `checkText()` method for single text analysis
  - `checkTexts()` method for batch processing
  - Multilingual support for all languages
  - Configurable timeout and model settings
  - Custom prompt template support

- **TypeScript Support**
  - Full TypeScript implementation
  - Comprehensive type definitions
  - Strict TypeScript configuration
  - Declaration files generation

- **Testing**
  - Unit tests with Jest
  - Integration tests with real API
  - Custom Jest matchers
  - 100% code coverage target
  - Mocked tests for CI/CD

- **Documentation**
  - Comprehensive README with examples
  - JSDoc comments for all public APIs
  - TypeDoc configuration for API docs
  - Contributing guidelines
  - Code of conduct

- **Development Tools**
  - ESLint configuration with TypeScript support
  - Prettier code formatting
  - Pre-commit hooks setup
  - GitHub Actions workflows
  - Automated npm publishing

- **Configuration**
  - Professional package.json setup
  - TypeScript configuration
  - Jest configuration
  - Git ignore rules
  - NPM ignore rules

### Security
- Secure API key handling
- Input validation and sanitization
- Error handling without information leakage
- Timeout protection against hanging requests

### Performance
- Optimized batch processing
- Configurable request timeouts
- Efficient error handling
- Minimal dependencies

---

## Version History

### [1.0.0] - Initial Release
- First stable release
- Core profanity detection functionality
- Multilingual support
- Professional TypeScript implementation
- Comprehensive testing and documentation

---

## Migration Guide

### From 0.x to 1.0.0
This is the initial release, no migration needed.

---

## Planned Features

### [1.1.0] - Enhanced Detection
- [ ] Severity levels for detected content
- [ ] Category classification (hate speech, profanity, etc.)
- [ ] Confidence threshold configuration
- [ ] Custom word filtering

### [1.2.0] - Performance Improvements
- [ ] Caching mechanism for repeated texts
- [ ] Batch optimization
- [ ] Rate limiting support
- [ ] Retry mechanism with exponential backoff

### [1.3.0] - Advanced Features
- [ ] Context-aware detection
- [ ] Custom model fine-tuning support
- [ ] Webhook integration
- [ ] Real-time streaming support

---

## Breaking Changes

None in this release.

---

## Dependencies

### Runtime Dependencies
- `@google/generative-ai`: ^0.2.1 - Google Gemini AI SDK

### Development Dependencies
- `typescript`: ^5.2.2 - TypeScript compiler
- `jest`: ^29.7.0 - Testing framework
- `eslint`: ^8.54.0 - Code linting
- `prettier`: ^3.1.0 - Code formatting
- And many more development tools...

---

## Support

For questions, bug reports, or feature requests:
- GitHub Issues: https://github.com/sw3do/toxblock/issues
- GitHub Discussions: https://github.com/sw3do/toxblock/discussions
- Email: support@toxblock.dev