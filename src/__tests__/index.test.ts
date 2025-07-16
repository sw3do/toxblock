import { ToxBlock, ToxBlockConfig, ToxBlockError, createToxBlock } from '../index';
import { GoogleGenAI } from '@google/genai';

jest.mock('@google/genai');

const mockGoogleGenAI = GoogleGenAI as jest.MockedClass<typeof GoogleGenAI>;

describe('ToxBlock', () => {
  let mockGenerateContent: jest.Mock;
  let toxBlock: ToxBlock;
  const validConfig: ToxBlockConfig = {
    apiKey: 'test-api-key',
    model: 'gemini-2.0-flash-001',
    timeout: 5000
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockGenerateContent = jest.fn();
    const mockModel = {
      generateContent: mockGenerateContent
    };
    
    mockGoogleGenAI.mockImplementation(() => ({
      models: mockModel
    } as any));
    
    toxBlock = new ToxBlock(validConfig);
  });

  describe('Constructor', () => {
    it('should create instance with valid config', () => {
      expect(toxBlock).toBeInstanceOf(ToxBlock);
      expect(mockGoogleGenAI).toHaveBeenCalledWith({ apiKey: 'test-api-key' });
    });

    it('should use default model when not specified', () => {
      const config = { apiKey: 'test-key' };
      const instance = new ToxBlock(config);
      expect(instance.getConfig().model).toBe('gemini-2.0-flash-001');
    });

    it('should use default timeout when not specified', () => {
      const config = { apiKey: 'test-key' };
      const instance = new ToxBlock(config);
      expect(instance.getConfig().timeout).toBe(10000);
    });

    it('should throw error for missing API key', () => {
      expect(() => new ToxBlock({} as ToxBlockConfig)).toThrow(ToxBlockError);
      expect(() => new ToxBlock({} as ToxBlockConfig)).toThrow('API key is required and must be a string');
    });

    it('should throw error for invalid API key type', () => {
      expect(() => new ToxBlock({ apiKey: 123 } as any)).toThrow(ToxBlockError);
    });

    it('should use custom model when specified', () => {
      const config = { apiKey: 'test-key', model: 'custom-model' };
      const instance = new ToxBlock(config);
      expect(instance.getConfig().model).toBe('custom-model');
    });

    it('should use custom timeout when specified', () => {
      const config = { apiKey: 'test-key', timeout: 15000 };
      const instance = new ToxBlock(config);
      expect(instance.getConfig().timeout).toBe(15000);
    });
  });

  describe('checkText', () => {
    it('should return non-profane result for clean text', async () => {
      const mockResponse = {
        text: JSON.stringify({
          isProfane: false,
          confidence: 0.9,
          language: 'en',
          details: 'Clean text'
        })
      };
      mockGenerateContent.mockResolvedValue(mockResponse);

      const result = await toxBlock.checkText('Hello world');

      expect(result).toEqual({
        isProfane: false,
        confidence: 0.9,
        language: 'en',
        details: 'Clean text'
      });
    });

    it('should return profane result for toxic text', async () => {
      const mockResponse = {
        text: JSON.stringify({
          isProfane: true,
          confidence: 0.95,
          language: 'en',
          details: 'Contains profanity'
        })
      };
      mockGenerateContent.mockResolvedValue(mockResponse);

      const result = await toxBlock.checkText('bad words here');

      expect(result).toEqual({
        isProfane: true,
        confidence: 0.95,
        language: 'en',
        details: 'Contains profanity'
      });
    });

    it('should handle empty text', async () => {
      const result = await toxBlock.checkText('   ');

      expect(result).toEqual({
        isProfane: false,
        confidence: 1.0,
        language: 'unknown',
        details: 'Empty text'
      });
    });

    it('should throw error for invalid input', async () => {
      await expect(toxBlock.checkText('')).rejects.toThrow(ToxBlockError);
      await expect(toxBlock.checkText(null as any)).rejects.toThrow(ToxBlockError);
      await expect(toxBlock.checkText(undefined as any)).rejects.toThrow(ToxBlockError);
      await expect(toxBlock.checkText(123 as any)).rejects.toThrow(ToxBlockError);
    });

    it('should handle API timeout', async () => {
      mockGenerateContent.mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 6000))
      );

      await expect(toxBlock.checkText('test')).rejects.toThrow(ToxBlockError);
    });

    it('should handle API errors', async () => {
      mockGenerateContent.mockRejectedValue(new Error('API Error'));

      await expect(toxBlock.checkText('test')).rejects.toThrow(ToxBlockError);
    });

    it('should handle empty response from API', async () => {
      mockGenerateContent.mockResolvedValue({ text: '' });

      await expect(toxBlock.checkText('test')).rejects.toThrow(ToxBlockError);
    });

    it('should handle malformed JSON response with fallback parsing', async () => {
      const mockResponse = {
        text: 'This text contains profane content: true'
      };
      mockGenerateContent.mockResolvedValue(mockResponse);

      const result = await toxBlock.checkText('test');

      expect(result).toEqual({
        isProfane: true,
        confidence: 0.5,
        language: 'unknown',
        details: 'Fallback parsing used'
      });
    });

    it('should handle JSON response with code blocks', async () => {
      const mockResponse = {
        text: '```json\n{"isProfane": false, "confidence": 0.8, "language": "en"}\n```'
      };
      mockGenerateContent.mockResolvedValue(mockResponse);

      const result = await toxBlock.checkText('test');

      expect(result).toEqual({
        isProfane: false,
        confidence: 0.8,
        language: 'en',
        details: undefined
      });
    });

    it('should clamp confidence values to valid range', async () => {
      const mockResponse = {
        text: JSON.stringify({
          isProfane: false,
          confidence: 1.5,
          language: 'en'
        })
      };
      mockGenerateContent.mockResolvedValue(mockResponse);

      const result = await toxBlock.checkText('test');

      expect(result.confidence).toBe(1.0);
    });

    it('should handle negative confidence values', async () => {
      const mockResponse = {
        text: JSON.stringify({
          isProfane: false,
          confidence: -0.5,
          language: 'en'
        })
      };
      mockGenerateContent.mockResolvedValue(mockResponse);

      const result = await toxBlock.checkText('test');

      expect(result.confidence).toBe(0.0);
    });

    it('should use custom prompt when provided', async () => {
      const customPrompt = 'Custom analysis: {TEXT}';
      const customToxBlock = new ToxBlock({
        ...validConfig,
        customPrompt
      });

      const mockResponse = {
        text: JSON.stringify({
          isProfane: false,
          confidence: 0.8,
          language: 'en'
        })
      };
      mockGenerateContent.mockResolvedValue(mockResponse);

      await customToxBlock.checkText('test');

      expect(mockGenerateContent).toHaveBeenCalledWith({
        model: 'gemini-2.0-flash-001',
        contents: 'Custom analysis: test'
      });
    });
  });

  describe('checkTexts', () => {
    it('should process multiple texts successfully', async () => {
      const mockResponse = {
        text: JSON.stringify({
          isProfane: false,
          confidence: 0.9,
          language: 'en'
        })
      };
      mockGenerateContent.mockResolvedValue(mockResponse);

      const texts = ['Hello', 'World', 'Test'];
      const results = await toxBlock.checkTexts(texts);

      expect(results).toHaveLength(3);
      expect(results.every(r => !r.isProfane)).toBe(true);
      expect(mockGenerateContent).toHaveBeenCalledTimes(3);
    });

    it('should handle mixed results', async () => {
      mockGenerateContent
        .mockResolvedValueOnce({
          text: JSON.stringify({ isProfane: false, confidence: 0.9, language: 'en' })
        })
        .mockResolvedValueOnce({
          text: JSON.stringify({ isProfane: true, confidence: 0.95, language: 'en' })
        });

      const texts = ['Hello', 'BadWord'];
      const results = await toxBlock.checkTexts(texts);

      expect(results).toHaveLength(2);
      expect(results[0]?.isProfane).toBe(false);
      expect(results[1]?.isProfane).toBe(true);
    });

    it('should handle errors gracefully in batch processing', async () => {
      mockGenerateContent
        .mockResolvedValueOnce({
          text: JSON.stringify({ isProfane: false, confidence: 0.9, language: 'en' })
        })
        .mockRejectedValueOnce(new Error('API Error'));

      const texts = ['Hello', 'Test'];
      const results = await toxBlock.checkTexts(texts);

      expect(results).toHaveLength(2);
      expect(results[0]?.isProfane).toBe(false);
      expect(results[1]?.isProfane).toBe(false);
      expect(results[1]?.confidence).toBe(0);
      expect(results[1]?.details).toContain('Error:');
    });

    it('should throw error for invalid input', async () => {
      await expect(toxBlock.checkTexts(null as any)).rejects.toThrow(ToxBlockError);
      await expect(toxBlock.checkTexts('not an array' as any)).rejects.toThrow(ToxBlockError);
    });

    it('should handle empty array', async () => {
      const results = await toxBlock.checkTexts([]);
      expect(results).toEqual([]);
    });
  });

  describe('getConfig', () => {
    it('should return current configuration', () => {
      const config = toxBlock.getConfig();
      expect(config).toEqual({
        model: 'gemini-2.0-flash-001',
        timeout: 5000
      });
    });
  });

  describe('ToxBlockError', () => {
    it('should create error with message and code', () => {
      const error = new ToxBlockError('Test message', 'TEST_CODE');
      expect(error.message).toBe('Test message');
      expect(error.code).toBe('TEST_CODE');
      expect(error.name).toBe('ToxBlockError');
      expect(error.originalError).toBeUndefined();
    });

    it('should create error with original error', () => {
      const originalError = new Error('Original');
      const error = new ToxBlockError('Test message', 'TEST_CODE', originalError);
      expect(error.originalError).toBe(originalError);
    });
  });

  describe('createToxBlock', () => {
    it('should create ToxBlock instance', () => {
      const instance = createToxBlock(validConfig);
      expect(instance).toBeInstanceOf(ToxBlock);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long text', async () => {
      const longText = 'a'.repeat(10000);
      const mockResponse = {
        text: JSON.stringify({
          isProfane: false,
          confidence: 0.9,
          language: 'en'
        })
      };
      mockGenerateContent.mockResolvedValue(mockResponse);

      const result = await toxBlock.checkText(longText);
      expect(result.isProfane).toBe(false);
    });

    it('should handle special characters', async () => {
      const specialText = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const mockResponse = {
        text: JSON.stringify({
          isProfane: false,
          confidence: 0.9,
          language: 'unknown'
        })
      };
      mockGenerateContent.mockResolvedValue(mockResponse);

      const result = await toxBlock.checkText(specialText);
      expect(result.isProfane).toBe(false);
    });

    it('should handle unicode characters', async () => {
      const unicodeText = '🚀 Hello 世界 🌍';
      const mockResponse = {
        text: JSON.stringify({
          isProfane: false,
          confidence: 0.9,
          language: 'mixed'
        })
      };
      mockGenerateContent.mockResolvedValue(mockResponse);

      const result = await toxBlock.checkText(unicodeText);
      expect(result.isProfane).toBe(false);
    });

    it('should handle response without confidence', async () => {
      const mockResponse = {
        text: JSON.stringify({
          isProfane: false,
          language: 'en'
        })
      };
      mockGenerateContent.mockResolvedValue(mockResponse);

      const result = await toxBlock.checkText('test');
      expect(result.confidence).toBe(0.5);
    });

    it('should handle response with invalid confidence type', async () => {
      const mockResponse = {
        text: JSON.stringify({
          isProfane: false,
          confidence: 'high',
          language: 'en'
        })
      };
      mockGenerateContent.mockResolvedValue(mockResponse);

      const result = await toxBlock.checkText('test');
      expect(result.confidence).toBe(0.5);
    });
  });
});