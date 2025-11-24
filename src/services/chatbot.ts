// AI Chatbot Service for Field Workers and Case Managers
import { callGemini } from './gemini';

export type UserRole = 'field-worker' | 'case-manager' | 'program-manager';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageUrl?: string;
  imageDescription?: string;
}

export interface ChatContext {
  userRole: UserRole;
  currentCase?: string;
  currentClient?: string;
  recentEncounters?: string[];
  location?: string;
}

/**
 * Get system prompt based on user role
 */
function getSystemPrompt(role: UserRole): string {
  const basePrompt = 'You are an AI assistant for a homeless outreach application. Be compassionate, professional, and helpful.';
  
  switch (role) {
    case 'field-worker':
      return `${basePrompt}

You're assisting a FIELD WORKER who encounters people experiencing homelessness on the streets. Help them:
- Document encounters quickly and accurately
- Assess immediate needs (shelter, medical, food, etc.)
- Determine appropriate services to recommend
- Handle difficult situations with compassion
- Log important details about each person they meet
- Understand consent and privacy requirements
- Navigate resources available in their area

Be concise and action-oriented. Field workers are often in the field with limited time.`;

    case 'case-manager':
      return `${basePrompt}

You're assisting a CASE MANAGER who coordinates services for clients. Help them:
- Review client cases and history
- Track progress and follow-ups
- Coordinate services across providers
- Identify gaps in service delivery
- Prioritize high-risk cases
- Generate reports and summaries
- Make data-driven decisions
- Communicate updates to stakeholders

Provide detailed analysis and strategic recommendations.`;

    case 'program-manager':
      return `${basePrompt}

You're assisting a PROGRAM MANAGER who oversees outreach programs. Help them:
- Analyze program performance and metrics
- Identify trends and patterns
- Allocate resources effectively
- Review team performance
- Generate reports for stakeholders
- Make strategic decisions
- Improve program outcomes

Focus on high-level insights and strategic planning.`;

    default:
      return basePrompt;
  }
}

/**
 * Build context information string
 */
function buildContextInfo(context: ChatContext): string {
  const parts: string[] = [];
  
  if (context.location) {
    parts.push(`Current Location: ${context.location}`);
  }
  
  if (context.currentClient) {
    parts.push(`Current Client: ${context.currentClient}`);
  }
  
  if (context.currentCase) {
    parts.push(`Current Case: ${context.currentCase}`);
  }
  
  if (context.recentEncounters && context.recentEncounters.length > 0) {
    parts.push(`Recent Encounters: ${context.recentEncounters.join(', ')}`);
  }
  
  return parts.length > 0 ? `\nContext:\n${parts.join('\n')}` : '';
}

/**
 * Generate chatbot response based on user role and context
 */
export async function getChatbotResponse(
  message: string,
  context: ChatContext,
  conversationHistory: ChatMessage[]
): Promise<string> {
  const systemPrompt = getSystemPrompt(context.userRole);
  const contextInfo = buildContextInfo(context);
  const history = conversationHistory
    .slice(-6) // Last 3 exchanges
    .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n');

  const fullPrompt = `${systemPrompt}

${contextInfo}

Conversation History:
${history}

User: ${message}