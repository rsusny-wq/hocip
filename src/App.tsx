import { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import {
  Smartphone,
  Monitor,
  Palette,
  LayoutDashboard,
  User,
  TrendingUp,
  Building2
} from 'lucide-react';
import { ThemeToggle } from './components/ThemeToggle';
import { isGeminiConfigured } from './config/api';

// Mobile Screens
import { OutreachLogin } from './components/screens/OutreachLogin';
import { OutreachHome } from './components/screens/OutreachHome';
import { EncounterLogging } from './components/screens/EncounterLogging';
import { ServiceRecommendation } from './components/screens/ServiceRecommendation';

// Web Dashboard Screens
import { CaseManagerDashboard } from './components/screens/CaseManagerDashboard';
import { ClientProfile } from './components/screens/ClientProfile';
import { ProgramManagerDashboard } from './components/screens/ProgramManagerDashboard';
import { AlertManagement } from './components/screens/AlertManagement';
import { FieldWorkerNavigation } from './components/screens/FieldWorkerNavigation';

// Design System
import { DesignSystem } from './components/screens/DesignSystem';
import { LeafletMap } from './components/LeafletMap';
import { FloatingNavButton } from './components/FloatingNavButton';
import { serviceProviders } from './data/serviceProviders';

// Vulnerable User Screens
import { VulnerableUserHome } from './components/screens/VulnerableUserHome';
import { AIChat } from './components/screens/AIChat';
import { FindHelp } from './components/screens/FindHelp';
import { EmergencyAlert } from './components/screens/EmergencyAlert';
import { NavigationView } from './components/NavigationView';

type Screen =
  | 'navigation'
  | 'design-system'
  // Mobile
  | 'mobile-login'
  | 'mobile-home'
  | 'mobile-map'
  | 'mobile-encounter'
  | 'mobile-recommendation'
  // Web
  | 'case-manager-dashboard'
  | 'client-profile'
  | 'program-manager-dashboard'
  // Vulnerable User
  | 'vulnerable-home'
  | 'ai-chat'
  | 'find-help'
  | 'emergency-alert'
  | 'field-navigation'
  | 'alert-management';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('navigation');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Mock data for map
  const mockProviders = [
    {
      id: '1',
      name: 'Safe Haven NYC',
      category: 'shelter' as const,
      location: { lat: 40.7589, lng: -73.9851, address: '123 Main St' },
      availability: { bedsAvailable: 12 },
      contact: { phone: '(212) 555-0147' },
    },
    {
      id: '2',
      name: 'St. Vincent\'s Medical',
      category: 'medical' as const,
      location: { lat: 40.7589, lng: -73.9851, address: '456 Park Ave' },
      availability: {},
      contact: { phone: '(212) 555-0289' },
    },
  ];

  const mockHotspots = [
    { lat: 40.7589, lng: -73.9851, priority: 0.8 },
    { lat: 40.7489, lng: -73.9751, priority: 0.6 },
    { lat: 40.7389, lng: -73.9651, priority: 0.4 },
  ];

  const renderScreen = () => {
    switch (currentScreen) {
      // Design System
      case 'design-system':
        return <DesignSystem onBack={() => setCurrentScreen('navigation')} />;

      // Mobile Screens
      case 'mobile-login':
        return <OutreachLogin
          onLogin={() => setCurrentScreen('mobile-home')}
          onBackToHub={() => setCurrentScreen('navigation')}
        />;
      case 'mobile-home':
        return <OutreachHome
          onNavigate={(screen) => {
            if (screen === 'map') setCurrentScreen('mobile-map');
            if (screen === 'encounter') setCurrentScreen('mobile-encounter');
            if (screen === 'voice') setCurrentScreen('mobile-encounter');
            if (screen === 'navigation') setCurrentScreen('field-navigation');
          }}
          onBackToHub={() => setCurrentScreen('navigation')}
        />;
      case 'field-navigation':
        return <FieldWorkerNavigation onBack={() => setCurrentScreen('mobile-home')} />;
      case 'mobile-map':
        return (
          <div className="h-screen flex flex-col bg-background">
            <div className="bg-background border-b border-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={() => setCurrentScreen('mobile-home')}>
                  ← Back
                </Button>
                <h1 className="text-xl">Map View</h1>
              </div>
            </div>
            <div className="flex-1">
              <LeafletMap
                providers={serviceProviders}
                currentLocation={{ lat: 40.7589, lng: -73.9851 }}
                height="100%"
                showControls={true}
              />
            </div>
          </div>
        );
      case 'mobile-encounter':
        return <EncounterLogging onSave={() => setCurrentScreen('mobile-recommendation')} onCancel={() => setCurrentScreen('mobile-home')} />;
      case 'mobile-recommendation':
        return <ServiceRecommendation
          onBook={() => setCurrentScreen('mobile-home')}
          onBack={() => setCurrentScreen('mobile-encounter')}
        />;

      // Web Dashboard Screens
      case 'case-manager-dashboard':
        return <CaseManagerDashboard
          onNavigate={(screen) => {
            if (screen === 'client-profile') setCurrentScreen('client-profile');
            if (screen === 'alert-management') setCurrentScreen('alert-management');
          }}
          onBackToHub={() => setCurrentScreen('navigation')}
        />;
      case 'alert-management':
        return <AlertManagement onBack={() => setCurrentScreen('case-manager-dashboard')} />;
      case 'client-profile':
        return <ClientProfile onBack={() => setCurrentScreen('case-manager-dashboard')} />;
      case 'program-manager-dashboard':
        return <ProgramManagerDashboard onBackToHub={() => setCurrentScreen('navigation')} />;

      // Vulnerable User Screens
      case 'vulnerable-home':
        return <VulnerableUserHome onNavigate={(screen) => {
          if (screen === 'ai-chat') setCurrentScreen('ai-chat');
          if (screen === 'find-help') setCurrentScreen('find-help');
          if (screen === 'emergency-alert') setCurrentScreen('emergency-alert');
        }} />;
      case 'ai-chat':
        return <AIChat
          onBack={() => setCurrentScreen('vulnerable-home')}
          onNavigateToMap={() => setCurrentScreen('find-help')}
          onEmergencyAlert={() => setCurrentScreen('emergency-alert')}
        />;
      case 'find-help':
        return <FindHelp
          onBack={() => setCurrentScreen('vulnerable-home')}
          onNavigate={(provider) => {
            // In production, navigate to NavigationView with provider
            console.log('Navigate to:', provider);
          }}
        />;
      case 'emergency-alert':
        return <EmergencyAlert
          onBack={() => setCurrentScreen('vulnerable-home')}
          onAlertSent={() => {
            // In production, show confirmation and maybe navigate
            console.log('Alert sent');
          }}
        />;
      // Navigation Hub
      default:
        return <NavigationHub onNavigate={setCurrentScreen} isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderScreen()}
      {/* Floating navigation button (hidden on navigation hub) */}
      {currentScreen !== 'navigation' && (
        <FloatingNavButton onClick={() => setCurrentScreen('navigation')} />
      )}
    </div>
  );
}

function NavigationHub({ onNavigate, isDarkMode, onToggleDarkMode }: { onNavigate: (screen: Screen) => void; isDarkMode: boolean; onToggleDarkMode: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">🏠</span>
              </div>
              <div>
                <h1 className="text-4xl mb-1">HOCI Platform</h1>
                <p className="text-xl text-foreground opacity-70">
                  Homeless Outreach Coordination Intelligence
                </p>
              </div>
            </div>
            <ThemeToggle isDark={isDarkMode} onToggle={onToggleDarkMode} />
          </div>
          <p className="max-w-3xl text-base leading-relaxed">
            A comprehensive design system and platform prototype for coordinating homeless outreach services
            with multiple user roles, AI-driven workflows, and multilingual support.
          </p>

          {/* Navigation Help Banner */}
          <div className="mt-6 bg-primary-50 dark:bg-primary-900 rounded-lg p-4 max-w-3xl border border-primary-200 dark:border-primary-700">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg">💡</span>
              </div>
              <div>
                <p className="mb-2 font-semibold">
                  Navigation Tips:
                </p>
                <ul className="space-y-1 text-sm leading-relaxed opacity-90">
                  <li>• Click any card below to explore different parts of the platform</li>
                  <li>• Use the <span className="font-semibold">blue floating home button</span> (bottom-right) to return here from any screen</li>
                  <li>• Each screen has header navigation to go back or return to the hub</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="mobile">Mobile App</TabsTrigger>
            <TabsTrigger value="web">Web Dashboards</TabsTrigger>
            <TabsTrigger value="design">Design System</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => onNavigate('design-system')}>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Palette className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl mb-2">Design System</h3>
                <p className="mb-4 opacity-70">
                  Complete component library with colors, typography, buttons, inputs, badges, and icons.
                </p>
                <Button variant="outline" className="w-full">
                  Explore Design System →
                </Button>
              </Card>

              <Card className="p-6 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => onNavigate('mobile-login')}>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl mb-2">Mobile Outreach App</h3>
                <p className="mb-4 opacity-70">
                  Field worker interface with map, voice input, encounter logging, and AI recommendations.
                </p>
                <Button variant="outline" className="w-full">
                  View Mobile Screens →
                </Button>
              </Card>

              <Card className="p-6 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => onNavigate('case-manager-dashboard')}>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Monitor className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl mb-2">Case Manager Dashboard</h3>
                <p className="mb-4 opacity-70">
                  Web interface for managing cases, appointments, client profiles, and service matching.
                </p>
                <Button variant="outline" className="w-full">
                  View Dashboard →
                </Button>
              </Card>

              <Card className="p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-primary-300" onClick={() => onNavigate('vulnerable-home')}>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl mb-2">Vulnerable User Portal</h3>
                <p className="mb-4 opacity-70">
                  Accessible interface for individuals seeking help with AI chat, service maps, and emergency alerts.
                </p>
                <Button variant="default" className="w-full">
                  Get Help Now →
                </Button>
              </Card>
            </div>

            {/* Features Grid */}
            <Card className="p-6">
              <h2 className="text-2xl mb-4">Platform Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg mb-3">🎯 Core Capabilities</h3>
                  <ul className="space-y-2 opacity-80">
                    <li>• Multi-role user interfaces (Outreach, Case Manager, Program Manager, Provider)</li>
                    <li>• Mobile-first responsive design with large touch targets (44x44px minimum)</li>
                    <li>• Voice dictation with AI-powered transcription (Whisper integration)</li>
                    <li>• Real-time map with hotspot prediction and service provider locations</li>
                    <li>• AI-driven service matching and recommendations</li>
                    <li>• Multilingual support (English, Spanish, Mandarin, Arabic, Russian, Haitian Creole)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg mb-3">🛡️ Privacy & Accessibility</h3>
                  <ul className="space-y-2 opacity-80">
                    <li>• Consent-first data collection workflows</li>
                    <li>• PII minimization and data protection indicators</li>
                    <li>• WCAG 2.1 AA accessible color contrast ratios</li>
                    <li>• Clear, readable typography optimized for low-literacy users</li>
                    <li>• Offline mode capability indicators</li>
                    <li>• Human oversight on all AI recommendations</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg mb-3">📊 Analytics & Reporting</h3>
                  <ul className="space-y-2 opacity-80">
                    <li>• Real-time metrics dashboards for program managers</li>
                    <li>• Borough-level breakdown and coverage analysis</li>
                    <li>• Weather impact predictions and resource allocation</li>
                    <li>• Placement success rates and time-to-service metrics</li>
                    <li>• Team performance and coverage gap identification</li>
                    <li>• Exportable reports and audit logs</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg mb-3">🔄 Workflows</h3>
                  <ul className="space-y-2 opacity-80">
                    <li>• Encounter logging with photo capture and voice input</li>
                    <li>• AI service recommendations with human override</li>
                    <li>• Appointment booking and reminder systems</li>
                    <li>• Follow-up tracking and SMS/WhatsApp messaging</li>
                    <li>• Service provider availability updates</li>
                    <li>• Emergency weather protocol activation</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Design Principles */}
            <Card className="p-6 border-2">
              <h2 className="text-2xl mb-4">Design Principles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="mb-2">🤝 Human-Centered</h4>
                  <p className="text-sm opacity-80">
                    Warm color palette, compassionate language, and empathetic interactions that respect dignity.
                  </p>
                </div>
                <div>
                  <h4 className="mb-2">♿ Accessible</h4>
                  <p className="text-sm opacity-80">
                    Large touch targets, high contrast, multilingual, and optimized for users with varying literacy levels.
                  </p>
                </div>
                <div>
                  <h4 className="mb-2">🔒 Privacy-First</h4>
                  <p className="text-sm opacity-80">
                    Consent workflows, PII minimization, data deletion options, and transparent AI decision-making.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Mobile App Screens */}
          <TabsContent value="mobile" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => onNavigate('mobile-login')}>
                <div className="aspect-[9/16] bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg mb-4 flex items-center justify-center text-white">
                  <div className="text-center">
                    <Smartphone className="h-12 w-12 mx-auto mb-2" />
                    <p>Login Screen</p>
                  </div>
                </div>
                <h3 className="text-lg mb-2">Login</h3>
                <p className="text-sm opacity-70">
                  Multi-method authentication: email, phone, or passcode with language selection.
                </p>
              </Card>

              <Card className="p-6 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => onNavigate('mobile-home')}>
                <div className="aspect-[9/16] bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-4 flex items-center justify-center text-white">
                  <div className="text-center">
                    <LayoutDashboard className="h-12 w-12 mx-auto mb-2" />
                    <p>Home Dashboard</p>
                  </div>
                </div>
                <h3 className="text-lg mb-2">Home Screen</h3>
                <p className="text-sm opacity-70">
                  Quick actions: Start route, log encounter, voice input. Map preview and today's stats.
                </p>
              </Card>

              <Card className="p-6 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => onNavigate('mobile-map')}>
                <div className="aspect-[9/16] bg-gradient-to-br from-green-400 to-green-600 rounded-lg mb-4 flex items-center justify-center text-white">
                  <div className="text-center">
                    <LayoutDashboard className="h-12 w-12 mx-auto mb-2" />
                    <p>Map View</p>
                  </div>
                </div>
                <h3 className="text-lg mb-2">Map View</h3>
                <p className="text-sm opacity-70">
                  Live hotspots, service provider markers, recommended routes, and filters.
                </p>
              </Card>

              <Card className="p-6 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => onNavigate('mobile-encounter')}>
                <div className="aspect-[9/16] bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg mb-4 flex items-center justify-center text-white">
                  <div className="text-center">
                    <LayoutDashboard className="h-12 w-12 mx-auto mb-2" />
                    <p>Encounter Log</p>
                  </div>
                </div>
                <h3 className="text-lg mb-2">Encounter Logging</h3>
                <p className="text-sm opacity-70">
                  Voice dictation, photo capture, quick buttons, AI extraction, and consent tracking.
                </p>
              </Card>

              <Card className="p-6 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => onNavigate('mobile-recommendation')}>
                <div className="aspect-[9/16] bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg mb-4 flex items-center justify-center text-white">
                  <div className="text-center">
                    <LayoutDashboard className="h-12 w-12 mx-auto mb-2" />
                    <p>AI Recommendations</p>
                  </div>
                </div>
                <h3 className="text-lg mb-2">Service Recommendations</h3>
                <p className="text-sm opacity-70">
                  AI-ranked service matches with scores, reasons, availability, and human override.
                </p>
              </Card>
            </div>
          </TabsContent>

          {/* Web Dashboards */}
          <TabsContent value="web" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => onNavigate('case-manager-dashboard')}>
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg mb-4 flex items-center justify-center text-white">
                  <div className="text-center">
                    <User className="h-12 w-12 mx-auto mb-2" />
                    <p>Case Manager</p>
                  </div>
                </div>
                <h3 className="text-lg mb-2">Case Manager Dashboard</h3>
                <p className="text-sm opacity-70">
                  Urgent cases, recent activity, today's metrics, and quick actions.
                </p>
              </Card>

              <Card className="p-6 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => onNavigate('client-profile')}>
                <div className="aspect-video bg-gradient-to-br from-green-500 to-green-700 rounded-lg mb-4 flex items-center justify-center text-white">
                  <div className="text-center">
                    <User className="h-12 w-12 mx-auto mb-2" />
                    <p>Client Profile</p>
                  </div>
                </div>
                <h3 className="text-lg mb-2">Client Profile</h3>
                <p className="text-sm opacity-70">
                  Encounter history timeline, appointments, documents, notes, and AI recommendations.
                </p>
              </Card>

              <Card className="p-6 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => onNavigate('program-manager-dashboard')}>
                <div className="aspect-video bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg mb-4 flex items-center justify-center text-white">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                    <p>Analytics</p>
                  </div>
                </div>
                <h3 className="text-lg mb-2">Program Manager Dashboard</h3>
                <p className="text-sm opacity-70">
                  Citywide analytics, charts, borough breakdown, team coverage, and weather impact.
                </p>
              </Card>
            </div>
          </TabsContent>

          {/* Design System */}
          <TabsContent value="design" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl mb-4">Complete Design System</h2>
              <p className="mb-6 opacity-70">
                A comprehensive component library with design tokens, patterns, and guidelines for building accessible,
                human-centered civic technology.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg mb-3">📐 Design Tokens</h3>
                  <ul className="space-y-2 opacity-80">
                    <li>• Color system (Primary, Secondary, Accent, Semantic, Service Categories)</li>
                    <li>• Typography scale (6 heading levels + body text)</li>
                    <li>• Spacing scale (6 steps from xs to 3xl)</li>
                    <li>• Border radius tokens</li>
                    <li>• Shadow system</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg mb-3">🧩 Components</h3>
                  <ul className="space-y-2 opacity-80">
                    <li>• Buttons (5 variants, 3 sizes, with icons)</li>
                    <li>• Form inputs (text, select, textarea, switches)</li>
                    <li>• Cards (standard, alert, info variants)</li>
                    <li>• Badges & service labels</li>
                    <li>• Progress indicators</li>
                    <li>• Navigation components</li>
                  </ul>
                </div>
              </div>
              <Button size="lg" onClick={() => onNavigate('design-system')}>
                <Palette className="h-5 w-5 mr-2" />
                Explore Full Design System
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
