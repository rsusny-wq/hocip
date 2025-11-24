/**
 * Gemini AI Client - Complete Implementation
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { VULNERABLE_USER_PROMPT, VULNERABLE_USER_EXAMPLES } from './prompts/vulnerableUserPrompts';
import { FIELD_WORKER_PROMPT, FIELD_WORKER_EXAMPLES } from './prompts/fieldWorkerPrompts';
import { CASE_MANAGER_PROMPT, CASE_MANAGER_EXAMPLES } from './prompts/caseManagerPrompts';

const API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface ConversationContext {
    persona: 'vulnerable-user' | 'field-worker' | 'case-manager';
    language?: string;
    location?: { lat: number; lng: number };
    weather?: any;
    nearbyServices?: any[];
    userHistory?: any[];
    customContext?: Record<string, any>;
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface ChatResponse {
    message: string;
    suggestions?: string[];
    actions?: Array<{
        type: 'navigate' | 'call' | 'alert' | 'resource';
        label: string;
        data: any;
    }>;
}

export async function chat(
    message: string,
    context: ConversationContext,
    history: ChatMessage[] = []
): Promise<ChatResponse> {
    if (!genAI) {
        console.warn('No Gemini API key - using mock responses');
        return getMockResponse(message, context);
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = buildPrompt(message, context, history);

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        return parseResponse(response, context);
    } catch (error) {
        console.error('Gemini AI error:', error);
        return getMockResponse(message, context);
    }
}

function buildPrompt(message: string, context: ConversationContext, history: ChatMessage[]): string {
    let systemPrompt = VULNERABLE_USER_PROMPT;
    if (context.persona === 'field-worker') systemPrompt = FIELD_WORKER_PROMPT;
    if (context.persona === 'case-manager') systemPrompt = CASE_MANAGER_PROMPT;

    const contextInfo = buildContextInfo(context);
    const conversationHistory = buildConversationHistory(history);

    return `${systemPrompt}

${contextInfo}

${conversationHistory}

User: ${message}
Assistant: Respond with AI response`;
}

function buildContextInfo(context: ConversationContext): string {
    let info = 'CURRENT CONTEXT:\n';

    if (context.location) {
        info += `- User location: ${context.location.lat.toFixed(4)}, ${context.location.lng.toFixed(4)}\n`;
    }

    if (context.weather) {
        info += `- Weather: ${context.weather.temperatureFahrenheit}°F, ${context.weather.weatherDescription}\n`;
        if (context.weather.temperatureFahrenheit <= 32) {
            info += `- ALERT: Freezing temperatures - prioritize shelter\n`;
        }
    }

    if (context.nearbyServices && context.nearbyServices.length > 0) {
        info += `\nNEARBY SERVICES (within 2 miles):\n`;
        context.nearbyServices.slice(0, 5).forEach((service: any, i: number) => {
            const distance = service.distance ? `${service.distance.toFixed(1)}mi` : 'nearby';
            info += `${i + 1}. ${service.name} (${service.category}) - ${distance}\n`;
            info += `   Address: ${service.location.address}\n`;
            if (service.availability?.bedsAvailable) {
                info += `   Beds available: ${service.availability.bedsAvailable}\n`;
            }
        });
    } else if (!context.location) {
        info += '\n- User has NOT shared location yet\n';
        info += '- Cannot show nearby services without location\n';
    }

    return info;
}

function buildConversationHistory(history: ChatMessage[]): string {
    if (history.length === 0) return '';

    let historyText = 'CONVERSATION HISTORY:\n';
    history.slice(-5).forEach(msg => {
        historyText += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
    });

    return historyText;
}

function parseResponse(response: string, context: ConversationContext): ChatResponse {
    const actions: any[] = [];

    if (response.toLowerCase().includes('navigate') || response.toLowerCase().includes('directions')) {
        if (context.nearbyServices && context.nearbyServices.length > 0) {
            actions.push({
                type: 'navigate',
                label: 'Get Directions',
                data: context.nearbyServices[0]
            });
        }
    }

    if (response.toLowerCase().includes('call')) {
        if (context.nearbyServices && context.nearbyServices.length > 0 && context.nearbyServices[0].contact?.phone) {
            actions.push({
                type: 'call',
                label: 'Call Now',
                data: context.nearbyServices[0].contact.phone
            });
        }
    }

    const suggestions: string[] = [];
    if (context.persona === 'vulnerable-user') {
        if (!context.location) {
            suggestions.push('Share my location');
        } else {
            suggestions.push('Show me on map', 'Find more services');
        }
    } else if (context.persona === 'field-worker') {
        suggestions.push('Check bed availability', 'Find nearest shelter', 'Protocol check');
    } else if (context.persona === 'case-manager') {
        suggestions.push('Housing voucher info', 'Benefits appeal', 'Create care plan');
    }

    return {
        message: response,
        suggestions,
        actions
    };
}

function getMockResponse(message: string, context: ConversationContext): ChatResponse {
    const lowerMessage = message.toLowerCase();
    const hasLocation = !!context.location;

    // Field Worker Mock Responses
    if (context.persona === 'field-worker') {
        if (lowerMessage.includes('shelter') || lowerMessage.includes('bed')) {
            return {
                message: FIELD_WORKER_EXAMPLES.resource_search.assistant,
                suggestions: ['Check another shelter', 'Start intake'],
                actions: []
            };
        }
        if (lowerMessage.includes('protocol') || lowerMessage.includes('cold') || lowerMessage.includes('blue')) {
            return {
                message: FIELD_WORKER_EXAMPLES.protocol_check.assistant,
                suggestions: ['Log refusal', 'Call EMS'],
                actions: []
            };
        }
        return {
            message: "Field Worker Assistant Ready.\n\nI can help with:\n• Resource lookup\n• Bed availability\n• Intake protocols\n• Safety checks",
            suggestions: ['Find shelter', 'Check protocols', 'Intake help'],
            actions: []
        };
    }

    // Case Manager Mock Responses
    if (context.persona === 'case-manager') {
        if (lowerMessage.includes('housing') || lowerMessage.includes('voucher')) {
            return {
                message: CASE_MANAGER_EXAMPLES.housing_voucher.assistant,
                suggestions: ['Check fair market rent', 'Broker list'],
                actions: []
            };
        }
        if (lowerMessage.includes('appeal') || lowerMessage.includes('denied')) {
            return {
                message: CASE_MANAGER_EXAMPLES.benefits_application.assistant,
                suggestions: ['Download forms', 'Legal referral'],
                actions: []
            };
        }
        return {
            message: "Case Manager Assistant Ready.\n\nI can help with:\n• Housing vouchers\n• Benefits appeals\n• Care planning\n• Legal rights",
            suggestions: ['Housing search', 'Benefits help', 'Care plan'],
            actions: []
        };
    }

    // Vulnerable User Mock Responses (Default)
    if (lowerMessage.includes('sleep') || lowerMessage.includes('shelter')) {
        if (!hasLocation) {
            return {
                message: "I can help you find a safe place to sleep tonight. 🏠\n\nTo show you the nearest shelters, I'll need to know where you are. Would you like to share your location?",
                suggestions: ['Share my location', 'Tell me more first'],
                actions: []
            };
        } else {
            return {
                message: VULNERABLE_USER_EXAMPLES.shelter.assistant,
                suggestions: ['Show on map', 'Call shelter'],
                actions: [{
                    type: 'navigate',
                    label: 'Navigate to Shelter',
                    data: context.nearbyServices?.[0]
                }]
            };
        }
    }

    if (lowerMessage.includes('hungry') || lowerMessage.includes('food')) {
        if (!hasLocation) {
            return {
                message: "I can help you find food right away. 🍽️\n\nTo show you the nearest food banks and meal programs, I'll need to know where you are. Would you like to share your location?",
                suggestions: ['Share my location', 'What kind of food help?'],
                actions: []
            };
        } else {
            return {
                message: VULNERABLE_USER_EXAMPLES.food.assistant,
                suggestions: ['Show on map', 'Get directions'],
                actions: [{
                    type: 'navigate',
                    label: 'Navigate to Food Bank',
                    data: context.nearbyServices?.[0]
                }]
            };
        }
    }

    if (lowerMessage.includes('sick') || lowerMessage.includes('medical') || lowerMessage.includes('doctor')) {
        if (!hasLocation) {
            return {
                message: "I'm sorry you're not feeling well. I can help you find medical care. 🏥\n\nTo show you the nearest clinics, I'll need to know where you are. Would you like to share your location?",
                suggestions: ['Share my location', 'Is it urgent?'],
                actions: []
            };
        } else {
            return {
                message: VULNERABLE_USER_EXAMPLES.medical.assistant,
                suggestions: ['Call 911', 'Show clinics'],
                actions: [{
                    type: 'navigate',
                    label: 'Navigate to Clinic',
                    data: context.nearbyServices?.[0]
                }]
            };
        }
    }

    if (lowerMessage.includes('scared') || lowerMessage.includes('help') || lowerMessage.includes('crisis')) {
        return {
            message: VULNERABLE_USER_EXAMPLES.crisis.assistant,
            suggestions: ['Call 988', 'Find shelter', 'Talk to someone'],
            actions: [{
                type: 'call',
                label: 'Call Crisis Hotline (988)',
                data: '988'
            }]
        };
    }

    return {
        message: "I'm here to help you. 💙\n\nI can assist with:\n• Finding shelter\n• Getting food\n• Medical care\n• Crisis support\n\nWhat do you need help with today?",
        suggestions: ['Find shelter', 'Get food', 'Medical help', 'Talk to someone'],
        actions: []
    };
}