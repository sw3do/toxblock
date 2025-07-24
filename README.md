# ToxBlock 🛡️

[![npm version](https://badge.fury.io/js/toxblock.svg)](https://badge.fury.io/js/toxblock)
[![CI/CD Pipeline](https://github.com/sw3do/toxblock/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/sw3do/toxblock/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A professional TypeScript module that uses Google's Gemini AI to detect profanity, toxic content, and inappropriate language in **all languages**. Built with enterprise-grade quality, comprehensive testing, and full TypeScript support.

## ✨ Features

- 🌍 **Multilingual Support** - Detects profanity in all languages
- 🤖 **Powered by Gemini AI** - Leverages Google's advanced AI for accurate detection
- 📝 **Full TypeScript Support** - Complete type definitions and IntelliSense
- 🧪 **Comprehensive Testing** - 100% test coverage with Jest
- 📚 **Extensive Documentation** - JSDoc comments and TypeDoc generation
- 🔒 **Enterprise Ready** - Professional error handling and logging
- ⚡ **High Performance** - Optimized for speed and efficiency
- 🛡️ **Type Safe** - Strict TypeScript configuration

## 📦 Installation

```bash
npm install toxblock
```

```bash
yarn add toxblock
```

```bash
pnpm add toxblock
```

## 🚀 Quick Start

```typescript
import { ToxBlock } from 'toxblock';

// Initialize with your Gemini API key
const toxBlock = new ToxBlock({
  apiKey: 'your-gemini-api-key'
});

// Check a single text
const result = await toxBlock.checkText('Hello, how are you?');
console.log(result.isProfane); // false
console.log(result.confidence); // 0.95

// Check multiple texts
const results = await toxBlock.checkTexts([
  'Hello world',
  'Some text to check'
]);
```

## 🔧 Configuration

```typescript
import { ToxBlock, ToxBlockConfig } from 'toxblock';

const config: ToxBlockConfig = {
  apiKey: 'your-gemini-api-key',
  model: 'gemini-pro', // Optional: default is 'gemini-pro'
  timeout: 10000, // Optional: default is 10000ms
  customPrompt: 'Your custom prompt template' // Optional
};

const toxBlock = new ToxBlock(config);
```

## 📖 API Reference

### `ToxBlock`

Main class for profanity detection.

#### Constructor

```typescript
new ToxBlock(config: ToxBlockConfig)
```

#### Methods

##### `checkText(text: string): Promise<ToxBlockResult>`

Analyzes a single text for profanity.

**Parameters:**
- `text` (string): The text to analyze

**Returns:** Promise resolving to `ToxBlockResult`

**Example:**
```typescript
const result = await toxBlock.checkText('Sample text');
if (result.isProfane) {
  console.log('Profanity detected!');
}
```

##### `checkTexts(texts: string[]): Promise<ToxBlockResult[]>`

Analyzes multiple texts in batch.

**Parameters:**
- `texts` (string[]): Array of texts to analyze

**Returns:** Promise resolving to array of `ToxBlockResult`

##### `getConfig(): { model: string; timeout: number }`

Returns current configuration.

### Types

#### `ToxBlockConfig`

```typescript
interface ToxBlockConfig {
  apiKey: string; // Required: Your Gemini API key
  model?: string; // Optional: Model name (default: 'gemini-pro')
  timeout?: number; // Optional: Timeout in ms (default: 10000)
  customPrompt?: string; // Optional: Custom prompt template
}
```

#### `ToxBlockResult`

```typescript
interface ToxBlockResult {
  isProfane: boolean; // Whether text contains profanity
  confidence: number; // Confidence score (0-1)
  language?: string; // Detected language
  details?: string; // Additional details
}
```

#### `ToxBlockError`

```typescript
class ToxBlockError extends Error {
  code: string; // Error code
  originalError?: Error; // Original error if any
}
```

## 🌍 Multilingual Examples

```typescript
// English
const result1 = await toxBlock.checkText('Hello world');

// Spanish
const result2 = await toxBlock.checkText('Hola mundo');

// French
const result3 = await toxBlock.checkText('Bonjour le monde');

// Japanese
const result4 = await toxBlock.checkText('こんにちは世界');

// Arabic
const result5 = await toxBlock.checkText('مرحبا بالعالم');

// All will return appropriate ToxBlockResult objects
```

## 🛠️ Advanced Usage

### Custom Prompt Template

```typescript
const customPrompt = `
Analyze this text for inappropriate content: "{TEXT}"
Return JSON with isProfane (boolean) and confidence (0-1).
`;

const toxBlock = new ToxBlock({
  apiKey: 'your-api-key',
  customPrompt
});
```

### Error Handling

```typescript
try {
  const result = await toxBlock.checkText('Sample text');
  console.log(result);
} catch (error) {
  if (error instanceof ToxBlockError) {
    console.error(`ToxBlock Error [${error.code}]: ${error.message}`);
    if (error.originalError) {
      console.error('Original error:', error.originalError);
    }
  }
}
```

### Batch Processing

```typescript
const texts = [
  'First message',
  'Second message',
  'Third message'
];

const results = await toxBlock.checkTexts(texts);
results.forEach((result, index) => {
  console.log(`Text ${index + 1}: ${result.isProfane ? 'FLAGGED' : 'CLEAN'}`);
});
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run integration tests (requires GEMINI_API_KEY)
GEMINI_API_KEY=your-key npm test
```

## 🔨 Development

```bash
# Clone the repository
git clone https://github.com/sw3do/toxblock.git
cd toxblock

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build the project
npm run build

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Generate documentation
npm run docs
```

## 📋 Requirements

- Node.js >= 16.0.0
- Google Gemini API key
- TypeScript >= 5.0.0 (for development)

## 🔑 Getting a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and use it in your configuration

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📞 Support

- 📧 Email: sw3doo@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/sw3do/toxblock/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/sw3do/toxblock/discussions)

## 🙏 Acknowledgments

- Google Gemini AI for providing the underlying AI capabilities
- The TypeScript community for excellent tooling
- All contributors who help improve this project

---

**Made with ❤️ by the Sw3doo**