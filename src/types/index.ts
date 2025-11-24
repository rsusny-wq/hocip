// HOCI Platform Types

export type UserRole = 'outreach' | 'case-manager' | 'program-manager' | 'service-provider' | 'admin';

export type Language = 'en' | 'es' | 'zh' | 'ar' | 'ru' | 'ht';

export type ServiceCategory = 'shelter' | 'medical' | 'food' | 'id-services' | 'detox' | 'mental-health' | 'legal' | 'employment';

export type EncounterStatus = 'pending' | 'contacted' | 'booked' | 'completed' | 'refused' | 'no-show';

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'missed' | 'cancelled';

export interface Client {
  id: string;
  firstName?: string;
  lastName?: string;
  alias?: string;
  age?: number;
  lastSeen: Date;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  needs: ServiceCategory[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  consentGiven: boolean;
  photoUrl?: string;
  notes?: string;
}

export interface Encounter {
  id: string;
  clientId?: string;
  workerId: string;
  timestamp: Date;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  needs: ServiceCategory[];
  status: EncounterStatus;
  notes?: string;
  voiceTranscript?: string;
  photos?: string[];
  aiRecommendations?: ServiceRecommendation[];
}

export interface ServiceProvider {
  id: string;
  name: string;
  category: ServiceCategory;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  distance?: number;
  availability: {
    beds?: number;
    bedsAvailable?: number;
    appointmentSlots?: Date[];
  };
  contact: {
    phone?: string;
    email?: string;
  };
  hours?: string;
  cost?: 'free' | 'low-cost' | 'insurance';
  languages?: Language[];
  accessibility?: string[];
}

export interface ServiceRecommendation {
  provider: ServiceProvider;
  matchScore: number;
  reason: string;
  estimatedArrival?: string;
  aiGenerated: boolean;
}

export interface Appointment {
  id: string;
  clientId: string;
  providerId: string;
  scheduledFor: Date;
  status: AppointmentStatus;
  createdBy: string;
  notes?: string;
  remindersSent: number;
}

export interface OutreachRoute {
  id: string;
  workerId: string;
  date: Date;
  hotspots: Array<{
    lat: number;
    lng: number;
    priority: number;
    predictedCount?: number;
  }>;
  completed: boolean;
}

export interface Analytics {
  period: string;
  totalContacts: number;
  placements: {
    shelter: number;
    detox: number;
    medical: number;
    total: number;
  };
  missedFollowUpRate: number;
  avgTimeToPlacement: number;
  weatherImpact?: string;
  byBorough?: Record<string, number>;
}
