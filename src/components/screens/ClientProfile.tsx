import { User, MapPin, Calendar, FileText, Clock, MessageSquare, Phone, AlertCircle, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ServiceBadge } from '../ServiceBadge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';

interface ClientProfileProps {
  onBack?: () => void;
}

export function ClientProfile({ onBack }: ClientProfileProps) {
  const client = {
    name: 'John D.',
    alias: 'JD',
    age: 45,
    lastSeen: '2 hours ago',
    location: 'Union Square',
    priority: 'urgent' as const,
    consentGiven: true,
    preferredLanguage: 'Spanish',
  };

  const encounters = [
    {
      date: 'Nov 17, 2025 - 10:30 AM',
      worker: 'Maria R.',
      location: '14th St & 3rd Ave',
      needs: ['shelter', 'medical'] as const,
      notes: 'Persistent cough, needs immediate medical attention',
      status: 'pending',
    },
    {
      date: 'Nov 15, 2025 - 2:45 PM',
      worker: 'David L.',
      location: 'Union Square Park',
      needs: ['food', 'medical'] as const,
      notes: 'Provided meal voucher, referred to clinic',
      status: 'completed',
    },
    {
      date: 'Nov 12, 2025 - 9:15 AM',
      worker: 'Maria R.',
      location: 'Union Square Station',
      needs: ['shelter'] as const,
      notes: 'Refused shelter services at this time',
      status: 'refused',
    },
  ];

  const appointments = [
    {
      date: 'Nov 18, 2025 - 10:00 AM',
      provider: 'St. Vincent\'s Medical Clinic',
      type: 'Medical Checkup',
      status: 'confirmed',
    },
    {
      date: 'Nov 18, 2025 - 3:00 PM',
      provider: 'Safe Haven NYC',
      type: 'Shelter Intake',
      status: 'pending',
    },
  ];

  const aiRecommendations = [
    {
      service: 'Safe Haven NYC - East Village',
      category: 'shelter' as const,
      score: 95,
      reason: 'Closest shelter with Spanish-speaking staff',
    },
    {
      service: 'St. Vincent\'s Medical Clinic',
      category: 'medical' as const,
      score: 88,
      reason: 'Respiratory care specialists available',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl text-neutral-900">Client Profile</h1>
            </div>
            <Button variant="outline">
              <MessageSquare className="h-5 w-5 mr-2" />
              Send Message
            </Button>
            <Button>
              <Phone className="h-5 w-5 mr-2" />
              Contact Worker
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Client Info */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarFallback className="bg-primary-100 text-primary-700 text-2xl">
                    {client.alias}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl mb-1">{client.name}</h2>
                <Badge className={
                  client.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                    client.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                }>
                  {client.priority} priority
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Age</p>
                  <p>{client.age} years old (approximate)</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Last Seen</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <p>{client.lastSeen}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Last Location</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <p>{client.location}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Preferred Language</p>
                  <p>{client.preferredLanguage}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Consent Status</p>
                  <div className="flex items-center gap-2">
                    {client.consentGiven ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <p className="text-green-600">Consent given</p>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-600" />
                        <p className="text-red-600">No consent</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* AI Recommendations */}
            <Card className="p-6 bg-purple-50 border-purple-200">
              <h3 className="mb-4 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                AI Recommendations
              </h3>
              <div className="space-y-3">
                {aiRecommendations.map((rec, i) => (
                  <div key={i} className="bg-white rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <ServiceBadge category={rec.category} size="sm" />
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        {rec.score}% match
                      </Badge>
                    </div>
                    <p className="text-sm mb-1">{rec.service}</p>
                    <p className="text-xs text-neutral-600">{rec.reason}</p>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline">
                View All Matches
              </Button>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="timeline" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              {/* Timeline */}
              <TabsContent value="timeline" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-xl mb-4">Encounter History</h3>
                  <div className="space-y-4">
                    {encounters.map((encounter, i) => (
                      <div key={i} className="relative pl-8 pb-6 border-l-2 border-neutral-200 last:border-0 last:pb-0">
                        <div className={`absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white ${encounter.status === 'completed' ? 'bg-green-500' :
                            encounter.status === 'pending' ? 'bg-orange-500' :
                              encounter.status === 'refused' ? 'bg-red-500' :
                                'bg-neutral-300'
                          }`} />
                        <div className="bg-white rounded-lg p-4 border border-neutral-200">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-sm text-neutral-600">{encounter.date}</p>
                              <p className="text-sm">Worker: <strong>{encounter.worker}</strong></p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {encounter.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-4 w-4 text-neutral-600" />
                            <p className="text-sm">{encounter.location}</p>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {encounter.needs.map((need) => (
                              <ServiceBadge key={need} category={need} size="sm" />
                            ))}
                          </div>
                          <p className="text-sm text-neutral-700">{encounter.notes}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Appointments */}
              <TabsContent value="appointments" className="space-y-4">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl">Upcoming Appointments</h3>
                    <Button>
                      <Calendar className="h-4 w-4 mr-2" />
                      Book New
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {appointments.map((apt, i) => (
                      <Card key={i} className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="h-4 w-4 text-primary-600" />
                              <p>{apt.date}</p>
                            </div>
                            <p className="text-lg">{apt.provider}</p>
                            <p className="text-sm text-neutral-600">{apt.type}</p>
                          </div>
                          <Badge className={
                            apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                              'bg-orange-100 text-orange-700'
                          }>
                            {apt.status}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">Send Reminder</Button>
                          <Button size="sm" variant="outline" className="text-red-600">Cancel</Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Documents */}
              <TabsContent value="documents" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-xl mb-4">Uploaded Documents</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="p-4 text-center">
                        <FileText className="h-12 w-12 text-neutral-400 mx-auto mb-2" />
                        <p className="text-sm">Document {i}</p>
                        <p className="text-xs text-neutral-600">Uploaded Nov {17 - i}</p>
                        <Button size="sm" variant="outline" className="mt-2 w-full">
                          View
                        </Button>
                      </Card>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Notes */}
              <TabsContent value="notes" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-xl mb-4">Case Notes</h3>
                  <div className="space-y-4">
                    <textarea
                      className="w-full min-h-32 p-3 border border-neutral-300 rounded-lg"
                      placeholder="Add case notes..."
                    />
                    <Button>Save Note</Button>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
