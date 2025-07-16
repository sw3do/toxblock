/**
 * @fileoverview ToxBlock - A professional TypeScript module for detecting profanity and toxic content using Gemini AI
 * @version 1.0.0
 * @author sw3do
 * @license MIT
 */

import { GoogleGenAI } from '@google/genai';

/**
 * Configuration options for ToxBlock
 * 
 * @interface ToxBlockConfig
 * @example
 * ```typescript
 * const config: ToxBlockConfig = {
 *   apiKey: 'your-gemini-api-key',
 *   model: 'gemini-2.0-flash-001',
 *   timeout: 15000
 * };
 * ```
 */
export interface ToxBlockConfig {
  /** Google Gemini API key - required for authentication */
  apiKey: string;
  /** Model name to use (default: 'gemini-2.0-flash-001') */
  model?: string;
  /** Custom prompt template for profanity detection - use {TEXT} placeholder */
  customPrompt?: string;
  /** Timeout for API requests in milliseconds (default: 10000) */
  timeout?: number;
}

/**
 * Result of profanity detection analysis
 * 
 * @interface ToxBlockResult
 * @example
 * ```typescript
 * const result: ToxBlockResult = {
 *   isProfane: false,
 *   confidence: 0.95,
 *   language: 'en',
 *   details: 'Clean content detected'
 * };
 * ```
 */
export interface ToxBlockResult {
  /** Whether the text contains profanity, toxic content, or inappropriate language */
  isProfane: boolean;
  /** Confidence score between 0 and 1 (higher means more confident) */
  confidence: number;
  /** Detected language code (e.g., 'en', 'es', 'fr') or 'unknown' */
  language?: string;
  /** Additional details about the detection or error information */
  details?: string | undefined;
}

/**
 * Error thrown by ToxBlock operations
 * 
 * @class ToxBlockError
 * @extends Error
 * @example
 * ```typescript
 * try {
 *   await toxBlock.checkText(invalidInput);
 * } catch (error) {
 *   if (error instanceof ToxBlockError) {
 *     console.log('Error code:', error.code);
 *     console.log('Original error:', error.originalError);
 *   }
 * }
 * ```
 */
export class ToxBlockError extends Error {
  /** Error code for categorization (e.g., 'INVALID_CONFIG', 'ANALYSIS_FAILED') */
  public readonly code: string;
  /** Original error that caused this error, if any */
  public readonly originalError: Error | undefined;

  /**
   * Creates a new ToxBlockError instance
   * 
   * @param message - Error message describing what went wrong
   * @param code - Error code for categorization and handling
   * @param originalError - Original error that caused this error (optional)
   */
  constructor(
    message: string,
    code: string,
    originalError?: Error
  ) {
    super(message);
    this.name = 'ToxBlockError';
    this.code = code;
    this.originalError = originalError;
  }
}

/**
 * ToxBlock - A professional profanity detection module using Gemini AI
 * 
 * Provides comprehensive text analysis for detecting profanity, toxic content,
 * hate speech, and inappropriate language across multiple languages.
 * 
 * @class ToxBlock
 * @example
 * ```typescript
 * // Basic usage
 * const toxBlock = new ToxBlock({ apiKey: 'your-gemini-api-key' });
 * const result = await toxBlock.checkText('Hello world');
 * console.log(result.isProfane); // false
 * console.log(result.confidence); // 0.95
 * 
 * // Batch processing
 * const results = await toxBlock.checkTexts(['Hello', 'Bad word']);
 * results.forEach((result, index) => {
 *   console.log(`Text ${index}: ${result.isProfane ? 'Toxic' : 'Clean'}`);
 * });
 * 
 * // Custom configuration
 * const customToxBlock = new ToxBlock({
 *   apiKey: 'your-api-key',
 *   model: 'gemini-2.0-flash-001',
 *   timeout: 15000,
 *   customPrompt: 'Analyze this text: {TEXT}'
 * });
 * ```
 */
export class ToxBlock {
  /** Google Gemini AI instance */
  private readonly genAI: GoogleGenAI;
  /** AI model name to use for analysis */
  private readonly model: string;
  /** Custom prompt template for profanity detection */
  private readonly customPrompt: string;
  /** Timeout for API requests in milliseconds */
  private readonly timeout: number;

  /**
   * Default prompt template for profanity detection
   */
  private static readonly DEFAULT_PROMPT = `
Analyze the following text for profanity, toxic content, hate speech, or inappropriate language in ANY language.
Return your response in this exact JSON format:
{
  "isProfane": boolean,
  "confidence": number (0-1),
  "language": "detected language or 'unknown'",
  "details": "brief explanation if profane"
}

Text to analyze: "{TEXT}"

Response:`;

  /**
   * Creates a new ToxBlock instance
   * 
   * @param config - Configuration options
   * @throws {ToxBlockError} When configuration is invalid
   */
  constructor(config: ToxBlockConfig) {
    if (!config.apiKey || typeof config.apiKey !== 'string') {
      throw new ToxBlockError(
        'API key is required and must be a string',
        'INVALID_CONFIG'
      );
    }

    this.genAI = new GoogleGenAI({ apiKey: config.apiKey });
    this.model = config.model || 'gemini-2.0-flash-001';
    this.customPrompt = config.customPrompt || ToxBlock.DEFAULT_PROMPT;
    this.timeout = config.timeout || 10000;
  }

  /**
   * Checks if the provided text contains profanity or toxic content
   * 
   * @param text - The text to analyze
   * @returns Promise resolving to detection result
   * @throws {ToxBlockError} When analysis fails
   * 
   * @example
   * ```typescript
   * const result = await toxBlock.checkText('This is a test');
   * if (result.isProfane) {
   *   console.log('Profanity detected!');
   * }
   * ```
   */
  public async checkText(text: string): Promise<ToxBlockResult> {
    if (!text || typeof text !== 'string') {
      throw new ToxBlockError(
        'Text must be a non-empty string',
        'INVALID_INPUT'
      );
    }

    if (text.trim().length === 0) {
      return {
        isProfane: false,
        confidence: 1.0,
        language: 'unknown',
        details: 'Empty text'
      };
    }

    try {
      const prompt = this.customPrompt.replace('{TEXT}', text);

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Request timeout'));
        }, this.timeout);
      });

      const result = await Promise.race([
        this.genAI.models.generateContent({
          model: this.model,
          contents: prompt
        }),
        timeoutPromise
      ]);

      const responseText = result.text || '';

      if (!responseText) {
        throw new Error('Empty response from AI model');
      }

      return this.parseResponse(responseText);
    } catch (error) {
      throw new ToxBlockError(
        'Failed to analyze text',
        'ANALYSIS_FAILED',
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Checks multiple texts in batch
   * 
   * @param texts - Array of texts to analyze
   * @returns Promise resolving to array of detection results
   * @throws {ToxBlockError} When batch analysis fails
   */
  public async checkTexts(texts: string[]): Promise<ToxBlockResult[]> {
    if (!Array.isArray(texts)) {
      throw new ToxBlockError(
        'Texts must be an array',
        'INVALID_INPUT'
      );
    }

    const results: ToxBlockResult[] = [];
    
    for (const text of texts) {
      try {
        const result = await this.checkText(text);
        results.push(result);
      } catch (error) {
        results.push({
          isProfane: false,
          confidence: 0,
          details: `Error: ${error instanceof Error ? error.message : String(error)}`
        });
      }
    }

    return results;
  }

  /**
   * Parses the AI response and extracts profanity detection result
   * 
   * @private
   * @param responseText - Raw response from Gemini AI
   * @returns Parsed detection result
   */
  private parseResponse(responseText: string): ToxBlockResult {
    try {
      const cleanedResponse = responseText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      const parsed = JSON.parse(cleanedResponse) as {
        isProfane?: boolean;
        confidence?: number;
        language?: string;
        details?: string;
      };

      return {
        isProfane: Boolean(parsed.isProfane),
        confidence: typeof parsed.confidence === 'number' ? 
          Math.max(0, Math.min(1, parsed.confidence)) : 0.5,
        language: parsed.language || 'unknown',
        details: parsed.details
      };
    } catch {
      const lowerResponse = responseText.toLowerCase();
      const isProfane = lowerResponse.includes('true') || 
                       lowerResponse.includes('profane') ||
                       lowerResponse.includes('toxic') ||
                       lowerResponse.includes('inappropriate');
      
      return {
        isProfane,
        confidence: 0.5,
        language: 'unknown',
        details: 'Fallback parsing used'
      };
    }
  }

  /**
   * Gets the current configuration
   * 
   * @returns Current model and timeout settings
   */
  public getConfig(): { model: string; timeout: number } {
    return {
      model: this.model,
      timeout: this.timeout
    };
  }
}

/**
 * Default export for convenience
 */
export default ToxBlock;

/**
 * Creates a ToxBlock instance with the provided configuration
 * 
 * @param config - Configuration options
 * @returns New ToxBlock instance
 */
export function createToxBlock(config: ToxBlockConfig): ToxBlock {
  return new ToxBlock(config);
}