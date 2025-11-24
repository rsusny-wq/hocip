import { useState, useEffect } from 'react';
import { Camera, Mic, MapPin, Save, X, Home, Heart, Utensils, CreditCard, UserX, Sparkles, Loader2, Edit, Volume2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { VoiceInput } from '../VoiceInput';
import { AudioRecorder } from '../AudioRecorder';
import { RealMapView } from '../RealMapView';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import type { ServiceCategory } from '../../types';
import { extractEncounterData } from '../../services/gemini';
import { isGeminiConfigured } from '../../config/api';
import { createEncounter, uploadFile } from '../../services/api';

interface EncounterLoggingProps {
  onSave?: () => void;
  onCancel?: () => void;
  clientId?: string;
}

export function EncounterLogging({ onSave, onCancel, clientId }: EncounterLoggingProps) {
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [audioRecorderOpen, setAudioRecorderOpen] = useState(false);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [selectedNeeds, setSelectedNeeds] = useState<ServiceCategory[]>([]);
  const [transcript, setTranscript] = useState('');
  const [photosTaken, setPhotosTaken] = useState(0);
  const [notes, setNotes] = useState('');
  const [aiExtraction, setAiExtraction] = useState('');
  const [isExtractingAI, setIsExtractingAI] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [language, setLanguage] = useState('English');
  const [address, setAddress] = useState('14th Street & 3rd Avenue, East Village, Manhattan');
  const [location, setLocation] = useState({ lat: 40.7321, lng: -73.9874 });
  const [verbalConsent, setVerbalConsent] = useState(false);
  const [verbalConsentAudioUrl, setVerbalConsentAudioUrl] = useState('');
  const [otherAssessment, setOtherAssessment] = useState('');
  
  // Voice dictation for notes
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = 'en-US';

      recog.onresult = (event: any) => {
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
          setNotes(prev => prev + finalTranscript);
        }
      };

      recog.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      setRecognition(recog);
    }
  }, []);

  const toggleVoiceDictation = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const extractWithAI = async () => {
    if (!notes.trim()) return;
    
    setIsExtractingAI(true);
    try {
      const result = await extractEncounterData(notes);
      if (result.success) {
        setAiExtraction(result.text);
      }
    } catch (error) {
      console.error('AI extraction error:', error);
    } finally {
      setIsExtractingAI(false);
    }
  };

  const quickButtons = [
    { icon: Home, label: 'Wants Shelter', need: 'shelter' as ServiceCategory, color: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800' },
    { icon: Heart, label: 'Needs Medical', need: 'medical' as ServiceCategory, color: 'bg-pink-100 text-pink-700 border-pink-300 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-800' },
    { icon: CreditCard, label: 'Lost ID', need: 'id-services' as ServiceCategory, color: 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800' },
    { icon: Utensils, label: 'Needs Food', need: 'food' as ServiceCategory, color: 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800' },
    { icon: UserX, label: 'Refused Help', need: null, color: 'bg-neutral-100 text-neutral-700 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700' },
  ];

  const toggleNeed = (need: ServiceCategory | null) => {
    if (!need) return;
    setSelectedNeeds(prev =>
      prev.includes(need) ? prev.filter(n => n !== need) : [...prev, need]
    );
  };

  const handlePhotoCapture = () => {
    // In a real app, this would open the camera
    setPhotosTaken(prev => prev + 1);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const encounterData = {
        clientId: clientId || `new-client-${Date.now()}`,
        type: 'initial' as const,
        location: {
          lat: location.lat,
          lng: location.lng,
          address: address,
        },
        notes: notes + (transcript ? `\n\nVoice Transcript: ${transcript}` : ''),
        assessment: {
          medical: selectedNeeds.includes('medical') ? ['Needs assessment'] : [],
          housing: selectedNeeds.includes('shelter') ? 'emergency' : undefined,
          mentalHealth: [],
          other: otherAssessment || undefined,
        },
        verbalConsent,
        verbalConsentAudioUrl,
      };

      await createEncounter(encounterData);
      alert('Encounter saved successfully!');
      
      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save encounter. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-background border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl">Log Encounter</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">{address}</p>
          </div>
        </div>
        <Button onClick={handleSave} className="tap-target" disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          ) : (
            <Save className="h-5 w-5 mr-2" />
          )}
          Save
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Location - Now Editable with Real Map */}
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="address">Location Address</Label>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setMapDialogOpen(true)}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Select on Map
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter street address..."
                className="flex-1"
              />
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
            </p>
          </div>
        </Card>

        {/* Voice Input */}
        <Card className="p-4">
          <h3 className="mb-3">Voice Dictation</h3>
          <Button
            className="w-full h-14 tap-target bg-primary-500 hover:bg-primary-600"
            onClick={() => setVoiceOpen(true)}
          >
            <Mic className="h-6 w-6 mr-2" />
            Start Voice Input
          </Button>
          {transcript && (
            <Alert className="mt-3 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
              <AlertDescription className="text-sm">
                <strong>Transcribed:</strong> {transcript}
              </AlertDescription>
            </Alert>
          )}
        </Card>

        {/* Quick Assessment */}
        <Card className="p-4">
          <h3 className="mb-3">Quick Assessment</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickButtons.map((button) => {
              const Icon = button.icon;
              const isSelected = button.need && selectedNeeds.includes(button.need);
              return (
                <Button
                  key={button.label}
                  variant="outline"
                  className={`h-20 flex-col tap-target border-2 ${
                    isSelected ? button.color : 'bg-white dark:bg-neutral-900'
                  }`}
                  onClick={() => toggleNeed(button.need)}
                >
                  <Icon className="h-6 w-6 mb-2" />
                  <span className="text-sm text-center">{button.label}</span>
                </Button>
              );
            })}
          </div>
          
          {/* "Other" Option */}
          <div className="mt-4 space-y-2">
            <Label htmlFor="other-assessment">Other Assessment Notes</Label>
            <Input
              id="other-assessment"
              placeholder="Describe other needs or observations..."
              value={otherAssessment}
              onChange={(e) => setOtherAssessment(e.target.value)}
            />
          </div>
        </Card>

        {/* Basic Information */}
        <Card className="p-4 space-y-4">
          <h3>Basic Information (Optional)</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                placeholder="John" 
                className="h-12"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                placeholder="Doe" 
                className="h-12"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Approximate Age</Label>
            <Input 
              id="age" 
              type="number" 
              placeholder="45" 
              className="h-12"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Preferred Language</Label>
            <select 
              className="w-full h-12 px-3 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option>English</option>
              <option>Spanish</option>
              <option>Mandarin</option>
              <option>Arabic</option>
              <option>Russian</option>
              <option>Haitian Creole</option>
            </select>
          </div>
        </Card>

        {/* Photos */}
        <Card className="p-4">
          <h3 className="mb-3">Documentation</h3>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full h-14 tap-target"
              onClick={handlePhotoCapture}
            >
              <Camera className="h-6 w-6 mr-2" />
              Capture Photo {photosTaken > 0 && `(${photosTaken})`}
            </Button>
            {photosTaken > 0 && (
              <div className="flex gap-2 flex-wrap">
                {[...Array(photosTaken)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-neutral-200 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                    <Camera className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Take photos of ID documents, medical notices, or relevant documentation
            </p>
          </div>
        </Card>

        {/* Notes with Voice Dictation Speaker Icon */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3>Additional Notes</h3>
            <div className="flex gap-2">
              {/* Voice Dictation Toggle */}
              <Button
                size="sm"
                variant={isListening ? "default" : "outline"}
                onClick={toggleVoiceDictation}
                className={isListening ? "bg-red-500 hover:bg-red-600" : ""}
              >
                <Volume2 className={`h-4 w-4 mr-2 ${isListening ? 'animate-pulse' : ''}`} />
                {isListening ? 'Stop' : 'Dictate'}
              </Button>
              
              {/* AI Extraction */}
              <Button
                size="sm"
                variant="outline"
                onClick={extractWithAI}
                disabled={isExtractingAI || !notes.trim()}
              >
                {isExtractingAI ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Extract with AI
                  </>
                )}
              </Button>
            </div>
          </div>
          <Textarea
            placeholder="Any additional observations, concerns, or context... (Use the 'Dictate' button for voice input)"
            className="min-h-32"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          {isListening && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Listening... Speak now
            </p>
          )}
          {!isGeminiConfigured() && (
            <p className="text-xs opacity-70 mt-2">
              💡 Add Gemini API key in <code className="bg-black/10 dark:bg-white/10 px-1 rounded">/config/api.ts</code> for AI extraction
            </p>
          )}
        </Card>

        {/* AI Extraction Results */}
        {aiExtraction && (
          <Card className="p-4 bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h3>Gemini AI Extracted Information</h3>
            </div>
            <div className="whitespace-pre-wrap text-sm opacity-90">
              {aiExtraction}
            </div>
          </Card>
        )}

        {/* Verbal Consent with Audio Recording */}
        <Card className="p-4 border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <input 
                type="checkbox" 
                className="mt-1 h-5 w-5"
                checked={verbalConsent}
                onChange={(e) => setVerbalConsent(e.target.checked)}
              />
              <div className="text-sm flex-1">
                <p className="font-medium text-orange-900 dark:text-orange-200">Verbal consent obtained</p>
                <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                  I have informed the individual about data collection and they have consented to receive services
                </p>
              </div>
            </div>
            
            {/* Audio Recording Option */}
            <div>
              <Button
                variant="outline"
                onClick={() => setAudioRecorderOpen(true)}
                className="w-full"
              >
                <Mic className="h-4 w-4 mr-2" />
                {verbalConsentAudioUrl ? 'Update Recording' : 'Record Verbal Consent'}
              </Button>
              {verbalConsentAudioUrl && (
                <p className="text-xs text-green-700 dark:text-green-300 mt-2 flex items-center gap-2">
                  ✓ Audio consent recorded
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Voice Input Modal */}
      <VoiceInput
        isOpen={voiceOpen}
        onOpenChange={setVoiceOpen}
        onTranscriptComplete={setTranscript}
      />

      {/* Audio Recorder Modal */}
      <Dialog open={audioRecorderOpen} onOpenChange={setAudioRecorderOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Record Verbal Consent</DialogTitle>
            <DialogDescription>
              Record the client's verbal consent to document their agreement to receive services.
            </DialogDescription>
          </DialogHeader>
          <AudioRecorder
            onRecordingComplete={(url) => {
              setVerbalConsentAudioUrl(url);
              setVerbalConsent(true);
              setAudioRecorderOpen(false);
            }}
            maxDuration={120} // 2 minutes max
          />
        </DialogContent>
      </Dialog>

      {/* Map Selection Dialog */}
      <Dialog open={mapDialogOpen} onOpenChange={setMapDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Select Location</DialogTitle>
            <DialogDescription>
              Click on the map to select the encounter location, or use "My Location" to get your current position.
            </DialogDescription>
          </DialogHeader>
          <RealMapView
            center={location}
            markers={[{ ...location, label: 'Current Location', color: '#3B82F6' }]}
            height="500px"
            allowLocationSelection={true}
            showCurrentLocation={true}
            onLocationSelect={(newLocation) => {
              setLocation({ lat: newLocation.lat, lng: newLocation.lng });
              if (newLocation.address) {
                setAddress(newLocation.address);
              }
            }}
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setMapDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setMapDialogOpen(false)}>
              Confirm Location
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
