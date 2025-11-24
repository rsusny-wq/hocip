import { useState, useRef } from 'react';
import { Mic, Square, Play, Pause, Trash2, Download, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { uploadFile } from '../services/api';

interface AudioRecorderProps {
  onRecordingComplete?: (audioUrl: string) => void;
  maxDuration?: number; // in seconds
}

export function AudioRecorder({ onRecordingComplete, maxDuration = 300 }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploading, setUploading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
        
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          if (prev >= maxDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check your browser permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      
      // Resume timer
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          if (prev >= maxDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const playAudio = () => {
    if (audioUrl && audioElementRef.current) {
      audioElementRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    }
  };

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setDuration(0);
    setIsPlaying(false);
    audioChunksRef.current = [];
  };

  const downloadRecording = () => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `verbal-consent-${Date.now()}.webm`;
      a.click();
    }
  };

  const uploadRecording = async () => {
    if (!audioUrl) return;

    setUploading(true);
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const file = new File([audioBlob], `verbal-consent-${Date.now()}.webm`, { type: 'audio/webm' });
      
      const { url } = await uploadFile(file, 'audio-consents');
      
      if (onRecordingComplete) {
        onRecordingComplete(url);
      }

      alert('Audio uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload audio. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Recording Controls */}
      <div className="flex flex-col items-center gap-4 p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
        {!audioUrl ? (
          <>
            {!isRecording ? (
              <Button
                size="lg"
                onClick={startRecording}
                className="w-24 h-24 rounded-full bg-red-500 hover:bg-red-600"
              >
                <Mic className="h-10 w-10" />
              </Button>
            ) : (
              <div className="relative">
                <div className="absolute inset-0 w-24 h-24 bg-red-500/30 rounded-full animate-ping" />
                <Button
                  size="lg"
                  onClick={stopRecording}
                  className="relative w-24 h-24 rounded-full bg-red-500 hover:bg-red-600"
                >
                  <Square className="h-10 w-10 fill-white" />
                </Button>
              </div>
            )}

            <div className="text-center">
              <div className="text-2xl mb-1">
                {formatTime(duration)}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                {isRecording ? (isPaused ? 'Paused' : 'Recording...') : 'Tap to start recording'}
              </div>
              {isRecording && (
                <div className="text-xs text-neutral-500 mt-1">
                  Max: {formatTime(maxDuration)}
                </div>
              )}
            </div>

            {isRecording && (
              <div className="flex gap-2">
                {!isPaused ? (
                  <Button onClick={pauseRecording} variant="outline" size="sm">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                ) : (
                  <Button onClick={resumeRecording} variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Playback Controls */}
            <audio
              ref={audioElementRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />

            <div className="flex gap-2">
              {!isPlaying ? (
                <Button onClick={playAudio} size="lg" className="rounded-full">
                  <Play className="h-6 w-6" />
                </Button>
              ) : (
                <Button onClick={pauseAudio} size="lg" variant="outline" className="rounded-full">
                  <Pause className="h-6 w-6" />
                </Button>
              )}
            </div>

            <div className="text-center">
              <div className="text-lg">Recording Ready</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Duration: {formatTime(duration)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button onClick={uploadRecording} disabled={uploading}>
                {uploading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  'Save Recording'
                )}
              </Button>
              
              <Button onClick={downloadRecording} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>

              <Button onClick={deleteRecording} variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>

              <Button onClick={() => { deleteRecording(); startRecording(); }} variant="ghost" size="sm">
                Re-record
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Instructions */}
      <Alert>
        <AlertDescription>
          <h4 className="mb-2">📋 Verbal Consent Recording Instructions:</h4>
          <ul className="text-sm space-y-1">
            <li>• Clearly state the purpose of the outreach and services</li>
            <li>• Ask for verbal consent to proceed</li>
            <li>• Record the client's affirmative response</li>
            <li>• Maximum recording time: {formatTime(maxDuration)}</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}
