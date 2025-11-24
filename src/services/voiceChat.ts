/**
 * Voice Chat Service - Speech-to-Text and Text-to-Speech
 * Uses Web Speech API (free, built into browsers)
 */

// Language configurations for multilingual support
export const SUPPORTED_LANGUAGES = {
    'en-US': { name: 'English', flag: '🇺🇸', voice: 'en-US' },
    'es-ES': { name: 'Español', flag: '🇪🇸', voice: 'es-ES' },
    'zh-CN': { name: '中文', flag: '🇨🇳', voice: 'zh-CN' },
    'ar-SA': { name: 'العربية', flag: '🇸🇦', voice: 'ar-SA' },
    'ru-RU': { name: 'Русский', flag: '🇷🇺', voice: 'ru-RU' },
    'ht-HT': { name: 'Kreyòl', flag: '🇭🇹', voice: 'fr-FR' }, // Haitian Creole uses French voice
    'fr-FR': { name: 'Français', flag: '🇫🇷', voice: 'fr-FR' },
    'bn-BD': { name: 'বাংলা', flag: '🇧🇩', voice: 'bn-BD' },
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

/**
 * Speech Recognition Service (Speech-to-Text)
 */
export class SpeechRecognitionService {
    private recognition: any;
    private isListening = false;
    private language: LanguageCode;
    private onResult: (transcript: string, isFinal: boolean) => void;
    private onError: (error: string) => void;

    constructor(
        language: LanguageCode = 'en-US',
        onResult: (transcript: string, isFinal: boolean) => void,
        onError: (error: string) => void
    ) {
        this.language = language;
        this.onResult = onResult;
        this.onError = onError;

        // Check if browser supports speech recognition
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            this.onError('Speech recognition not supported in this browser');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.setup();
    }

    private setup() {
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = this.language;
        this.recognition.maxAlternatives = 1;

        this.recognition.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }

            if (finalTranscript) {
                this.onResult(finalTranscript.trim(), true);
            } else if (interimTranscript) {
                this.onResult(interimTranscript.trim(), false);
            }
        };

        this.recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            this.onError(`Speech recognition error: ${event.error}`);
            this.isListening = false;
        };

        this.recognition.onend = () => {
            this.isListening = false;
        };
    }

    start() {
        if (!this.recognition) return;

        try {
            this.recognition.start();
            this.isListening = true;
        } catch (error) {
            console.error('Error starting recognition:', error);
            this.onError('Could not start speech recognition');
        }
    }

    stop() {
        if (!this.recognition) return;

        try {
            this.recognition.stop();
            this.isListening = false;
        } catch (error) {
            console.error('Error stopping recognition:', error);
        }
    }

    setLanguage(language: LanguageCode) {
        this.language = language;
        if (this.recognition) {
            this.recognition.lang = language;
        }
    }

    getIsListening() {
        return this.isListening;
    }
}

/**
 * Text-to-Speech Service
 */
export class TextToSpeechService {
    private synth: SpeechSynthesis;
    private currentUtterance: SpeechSynthesisUtterance | null = null;
    private language: LanguageCode;
    private isSpeaking = false;

    constructor(language: LanguageCode = 'en-US') {
        this.synth = window.speechSynthesis;
        this.language = language;
    }

    speak(text: string, onEnd?: () => void) {
        // Stop any current speech
        this.stop();

        // Clean text for better speech (remove emojis and markdown)
        const cleanText = this.cleanTextForSpeech(text);

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = SUPPORTED_LANGUAGES[this.language].voice;
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Try to find a voice for the language
        const voices = this.synth.getVoices();
        const voice = voices.find(v => v.lang.startsWith(this.language.split('-')[0]));
        if (voice) {
            utterance.voice = voice;
        }

        utterance.onend = () => {
            this.isSpeaking = false;
            if (onEnd) onEnd();
        };

        utterance.onerror = (error) => {
            console.error('Speech synthesis error:', error);
            this.isSpeaking = false;
        };

        this.currentUtterance = utterance;
        this.isSpeaking = true;
        this.synth.speak(utterance);
    }

    stop() {
        if (this.synth.speaking) {
            this.synth.cancel();
        }
        this.isSpeaking = false;
        this.currentUtterance = null;
    }

    setLanguage(language: LanguageCode) {
        this.language = language;
    }

    getIsSpeaking() {
        return this.isSpeaking;
    }

    private cleanTextForSpeech(text: string): string {
        return text
            // Remove emojis
            .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
            .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
            .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
            .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '')
            .replace(/[\u{2600}-\u{26FF}]/gu, '')
            .replace(/[\u{2700}-\u{27BF}]/gu, '')
            // Remove markdown formatting
            .replace(/\*\*/g, '')
            .replace(/\*/g, '')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
            .replace(/`([^`]+)`/g, '$1') // Code
            .replace(/#+\s/g, '') // Headers
            // Remove action buttons text
            .replace(/\[Navigate\]/g, '')
            .replace(/\[Call\]/g, '')
            .replace(/\[Get Directions\]/g, '')
            // Clean up extra whitespace
            .replace(/\s+/g, ' ')
            .trim();
    }
}

/**
 * Detect language from text (simple heuristic)
 */
export function detectLanguage(text: string): LanguageCode {
    // Check for specific character sets
    if (/[\u4e00-\u9fa5]/.test(text)) return 'zh-CN'; // Chinese
    if (/[\u0600-\u06FF]/.test(text)) return 'ar-SA'; // Arabic
    if (/[\u0400-\u04FF]/.test(text)) return 'ru-RU'; // Russian (Cyrillic)
    if (/[\u0980-\u09FF]/.test(text)) return 'bn-BD'; // Bengali

    // Check for common Spanish words
    const spanishWords = ['hola', 'ayuda', 'necesito', 'gracias', 'por favor', 'comida', 'refugio'];
    const lowerText = text.toLowerCase();
    if (spanishWords.some(word => lowerText.includes(word))) return 'es-ES';

    // Check for common French words
    const frenchWords = ['bonjour', 'aide', 'besoin', 'merci', 'nourriture', 'abri'];
    if (frenchWords.some(word => lowerText.includes(word))) return 'fr-FR';

    // Default to English
    return 'en-US';
}

/**
 * Get greeting message in different languages
 */
export function getGreeting(language: LanguageCode): string {
    const greetings: Record<LanguageCode, string> = {
        'en-US': "Hi, I'm here to help you. What do you need? 💙",
        'es-ES': "Hola, estoy aquí para ayudarte. ¿Qué necesitas? 💙",
        'zh-CN': "你好，我在这里帮助你。你需要什么？💙",
        'ar-SA': "مرحبا، أنا هنا لمساعدتك. ماذا تحتاج؟ 💙",
        'ru-RU': "Привет, я здесь, чтобы помочь вам. Что вам нужно? 💙",
        'ht-HT': "Bonjou, mwen la pou ede w. Kisa w bezwen? 💙",
        'fr-FR': "Bonjour, je suis là pour vous aider. De quoi avez-vous besoin? 💙",
        'bn-BD': "হ্যালো, আমি আপনাকে সাহায্য করতে এখানে আছি। আপনার কি প্রয়োজন? 💙",
    };

    return greetings[language] || greetings['en-US'];
}
