/**
 * Voice Chat Controls Component
 * Provides microphone button, language selector, and voice/text toggle
 */

import { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import {
    SpeechRecognitionService,
    TextToSpeechService,
    SUPPORTED_LANGUAGES,
    LanguageCode,
    detectLanguage,
} from '../services/voiceChat';

interface VoiceChatControlsProps {
    onTranscript: (text: string) => void;
    onLanguageChange: (language: LanguageCode) => void;
    currentLanguage: LanguageCode;
    autoSpeak?: boolean;
    lastMessage?: string;
}

export function VoiceChatControls({
    onTranscript,
    onLanguageChange,
    currentLanguage,
    autoSpeak = true,
    lastMessage,
}: VoiceChatControlsProps) {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [interimTranscript, setInterimTranscript] = useState('');
    const [showLanguages, setShowLanguages] = useState(false);
    const [recognition, setRecognition] = useState<SpeechRecognitionService | null>(null);
    const [tts] = useState(() => new TextToSpeechService(currentLanguage));
    const [error, setError] = useState<string | null>(null);

    // Initialize speech recognition
    useEffect(() => {
        const rec = new SpeechRecognitionService(
            currentLanguage,
            (transcript: string, isFinal: boolean) => {
                if (isFinal) {
                    onTranscript(transcript);
                    setInterimTranscript('');
                    setIsListening(false);
                } else {
                    setInterimTranscript(transcript);
                }
            },
            (errorMsg: string) => {
                setError(errorMsg);
                setIsListening(false);
            }
        );
        setRecognition(rec);

        return () => {
            rec.stop();
        };
    }, [currentLanguage, onTranscript]);

    // Auto-speak AI responses
    useEffect(() => {
        if (autoSpeak && lastMessage && !isSpeaking) {
            tts.speak(lastMessage, () => setIsSpeaking(false));
            setIsSpeaking(true);
        }
    }, [lastMessage, autoSpeak, tts, isSpeaking]);

    const toggleListening = () => {
        if (!recognition) return;

        if (isListening) {
            recognition.stop();
            setIsListening(false);
            setInterimTranscript('');
        } else {
            // Stop speaking when starting to listen
            if (isSpeaking) {
                tts.stop();
                setIsSpeaking(false);
            }
            recognition.start();
            setIsListening(true);
            setError(null);
        }
    };

    const toggleSpeaking = () => {
        if (isSpeaking) {
            tts.stop();
            setIsSpeaking(false);
        } else if (lastMessage) {
            tts.speak(lastMessage, () => setIsSpeaking(false));
            setIsSpeaking(true);
        }
    };

    const handleLanguageSelect = (lang: LanguageCode) => {
        onLanguageChange(lang);
        tts.setLanguage(lang);
        setShowLanguages(false);
    };

    return (
        <div className="space-y-3">
            {/* Voice Controls */}
            <div className="flex gap-2">
                {/* Microphone Button */}
                <Button
                    size="lg"
                    onClick={toggleListening}
                    className={`flex-1 ${isListening
                        ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                        : 'bg-primary-600 hover:bg-primary-700'
                        }`}
                >
                    {isListening ? (
                        <>
                            <MicOff className="h-6 w-6 mr-2" />
                            Listening...
                        </>
                    ) : (
                        <>
                            <Mic className="h-6 w-6 mr-2" />
                            Tap to Talk
                        </>
                    )}
                </Button>

                {/* Speaker Toggle */}
                <Button
                    size="lg"
                    variant={isSpeaking ? 'default' : 'outline'}
                    onClick={toggleSpeaking}
                    className="px-4"
                >
                    {isSpeaking ? (
                        <Volume2 className="h-6 w-6 animate-pulse" />
                    ) : (
                        <VolumeX className="h-6 w-6" />
                    )}
                </Button>

                {/* Language Selector */}
                <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setShowLanguages(!showLanguages)}
                    className="px-4"
                >
                    <Globe className="h-6 w-6" />
                </Button>
            </div>

            {/* Interim Transcript */}
            {interimTranscript && (
                <Card className="p-3 bg-blue-50 border-blue-200">
                    <p className="text-sm text-neutral-700 italic">
                        {interimTranscript}...
                    </p>
                </Card>
            )}

            {/* Error Message */}
            {error && (
                <Card className="p-3 bg-red-50 border-red-200">
                    <p className="text-sm text-red-700">{error}</p>
                </Card>
            )}

            {/* Language Selector */}
            {showLanguages && (
                <Card className="p-4">
                    <h4 className="font-semibold mb-3">Select Language:</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
                            <Button
                                key={code}
                                variant={currentLanguage === code ? 'default' : 'outline'}
                                onClick={() => handleLanguageSelect(code as LanguageCode)}
                                className="justify-start"
                            >
                                <span className="mr-2">{lang.flag}</span>
                                {lang.name}
                            </Button>
                        ))}
                    </div>
                </Card>
            )}

            {/* Voice Mode Info */}
            <div className="text-center">
                <p className="text-xs text-neutral-500">
                    🎤 Voice mode active • {SUPPORTED_LANGUAGES[currentLanguage].flag}{' '}
                    {SUPPORTED_LANGUAGES[currentLanguage].name}
                </p>
            </div>
        </div>
    );
}
