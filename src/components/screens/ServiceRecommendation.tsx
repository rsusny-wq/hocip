import { useState } from 'react';
import { MapPin, Clock, DollarSign, Phone, ArrowRight, ThumbsUp, Edit3, Navigation, ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { ServiceBadge } from '../ServiceBadge';
import { Progress } from '../ui/progress';
import { Textarea } from '../ui/textarea';
import { generateServiceRecommendations } from '../../services/gemini';
import { isGeminiConfigured } from '../../config/api';

interface ServiceRecommendationProps {
  onBook?: (providerId: string) => void;
  onOverride?: () => void;
  onBack?: () => void;
}

export function ServiceRecommendation({ onBook, onOverride, onBack }: ServiceRecommendationProps) {
  const [aiInsights, setAiInsights] = useState<string>('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [clientNotes, setClientNotes] = useState('Client has persistent cough, needs shelter, speaks Spanish');

  const getAIRecommendations = async () => {
    setIsLoadingAI(true);
    try {
      const result = await generateServiceRecommendations(
        clientNotes,
        'Manhattan location, urgent needs'
      );
      if (result.success) {
        setAiInsights(result.text);
      }
    } catch (error) {
      console.error('AI error:', error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const recommendations = [
    {
      id: '1',
      name: 'Safe Haven NYC - East Village',
      category: 'shelter' as const,
      matchScore: 95,
      distance: 0.3,
      bedsAvailable: 12,
      estimatedArrival: '5 min walk',
      reason: 'Closest shelter with immediate availability. Spanish-speaking staff on duty. Medical care available on-site.',
      cost: 'free' as const,
      phone: '(212) 555-0147',
      hours: '24/7',
      languages: ['English', 'Spanish'],
    },
    {
      id: '2',
      name: 'St. Vincent\'s Medical Clinic',
      category: 'medical' as const,
      matchScore: 88,
      distance: 0.5,
      estimatedArrival: '8 min walk',
      reason: 'Walk-in clinic with respiratory care specialists. Can address persistent cough. Bilingual services.',
      cost: 'free' as const,
      phone: '(212) 555-0289',
      hours: 'Mon-Fri 8am-6pm',
      languages: ['English', 'Spanish', 'Mandarin'],
    },
    {
      id: '3',
      name: 'Phoenix House Detox Center',
      category: 'detox' as const,
      matchScore: 82,
      distance: 1.2,
      estimatedArrival: '15 min walk',
      reason: 'Comprehensive detox services with same-day intake. Integrates with shelter placement.',
      cost: 'insurance' as const,
      phone: '(212) 555-0356',
      hours: '24/7',
      languages: ['English', 'Spanish'],
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-background border-b border-border p-4">
        <div className="flex items-center gap-3 mb-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 flex items-center justify-between">
            <h1 className="text-xl">AI Service Recommendations</h1>
            <Badge className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              {isGeminiConfigured() ? 'AI Powered' : 'Mock AI'}
            </Badge>
          </div>
        </div>
        <p className="text-sm opacity-70 ml-12">Based on client needs and real-time availability</p>
      </div>

      {/* AI Insights Panel */}
      <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-b border-border">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-1" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Gemini AI Insights</h3>
              <Button 
                size="sm" 
                onClick={getAIRecommendations}
                disabled={isLoadingAI}
                variant="outline"
              >
                {isLoadingAI ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Get AI Analysis
                  </>
                )}
              </Button>
            </div>
            {!isGeminiConfigured() && (
              <p className="text-sm opacity-70 mb-2">
                💡 Add your Gemini API key in <code className="bg-black/10 dark:bg-white/10 px-1 rounded">/config/api.ts</code> for real AI recommendations
              </p>
            )}
            {aiInsights && (
              <Card className="p-3 mt-2">
                <pre className="text-sm whitespace-pre-wrap opacity-80">{aiInsights}</pre>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {recommendations.map((rec, index) => (
          <Card key={rec.id} className="p-4 relative overflow-hidden">
            {/* Match score indicator */}
            <div className="absolute top-0 right-0 bg-gradient-to-l from-green-500 to-transparent h-full w-24 opacity-10" 
                 style={{ width: `${rec.matchScore}%` }} />
            
            <div className="relative">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-green-100 text-green-700">
                      #{index + 1} Match
                    </Badge>
                    <ServiceBadge category={rec.category} size="sm" />
                  </div>
                  <h3 className="text-lg">{rec.name}</h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl text-green-600">{rec.matchScore}%</div>
                  <p className="text-xs text-neutral-600">Match</p>
                </div>
              </div>

              {/* Match reason */}
              <div className="bg-blue-50 rounded-lg p-3 mb-3">
                <p className="text-sm text-blue-900">
                  <strong>Why this match:</strong> {rec.reason}
                </p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-neutral-600" />
                  <span>{rec.distance} mi away</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Navigation className="h-4 w-4 text-neutral-600" />
                  <span>{rec.estimatedArrival}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-neutral-600" />
                  <span>{rec.hours}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-neutral-600" />
                  <span className="capitalize">{rec.cost}</span>
                </div>
              </div>

              {/* Availability */}
              {rec.bedsAvailable && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-neutral-600">Availability</span>
                    <span className="font-medium text-green-600">{rec.bedsAvailable} beds available</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              )}

              {/* Languages */}
              <div className="flex flex-wrap gap-1 mb-3">
                {rec.languages.map((lang) => (
                  <Badge key={lang} variant="outline" className="text-xs">
                    {lang}
                  </Badge>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  className="flex-1 h-12 tap-target bg-primary-500 hover:bg-primary-600"
                  onClick={() => onBook?.(rec.id)}
                >
                  <ThumbsUp className="h-5 w-5 mr-2" />
                  Book Service
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 tap-target">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 tap-target">
                  <MapPin className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {/* Human Override */}
        <Card className="p-4 border-2 border-dashed border-neutral-300">
          <div className="text-center mb-3">
            <Edit3 className="h-8 w-8 text-neutral-600 mx-auto mb-2" />
            <h3 className="text-lg">Human Override</h3>
            <p className="text-sm text-neutral-600">
              Don't agree with AI recommendations? Choose a different service or add notes.
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full h-12 tap-target"
            onClick={onOverride}
          >
            Search All Services
          </Button>
        </Card>

        {/* Notes */}
        <Card className="p-4">
          <h4 className="mb-2">Add Notes</h4>
          <Textarea
            placeholder="Any special considerations or instructions for case manager..."
            className="min-h-24"
          />
        </Card>

        {/* Bottom action */}
        <Button className="w-full h-14 tap-target bg-green-600 hover:bg-green-700 text-white">
          <ArrowRight className="h-5 w-5 mr-2" />
          Submit to Case Manager Queue
        </Button>
      </div>
    </div>
  );
}
