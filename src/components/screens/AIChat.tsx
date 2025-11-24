// AIChat.tsx - Complete implementation with voice and multilingual support
import { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, MapPin, Navigation2, Phone, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { chatWithVulnerableUser, requestUserLocation, type EnhancedChatResponse } from '../../services/vulnerableUserAI';
import { type ChatMessage } from '../../services/gemini/geminiClient';
import { type ServiceProvider } from '../../data/serviceProviders';
import { type Coordinates } from '../../services/navigation';
import { VoiceChatControls } from '../VoiceChatControls';
import { type LanguageCode, SUPPORTED_LANGUAGES, getGreeting } from '../../services/voiceChat';

interface AIChatProps {
    onBack?: () => void;
}

export function AIChat({ onBack }: AIChatProps) {
    // Voice state
    const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en-US');

    // Core chat state
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: 'assistant',
            content: getGreeting('en-US'),
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
    const [showLocationRequest, setShowLocationRequest] = useState(false);
    const [nearbyServices, setNearbyServices] = useState<ServiceProvider[]>([]);
    const [isRequestingLocation, setIsRequestingLocation] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Scroll to newest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, nearbyServices]);

    // Update greeting when language changes (only if it's the first message)
    useEffect(() => {
        if (messages.length === 1 && messages[0].role === 'assistant') {
            setMessages([
                {
                    role: 'assistant',
                    content: getGreeting(currentLanguage),
                    timestamp: new Date(),
                },
            ]);
        }
    }, [currentLanguage]);

    // Helper to send a chat request
    const sendChat = async (text: string, location?: Coordinates) => {
        const response: EnhancedChatResponse = await chatWithVulnerableUser(
            text,
            messages,
            location
        );
        const aiMessage: ChatMessage = {
            role: 'assistant',
            content: response.message,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
        if (response.needsLocation && !userLocation) setShowLocationRequest(true);
        if (response.showServices) setNearbyServices(response.showServices);
    };

    const handleSend = async () => {
        if (!inputValue.trim() || isLoading) return;
        const userMessage: ChatMessage = {
            role: 'user',
            content: inputValue,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);
        setShowLocationRequest(false);
        try {
            await sendChat(inputValue, userLocation ?? undefined);
        } catch (e) {
            console.error('Chat error:', e);
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: "I'm having trouble right now. Please try again in a moment. 💙",
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleShareLocation = async () => {
        setIsRequestingLocation(true);
        setShowLocationRequest(false);
        try {
            const location = await requestUserLocation();
            if (location) {
                setUserLocation(location);
                // Confirmation message
                setMessages(prev => [
                    ...prev,
                    {
                        role: 'assistant',
                        content: "Thank you for sharing your location! 📍 Let me find services near you...",
                        timestamp: new Date(),
                    },
                ]);
                // Re‑run the last user message with location context
                const lastUser = messages.filter(m => m.role === 'user').pop();
                if (lastUser) {
                    setIsLoading(true);
                    await sendChat(lastUser.content, location);
                    setIsLoading(false);
                }
            } else {
                setMessages(prev => [
                    ...prev,
                    {
                        role: 'assistant',
                        content: "I couldn't get your location. That's okay – you can still describe where you are, or try sharing again later. 💙",
                        timestamp: new Date(),
                    },
                ]);
            }
        } catch (e) {
            console.error('Location error:', e);
        } finally {
            setIsRequestingLocation(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Voice transcript handler
    const handleTranscript = (text: string) => {
        setInputValue(text);
        // Optionally auto‑send after a short pause – here we let user edit before sending
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-neutral-200 px-4 py-4 flex items-center gap-3 shadow-sm">
                <Button variant="ghost" size="icon" onClick={onBack}>
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-xl font-semibold">Chat for Help</h1>
                    <p className="text-sm text-neutral-600">
                        {userLocation ? '📍 Location shared' : 'Private & confidential'}
                    </p>
                </div>
            </div>

            {/* Chat area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`max-w-[85%] rounded-2xl px-5 py-3 ${msg.role === 'user'
                                ? 'bg-primary-600 text-white'
                                : 'bg-white text-neutral-900 shadow-sm border border-neutral-200'
                                }`}
                        >
                            <p className="text-lg leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-primary-100' : 'text-neutral-500'}`}>
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Location request prompt */}
                {showLocationRequest && (
                    <div className="flex justify-center">
                        <Card className="p-6 bg-blue-50 border-2 border-blue-300 max-w-md">
                            <div className="text-center space-y-4">
                                <MapPin className="h-12 w-12 text-blue-600 mx-auto" />
                                <h3 className="font-bold text-lg mb-2">Share Your Location?</h3>
                                <p className="text-sm text-neutral-700">
                                    This helps me find services closest to you. Your location is private and only used to help you.
                                </p>
                                <div className="flex gap-3">
                                    <Button
                                        size="lg"
                                        onClick={handleShareLocation}
                                        disabled={isRequestingLocation}
                                        className="flex-1"
                                    >
                                        {isRequestingLocation ? (
                                            <>
                                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                                Getting location...
                                            </>
                                        ) : (
                                            <>
                                                <MapPin className="h-5 w-5 mr-2" />
                                                Share My Location
                                            </>
                                        )}
                                    </Button>
                                    <Button size="lg" variant="outline" onClick={() => setShowLocationRequest(false)}>
                                        Not now
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Nearby services list */}
                {nearbyServices.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="font-semibold text-lg">Nearest Services:</h3>
                        {nearbyServices.map((service, i) => (
                            <Card key={i} className="p-4 hover:shadow-lg transition-shadow">
                                <div className="flex items-start gap-3">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg">{service.name}</h4>
                                        <p className="text-sm text-neutral-600 mb-2">{service.location.address}</p>
                                        <div className="flex items-center gap-2 text-sm text-neutral-700">
                                            <MapPin className="h-4 w-4" />
                                            <span>{service.distance?.toFixed(1)} miles away</span>
                                        </div>
                                        {service.availability?.bedsAvailable && (
                                            <p className="text-sm text-green-700 font-semibold mt-1">
                                                {service.availability.bedsAvailable} beds available
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Button size="sm" asChild>
                                            <a
                                                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                                                    service.location.address
                                                )}&travelmode=walking`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Navigation2 className="h-4 w-4 mr-1" />
                                                Navigate
                                            </a>
                                        </Button>
                                        {service.contact?.phone && (
                                            <Button size="sm" variant="outline" asChild>
                                                <a href={`tel:${service.contact.phone}`}>
                                                    <Phone className="h-4 w-4 mr-1" />
                                                    Call
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Loading indicator */}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white rounded-2xl px-5 py-3 shadow-sm border border-neutral-200">
                            <div className="flex gap-2">
                                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Voice controls */}
                <VoiceChatControls
                    onTranscript={handleTranscript}
                    onLanguageChange={setCurrentLanguage}
                    currentLanguage={currentLanguage}
                    lastMessage={messages.filter(m => m.role === 'assistant').slice(-1)[0]?.content}
                />

                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="bg-white border-t border-neutral-200 p-4">
                <div className="flex gap-3">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-3 text-lg border-2 border-neutral-300 rounded-xl focus:outline-none focus:border-primary-500"
                        disabled={isLoading}
                    />
                    <Button
                        size="lg"
                        onClick={handleSend}
                        disabled={!inputValue.trim() || isLoading}
                        className="px-6"
                    >
                        <Send className="h-5 w-5" />
                    </Button>
                </div>
                <p className="text-xs text-neutral-500 mt-2 text-center">
                    Your conversation is private and confidential
                </p>
            </div>
        </div>
    );
}