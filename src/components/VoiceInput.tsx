import { Mic, Square, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';

interface VoiceInputProps {
  onTranscriptComplete?: (transcript: string) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function VoiceInput({ onTranscriptComplete, isOpen, onOpenChange }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartRecording = () => {
    setIsRecording(true);
    setTranscript('');
    // Simulate recording - in real app, this would use Web Speech API or Whisper
    setTimeout(() => {
      setIsRecording(false);
      setIsProcessing(true);
      setTimeout(() => {
        const mockTranscript = "Male, approximately 45 years old, located near Union Square. Needs shelter placement and medical attention for a persistent cough. Has been sleeping outdoors for 3 weeks. Interested in detox services. Spanish speaking.";
        setTranscript(mockTranscript);
        setIsProcessing(false);
        onTranscriptComplete?.(mockTranscript);
      }, 1500);
    }, 3000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Voice Dictation</DialogTitle>
          <DialogDescription>
            Record your notes using voice input. The audio will be transcribed automatically.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Recording indicator */}
          <div className="flex flex-col items-center py-8">
            {isRecording ? (
              <>
                <div className="relative">
                  <div className="absolute inset-0 w-24 h-24 bg-red-500/30 rounded-full animate-ping" />
                  <Button
                    size="icon"
                    className="relative w-24 h-24 rounded-full bg-red-500 hover:bg-red-600"
                    onClick={handleStopRecording}
                  >
                    <Square className="h-10 w-10 fill-white" />
                  </Button>
                </div>
                <p className="mt-4 text-red-600">Recording in progress...</p>
                <p className="text-sm text-neutral-600">Tap to stop</p>
              </>
            ) : isProcessing ? (
              <>
                <Loader2 className="h-24 w-24 text-primary-500 animate-spin" />
                <p className="mt-4">Processing audio...</p>
              </>
            ) : (
              <>
                <Button
                  size="icon"
                  className="w-24 h-24 rounded-full bg-primary-500 hover:bg-primary-600"
                  onClick={handleStartRecording}
                >
                  <Mic className="h-10 w-10" />
                </Button>
                <p className="mt-4">Tap to start recording</p>
              </>
            )}
          </div>

          {/* Transcript preview */}
          {transcript && (
            <Alert>
              <AlertDescription>
                <h4 className="mb-2">Transcript:</h4>
                <p className="text-sm">{transcript}</p>
              </AlertDescription>
            </Alert>
          )}

          {/* Tips */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="text-sm mb-2">💡 Tips for voice input:</h4>
            <ul className="text-xs space-y-1 text-neutral-700">
              <li>• Speak clearly and at a normal pace</li>
              <li>• Include key details: location, needs, demographics</li>
              <li>• Mention language preferences</li>
              <li>• Note any urgent medical concerns</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
