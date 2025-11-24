/**
 * Enhanced Gemini AI Service for Vulnerable Users
 * Integrates real Gemini AI with location-aware service discovery
 */

import { chat, type ConversationContext, type ChatMessage, type ChatResponse } from './gemini/geminiClient';
import { getCurrentLocation, type Coordinates } from './navigation';
import { getProvidersNearLocation, type ServiceProvider } from '../data/serviceProviders';
import { getCurrentWeather, type WeatherData } from './weather';

export interface EnhancedChatResponse extends ChatResponse {
    needsLocation?: boolean;
    showServices?: ServiceProvider[];
    showMap?: boolean;
}

/**
 * Chat with vulnerable user - handles location sharing and service discovery
 */
export async function chatWithVulnerableUser(
    message: string,
    history: ChatMessage[],
    userLocation?: Coordinates
): Promise<EnhancedChatResponse> {
    // Build context
    const context: ConversationContext = {
        persona: 'vulnerable-user',
        language: 'en-US', // TODO: Auto-detect
    };

    // Add location if available
    if (userLocation) {
        context.location = userLocation;

        // Get nearby services
        const nearbyServices = getProvidersNearLocation(
            userLocation.lat,
            userLocation.lng,
            2 // 2 mile radius
        );
        context.nearbyServices = nearbyServices;

        // Get weather
        try {
            const weather = await getCurrentWeather(userLocation.lat, userLocation.lng);
            if (weather) {
                context.weather = weather;
            }
        } catch (error) {
            console.error('Weather fetch error:', error);
        }
    }

    // Call Gemini AI
    const response = await chat(message, context, history);

    // Enhance response based on content
    const enhanced: EnhancedChatResponse = { ...response };

    // Check if user needs location-based services
    const needsServices = detectServiceNeed(message, response.message);

    if (needsServices && !userLocation) {
        // User needs services but hasn't shared location
        enhanced.needsLocation = true;
    } else if (needsServices && userLocation && context.nearbyServices) {
        // User needs services and has location - show them!
        enhanced.showServices = context.nearbyServices.slice(0, 5); // Top 5
        enhanced.showMap = true;
    }

    return enhanced;
}

/**
 * Detect if user message or AI response indicates need for location-based services
 */
function detectServiceNeed(userMessage: string, aiResponse: string): boolean {
    const serviceKeywords = [
        'shelter', 'sleep', 'place to stay',
        'food', 'hungry', 'eat', 'meal',
        'medical', 'doctor', 'clinic', 'sick', 'hurt',
        'help', 'need', 'find'
    ];

    const combined = (userMessage + ' ' + aiResponse).toLowerCase();

    return serviceKeywords.some(keyword => combined.includes(keyword));
}

/**
 * Request user location with permission
 */
export async function requestUserLocation(): Promise<Coordinates | null> {
    try {
        const location = await getCurrentLocation();
        return location;
    } catch (error) {
        console.error('Location request error:', error);
        return null;
    }
}
