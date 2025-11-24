import { Map, Mic, FileText, MapPin, Clock, Users, Bell, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { LanguageSwitcher } from '../LanguageSwitcher';
import type { Language } from '../../types';
import { useState, useEffect } from 'react';
import { alertService, type Alert } from '../../services/alertService';
import { formatDistanceToNow } from 'date-fns';

interface OutreachHomeProps {
  onNavigate?: (screen: string) => void;
  onBackToHub?: () => void;
}

export function OutreachHome({ onNavigate, onBackToHub }: OutreachHomeProps) {
  const [language, setLanguage] = useState<Language>('en');
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const unsubscribe = alertService.subscribe(setAlerts);
    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-background border-b border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBackToHub}>
              <Home className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl">Good Morning, Maria</h1>
              <p className="text-sm opacity-70">Manhattan Team • Zone 4</p>
            </div>
          </div>
          <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />
        </div>

        {/* Today's summary */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center">
            <p className="text-2xl text-primary-600">12</p>
            <p className="text-xs opacity-70">Contacts Today</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-2xl text-green-600">8</p>
            <p className="text-xs opacity-70">Placements</p>
          </Card>
          <Card className="p-3 text-center">
            <p className="text-2xl text-orange-600">3</p>
            <p className="text-xs opacity-70">Follow-ups</p>
          </Card>
        </div>
      </div>

      {/* Main Actions */}
      <div className="flex-1 p-4 space-y-4">
        {/* Primary Actions - Large buttons */}
        <div className="space-y-3">
          <Button
            className="w-full h-20 bg-primary-500 hover:bg-primary-600 tap-target justify-start px-6"
            onClick={() => onNavigate?.('map')}
          >
            <Map className="h-8 w-8 mr-4" />
            <div className="text-left">
              <p className="text-lg">Start Outreach Route</p>
              <p className="text-xs text-primary-100">5 hotspots identified today</p>
            </div>
          </Button>

          <Button
            className="w-full h-20 bg-secondary-500 hover:bg-secondary-600 tap-target justify-start px-6"
            onClick={() => onNavigate?.('encounter')}
          >
            <FileText className="h-8 w-8 mr-4" />
            <div className="text-left">
              <p className="text-lg">Log Encounter</p>
              <p className="text-xs text-secondary-100">Quick entry or voice input</p>
            </div>
          </Button>

          <Button
            className="w-full h-20 bg-accent-500 hover:bg-accent-600 tap-target justify-start px-6"
            onClick={() => onNavigate?.('voice')}
          >
            <Mic className="h-8 w-8 mr-4" />
            <div className="text-left">
              <p className="text-lg">Voice Input</p>
              <p className="text-xs text-accent-100">Hands-free encounter logging</p>
            </div>
          </Button>
        </div>

        {/* Map Preview */}
        <Card className="overflow-hidden">
          <div className="h-48 bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 relative">
            {/* Simplified map preview */}
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="h-12 w-12 text-primary-500" />
            </div>
            <div className="absolute top-2 right-2">
              <Badge className="bg-background">
                <Clock className="h-3 w-3 mr-1" />
                Live
              </Badge>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
              <p className="text-white text-sm">Your coverage area</p>
            </div>
          </div>
          <div className="p-3">
            <Button variant="outline" className="w-full" onClick={() => onNavigate?.('map')}>
              View Full Map
            </Button>
          </div>
        </Card>

        {/* Quick Actions Grid */}
        <div>
          <h3 className="text-sm text-neutral-700 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-24 flex-col tap-target" onClick={() => onNavigate?.('follow-up')}>
              <Bell className="h-6 w-6 mb-2 text-orange-600" />
              <span className="text-sm">Follow-ups</span>
              <Badge className="mt-1 bg-orange-100 text-orange-700">3</Badge>
            </Button>
            <Button variant="outline" className="h-24 flex-col tap-target">
              <Users className="h-6 w-6 mb-2 text-blue-600" />
              <span className="text-sm">My Clients</span>
              <Badge className="mt-1 bg-blue-100 text-blue-700">24</Badge>
            </Button>
          </div>
        </div>

        {/* Live Alerts Feed */}
        <div className="space-y-3">
          <h3 className="text-sm text-neutral-700 font-medium flex items-center gap-2">
            <Bell className="h-4 w-4 text-red-500" />
            Live Alerts ({alerts.length})
          </h3>

          {alerts.length === 0 ? (
            <Card className="p-4 text-center text-neutral-500">
              No active alerts in your zone.
            </Card>
          ) : (
            alerts.map(alert => (
              <Card key={alert.id} className="p-4 border-l-4 border-l-red-500">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 mb-1">
                      {alert.type.toUpperCase()}
                    </Badge>
                    <h4 className="font-semibold">Alert near {alert.location.lat.toFixed(3)}, {alert.location.lng.toFixed(3)}</h4>
                  </div>
                  <span className="text-xs text-neutral-500">
                    {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-neutral-600 mb-3">{alert.details}</p>
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => onNavigate?.('navigation')} // TODO: Pass alert location
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Navigate to Client
                </Button>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-background border-t border-border px-4 py-2 safe-area-bottom">
        <div className="grid grid-cols-4 gap-2">
          <Button variant="ghost" className="flex-col h-16 tap-target">
            <Map className="h-5 w-5 mb-1 text-primary-600" />
            <span className="text-xs text-primary-600">Home</span>
          </Button>
          <Button variant="ghost" className="flex-col h-16 tap-target" onClick={() => onNavigate?.('map')}>
            <MapPin className="h-5 w-5 mb-1" />
            <span className="text-xs">Map</span>
          </Button>
          <Button variant="ghost" className="flex-col h-16 tap-target" onClick={() => onNavigate?.('encounter')}>
            <FileText className="h-5 w-5 mb-1" />
            <span className="text-xs">Log</span>
          </Button>
          <Button variant="ghost" className="flex-col h-16 tap-target">
            <Users className="h-5 w-5 mb-1" />
            <span className="text-xs">Clients</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
