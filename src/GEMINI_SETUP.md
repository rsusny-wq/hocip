# Gemini AI Integration Guide

This application includes integration with Google's Gemini AI for intelligent outreach coordination features.

## Features Powered by Gemini AI

### 1. **Service Recommendations** (`/components/screens/ServiceRecommendation.tsx`)
- AI-driven matching of services to client needs
- Contextual recommendations based on location, availability, and client history
- Scoring and reasoning for each recommendation

### 2. **Encounter Data Extraction** (`/components/screens/EncounterLogging.tsx`)
- Automatic extraction of structured data from free-form notes
- Identifies demographics, needs, health concerns, and risk factors
- Suggests recommended next steps

### 3. **Case Summaries** (Future implementation)
- Comprehensive case analysis from encounter history
- Progress tracking and challenge identification
- Priority recommendations for case managers

### 4. **Voice-to-Structured Data** (Future implementation)
- Converts voice transcripts to structured encounter logs
- Extracts key information from conversational input

## Setup Instructions

### Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy your API key

### Step 2: Add API Key to Configuration

Open the file `/config/api.ts` and replace the placeholder with your actual API key:

```typescript
export const config = {
  gemini: {
    apiKey: 'YOUR_ACTUAL_API_KEY_HERE', // Replace this
    model: 'gemini-pro',
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta',
  },
};
```

### Step 3: Test the Integration

1. Navigate to any screen with AI features (Service Recommendations or Encounter Logging)
2. Click the "Get AI Analysis" or "Extract with AI" button
3. The AI badge should change from "Mock AI" to "AI Powered" when configured

## Mock Mode

If no API key is configured, the application will automatically use mock responses. This allows you to:
- Test the UI and user flows without an API key
- See example outputs for each AI feature
- Develop and demo the application without API costs

## API Usage and Costs

- Gemini API offers a generous free tier
- Check current pricing at [Google AI Pricing](https://ai.google.dev/pricing)
- The application uses `gemini-pro` model by default
- Temperature and token limits are pre-configured for optimal results

## Available AI Functions

All AI functions are located in `/services/gemini.ts`:

### `generateServiceRecommendations(clientNeeds, clientContext)`
Generates 3-5 service recommendations based on client needs.

### `extractEncounterData(notes)`
Extracts structured information from encounter notes.

### `generateCaseSummary(encounterHistory, currentStatus)`
Provides comprehensive case analysis and recommendations.

### `processSpeechToEncounter(transcript)`
Converts voice transcripts to structured data.

## Customization

You can modify AI behavior by adjusting parameters in `/services/gemini.ts`:

```typescript
{
  temperature: 0.7,  // 0.0 = deterministic, 1.0 = creative
  maxTokens: 1024,   // Maximum response length
}
```

## Privacy and Security

⚠️ **Important**: 
- Never commit API keys to version control
- This is a prototype - not meant for collecting real PII
- In production, API calls should go through a secure backend
- Add `/config/api.ts` to `.gitignore` if deploying

## Troubleshooting

### "Mock AI" badge still showing
- Verify API key is correctly added to `/config/api.ts`
- Check browser console for error messages
- Ensure API key doesn't have quotes or extra spaces

### API Errors
- Check API key is valid and active
- Verify you haven't exceeded rate limits
- Check browser network tab for error details

### No Response
- Open browser console to check for errors
- Verify internet connection
- Try the mock mode to ensure UI is working

## Support

For issues with:
- **Gemini API**: Visit [Google AI Documentation](https://ai.google.dev/docs)
- **Application**: Check the console for error messages
- **Features**: Review component code in `/components/screens/`

---

Built with ❤️ for homeless outreach coordination
