// API Service for communicating with the backend
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { supabase } from '../utils/supabase/client';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-1a012ab1`;

// Get current access token from Supabase auth
async function getAccessToken(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || publicAnonKey;
}

// Generic API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAccessToken();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    console.error(`API request failed for ${endpoint}:`, error);
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  
  return response.json();
}

// ============================================
// Authentication API
// ============================================

export interface SignupData {
  email: string;
  password: string;
  role: 'field-worker' | 'case-manager' | 'program-manager';
  name: string;
  phone?: string;
}

export async function signup(data: SignupData) {
  return apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function sendOTP(email: string) {
  return apiRequest('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function getProfile() {
  return apiRequest('/auth/profile');
}

// ============================================
// Client API
// ============================================

export interface Client {
  id?: string;
  firstName: string;
  lastName?: string;
  age?: number;
  gender?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  needs?: string[];
  notes?: string;
  photoUrl?: string;
  language?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function createClient(client: Client) {
  return apiRequest<{ success: boolean; client: Client }>('/clients', {
    method: 'POST',
    body: JSON.stringify(client),
  });
}

export async function getClients() {
  return apiRequest<{ clients: Client[] }>('/clients');
}

export async function getClient(id: string) {
  return apiRequest<{ client: Client }>(`/clients/${id}`);
}

export async function updateClient(id: string, updates: Partial<Client>) {
  return apiRequest<{ success: boolean; client: Client }>(`/clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

// ============================================
// Encounter API
// ============================================

export interface Encounter {
  id?: string;
  clientId: string;
  type: 'initial' | 'follow-up' | 'service-delivery' | 'check-in';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  notes: string;
  assessment?: {
    medical?: string[];
    housing?: string;
    mentalHealth?: string[];
    other?: string;
  };
  verbalConsent?: boolean;
  verbalConsentAudioUrl?: string;
  photoUrls?: string[];
  fieldWorkerId?: string;
  createdAt?: string;
}

export async function createEncounter(encounter: Encounter) {
  return apiRequest<{ success: boolean; encounter: Encounter }>('/encounters', {
    method: 'POST',
    body: JSON.stringify(encounter),
  });
}

export async function getEncountersForClient(clientId: string) {
  return apiRequest<{ encounters: Encounter[] }>(`/encounters/client/${clientId}`);
}

// ============================================
// Case API
// ============================================

export interface Case {
  id?: string;
  clientId: string;
  status: 'open' | 'in-progress' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedServices?: string[];
  notes?: string;
  caseManagerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function createCase(caseData: Case) {
  return apiRequest<{ success: boolean; case: Case }>('/cases', {
    method: 'POST',
    body: JSON.stringify(caseData),
  });
}

export async function getCases() {
  return apiRequest<{ cases: Case[] }>('/cases');
}

// ============================================
// File Upload API
// ============================================

export async function uploadFile(
  file: File,
  bucket: 'outreach-files' | 'audio-consents' = 'outreach-files'
): Promise<{ success: boolean; url: string; path: string }> {
  const token = await getAccessToken();
  
  // Convert file to base64
  const reader = new FileReader();
  const fileData = await new Promise<string>((resolve) => {
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
  
  return apiRequest('/upload', {
    method: 'POST',
    body: JSON.stringify({
      file: fileData,
      fileName: file.name,
      fileType: file.type,
      bucket,
    }),
  });
}
