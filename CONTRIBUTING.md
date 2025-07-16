# Contributing to ToxBlock

Thank you for your interest in contributing to ToxBlock! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16.0.0
- npm >= 7.0.0
- Git
- A Google Gemini API key for testing

### Development Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/sw3do/toxblock.git
   cd toxblock
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create a .env file for testing (optional)
   echo "GEMINI_API_KEY=your-api-key-here" > .env
   ```

4. **Run tests to ensure everything works**
   ```bash
   npm test
   ```

## 📋 Development Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test improvements

### Making Changes

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed

3. **Run the development checks**
   ```bash
   # Lint your code
   npm run lint
   
   # Fix linting issues
   npm run lint:fix
   
   # Format code
   npm run format
   
   # Run tests
   npm test
   
   # Run tests with coverage
   npm run test:coverage
   
   # Build the project
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

### Commit Message Convention

We follow the [Conventional Commits](https://conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add support for custom timeout configuration
fix: handle malformed JSON responses gracefully
docs: update API documentation with new examples
test: add integration tests for multilingual support
```

## 🧪 Testing Guidelines

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run only unit tests
npm test -- --testPathPattern="(?!integration)"

# Run only integration tests (requires API key)
GEMINI_API_KEY=your-key npm test -- --testPathPattern="integration"
```

### Writing Tests

- **Unit Tests**: Test individual functions and classes
- **Integration Tests**: Test the complete workflow with real API calls
- **Coverage**: Aim for >80% code coverage
- **Mocking**: Use Jest mocks for external dependencies

### Test Structure

```typescript
describe('FeatureName', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  it('should do something specific', () => {
    // Test implementation
  });
});
```

## 📝 Code Style

### TypeScript Guidelines

- Use strict TypeScript configuration
- Provide explicit return types for public methods
- Use interfaces for object types
- Prefer `const` over `let` when possible
- Use meaningful variable and function names

### Documentation

- Add JSDoc comments for all public APIs
- Include examples in JSDoc when helpful
- Update README.md for new features
- Keep inline comments concise and helpful

### Example JSDoc

```typescript
/**
 * Checks if the provided text contains profanity
 * 
 * @param text - The text to analyze
 * @returns Promise resolving to detection result
 * @throws {ToxBlockError} When analysis fails
 * 
 * @example
 * ```typescript
 * const result = await toxBlock.checkText('Hello world');
 * console.log(result.isProfane); // false
 * ```
 */
public async checkText(text: string): Promise<ToxBlockResult> {
  // Implementation
}
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Description** - Clear description of the issue
2. **Steps to Reproduce** - Minimal steps to reproduce the bug
3. **Expected Behavior** - What you expected to happen
4. **Actual Behavior** - What actually happened
5. **Environment** - Node.js version, OS, package version
6. **Code Sample** - Minimal code that reproduces the issue

## 💡 Feature Requests

For feature requests, please include:

1. **Use Case** - Why is this feature needed?
2. **Proposed Solution** - How should it work?
3. **Alternatives** - Any alternative solutions considered?
4. **Examples** - Code examples of the proposed API

## 🔍 Code Review Process

1. **Automated Checks** - All CI checks must pass
2. **Code Review** - At least one maintainer review required
3. **Testing** - New features must include tests
4. **Documentation** - Updates to docs must be included

### Review Checklist

- [ ] Code follows project style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No breaking changes (or properly documented)
- [ ] Performance impact considered
- [ ] Security implications reviewed

## 📦 Release Process

1. **Version Bump** - Update version in package.json
2. **Changelog** - Update CHANGELOG.md
3. **Tag Release** - Create GitHub release
4. **Publish** - Automated npm publish via GitHub Actions

## 🤝 Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow the code of conduct

## 📞 Getting Help

- **GitHub Issues** - For bugs and feature requests
- **GitHub Discussions** - For questions and general discussion
- **Email** - For security issues: security@toxblock.dev

## 🏆 Recognition

Contributors will be:
- Listed in the README.md
- Mentioned in release notes
- Invited to join the maintainers team (for significant contributions)

Thank you for contributing to ToxBlock! 🎉