const { ToxBlock } = require('./dist/index.js');

async function example() {
  // Initialize ToxBlock with your Gemini API key
  const toxBlock = new ToxBlock({
    apiKey: process.env.GEMINI_API_KEY || 'your-gemini-api-key-here'
  });

  console.log('🛡️ ToxBlock Example Usage\n');

  try {
    // Example 1: Check clean text
    console.log('📝 Example 1: Clean Text');
    const cleanResult = await toxBlock.checkText('Hello, how are you today?');
    console.log('Text:', 'Hello, how are you today?');
    console.log('Is Profane:', cleanResult.isProfane);
    console.log('Confidence:', cleanResult.confidence);
    console.log('Language:', cleanResult.language);
    console.log('');

    // Example 2: Check multiple texts
    console.log('📝 Example 2: Multiple Texts');
    const texts = [
      'Good morning everyone!',
      'Have a wonderful day!',
      'Programming is awesome!'
    ];
    
    const results = await toxBlock.checkTexts(texts);
    results.forEach((result, index) => {
      console.log(`Text ${index + 1}: "${texts[index]}"`);
      console.log(`  - Is Profane: ${result.isProfane}`);
      console.log(`  - Confidence: ${result.confidence}`);
      console.log(`  - Language: ${result.language || 'unknown'}`);
    });
    console.log('');

    // Example 3: Multilingual support
    console.log('🌍 Example 3: Multilingual Support');
    const multilingualTexts = [
      'Hola, ¿cómo estás?', // Spanish
      'Bonjour, comment allez-vous?', // French
      'Guten Tag, wie geht es Ihnen?', // German
      'こんにちは、元気ですか？' // Japanese
    ];

    for (const text of multilingualTexts) {
      const result = await toxBlock.checkText(text);
      console.log(`Text: "${text}"`);
      console.log(`  - Is Profane: ${result.isProfane}`);
      console.log(`  - Confidence: ${result.confidence}`);
      console.log(`  - Language: ${result.language || 'unknown'}`);
      console.log('');
    }

    // Example 4: Configuration
    console.log('⚙️ Example 4: Configuration');
    const config = toxBlock.getConfig();
    console.log('Current Configuration:');
    console.log(`  - Model: ${config.model}`);
    console.log(`  - Timeout: ${config.timeout}ms`);
    console.log('');

    console.log('✅ All examples completed successfully!');

  } catch (error) {
    console.error('❌ Error occurred:', error.message);
    if (error.code) {
      console.error('Error Code:', error.code);
    }
    
    if (error.message.includes('API key')) {
      console.log('\n💡 Tip: Make sure to set your GEMINI_API_KEY environment variable');
      console.log('   or replace "your-gemini-api-key-here" with your actual API key.');
    }
  }
}

// Run the example
if (require.main === module) {
  example().catch(console.error);
}

module.exports = { example };