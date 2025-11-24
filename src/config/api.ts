/**
 * API Configuration
 * 
 * To use real Gemini AI capabilities:
 * 1. Get your API key from https://makersuite.google.com/app/apikey
 * 2. Replace 'YOUR_GEMINI_API_KEY_HERE' with your actual key below
 */

export const config = {
  gemini: {
    apiKey: 'AIzaSyCMBXUNM_NOuCZMYcDCjNVC2P3V7ToQqw4',
    model: 'gemini-pro',
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta',
  },
};

/**
 * Check if Gemini API is configured
 */
export function isGeminiConfigured(): boolean {
  return config.gemini.apiKey !== 'YOUR_GEMINI_API_KEY_HERE' && 
         config.gemini.apiKey.length > 0;
}
