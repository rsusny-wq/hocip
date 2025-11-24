// Gemini API Service for AI capabilities
import { config, isGeminiConfigured } from '../config/api';

const GEMINI_API_URL = `${config.gemini.apiUrl}/models/${config.gemini.model}:generateContent`;

export interface GeminiRequest {
  prompt: string;
  temperature?: number;
  maxTokens?: number;
}

export interface GeminiResponse {
  text: string;
  success: boolean;
  error?: string;
}

/**
 * Call Gemini API to generate AI responses
 */
export async function callGemini({
  prompt,
  temperature = 0.7,
  maxTokens = 1024,
}: GeminiRequest): Promise<GeminiResponse> {
  try {
    // Check if API key is configured
    if (!isGeminiConfigured()) {
      console.warn('Gemini API key not configured. Using mock response.');
      return {
        text: generateMockResponse(prompt),
        success: true,
      };
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${config.gemini.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Extract text from Gemini response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return {
      text,
      success: true,
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      text: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Generate service recommendations based on client needs
 */
export async function generateServiceRecommendations(
  clientNeeds: string,
  clientContext?: string
): Promise<GeminiResponse> {
  const prompt = `You are an AI assistant for a homeless outreach coordination system. 
Based on the following client needs and context, recommend appropriate services.

Client Needs: ${clientNeeds}
${clientContext ? `Context: ${clientContext}` : ''}

Provide 3-5 specific service recommendations with:
1. Service type (Shelter, Medical, Food, ID Services, Mental Health, Detox)
2. Match score (0-100)
3. Brief reason for recommendation
4. Availability status

Format your response as a structured list.`;

  return callGemini({ prompt, temperature: 0.5 });
}

/**
 * Extract structured data from encounter notes
 */
export async function extractEncounterData(
  notes: string
): Promise<GeminiResponse> {
  const prompt = `You are an AI assistant for a homeless outreach system. Extract structured information from the following encounter notes.

Encounter Notes: ${notes}

Extract and return:
1. Client demographics (if mentioned)
2. Immediate needs
3. Health concerns
4. Mental health indicators
5. Substance use indicators
6. Risk factors
7. Recommended next steps

Format the response clearly with labeled sections.`;

  return callGemini({ prompt, temperature: 0.3 });
}

/**
 * Generate case summary and recommendations
 */
export async function generateCaseSummary(
  encounterHistory: string[],
  currentStatus: string
): Promise<GeminiResponse> {
  const prompt = `You are an AI assistant for case management in homeless services. 
Review the encounter history and current status, then provide a comprehensive case summary and recommendations.

Encounter History:
${encounterHistory.join('\n')}

Current Status: ${currentStatus}

Provide:
1. Overall case summary
2. Progress indicators
3. Key challenges
4. Recommended interventions
5. Priority next steps

Be compassionate and solution-focused.`;

  return callGemini({ prompt, temperature: 0.6 });
}

/**
 * Convert speech to structured encounter data
 */
export async function processSpeechToEncounter(
  transcript: string
): Promise<GeminiResponse> {
  const prompt = `You are an AI assistant for homeless outreach workers. Convert the following voice transcript into a structured encounter log.

Transcript: "${transcript}"

Extract and format:
1. Location mentioned
2. Client description
3. Immediate needs identified
4. Services provided or offered
5. Follow-up actions needed
6. Safety concerns (if any)

Be concise and accurate.`;

  return callGemini({ prompt, temperature: 0.4 });
}

/**
 * Generate mock responses when API key is not configured
 */
function generateMockResponse(prompt: string): string {
  if (prompt.includes('service recommendations')) {
    return `Mock AI Recommendations:

1. **Emergency Shelter** (Match: 95%)
   - Reason: Client expressed immediate need for safe housing
   - Status: Available - Bed confirmed at Manhattan Shelter Network
   
2. **Medical Services** (Match: 85%)
   - Reason: Mentioned chronic pain and untreated conditions
   - Status: Walk-in available at NYC Health Mobile Clinic
   
3. **Food Assistance** (Match: 90%)
   - Reason: Food insecurity mentioned, last meal >24hrs ago
   - Status: Available - Nearby food bank open until 6pm

Note: Add your Gemini API key to enable real AI recommendations.`;
  }

  if (prompt.includes('Extract structured information')) {
    return `Mock Extracted Data:

**Immediate Needs:** Shelter, food, medical attention
**Health Concerns:** Chronic pain, possible untreated infection
**Mental Health:** Signs of anxiety, appears withdrawn
**Risk Factors:** Sleeping rough in unsafe area
**Recommended Next Steps:** 
- Arrange emergency shelter placement
- Connect with mobile medical unit
- Schedule follow-up within 48 hours

Note: Add your Gemini API key to enable real AI extraction.`;
  }

  if (prompt.includes('case summary')) {
    return `Mock Case Summary:

**Overall Progress:** Client has been engaged for 3 weeks, showing gradual trust building
**Key Challenges:** Housing instability, untreated medical conditions
**Recommended Interventions:** 
- Priority shelter placement
- Medical case management
- Connect with benefits assistance

Note: Add your Gemini API key to enable real AI analysis.`;
  }

  if (prompt.includes('voice transcript')) {
    return `Mock Structured Encounter:

**Location:** Downtown area near 5th Street
**Client Description:** Male, 40s, appears unwell
**Immediate Needs:** Food, medical attention
**Services Offered:** Connected to mobile clinic, provided meal voucher
**Follow-up:** Return visit scheduled for tomorrow

Note: Add your Gemini API key to enable real AI processing.`;
  }

  if (prompt.includes('vulnerable') || prompt.includes('compassionate')) {
    return `I understand you're looking for help. I'm here to support you. What's the most important thing you need right now?

(Note: This is a mock response. Add your Gemini API key for real AI assistance.)`;
  }

  return 'Mock AI response. Add your Gemini API key for real AI capabilities.';
}
