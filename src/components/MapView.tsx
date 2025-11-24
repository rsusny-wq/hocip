import { MapPin, Navigation, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { ServiceBadge } from './ServiceBadge';
import type { ServiceCategory, ServiceProvider } from '../types';

interface MapViewProps {
  providers?: ServiceProvider[];
  hotspots?: Array<{ lat: number; lng: number; priority: number }>;
  currentLocation?: { lat: number; lng: number };
  showFilters?: boolean;
  onFilterChange?: (categories: ServiceCategory[]) => void;
}

export function MapView({ providers = [], hotspots = [], currentLocation, showFilters = true }: MapViewProps) {
  // Simulated map view with markers
  return (
    <div className="relative w-full h-full min-h-[500px] bg-neutral-100 rounded-lg overflow-hidden">
      {/* Map background - in real app, this would be Google Maps/Mapbox */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
        {/* Grid lines to simulate map */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(10)].map((_, i) => (
            <div key={`h-${i}`} className="absolute w-full border-t border-neutral-300" style={{ top: `${i * 10}%` }} />
          ))}
          {[...Array(10)].map((_, i) => (
            <div key={`v-${i}`} className="absolute h-full border-l border-neutral-300" style={{ left: `${i * 10}%` }} />
          ))}
        </div>
        
        {/* Hotspot markers */}
        {hotspots.map((hotspot, i) => (
          <div
            key={`hotspot-${i}`}
            className="absolute"
            style={{
              left: `${25 + i * 15}%`,
              top: `${30 + i * 10}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className={`w-16 h-16 rounded-full ${
              hotspot.priority > 0.7 ? 'bg-red-500/30' : hotspot.priority > 0.4 ? 'bg-orange-500/30' : 'bg-yellow-500/30'
            } animate-pulse`} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-4 h-4 rounded-full ${
                hotspot.priority > 0.7 ? 'bg-red-600' : hotspot.priority > 0.4 ? 'bg-orange-600' : 'bg-yellow-600'
              }`} />
            </div>
          </div>
        ))}
        
        {/* Service provider markers */}
        {providers.slice(0, 5).map((provider, i) => (
          <div
            key={provider.id}
            className="absolute"
            style={{
              left: `${20 + i * 18}%`,
              top: `${40 + (i % 2) * 20}%`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="relative group cursor-pointer">
              <MapPin 
                className={`h-10 w-10 drop-shadow-lg ${
                  provider.category === 'shelter' ? 'text-blue-600 fill-blue-600' :
                  provider.category === 'medical' ? 'text-pink-600 fill-pink-600' :
                  provider.category === 'food' ? 'text-orange-600 fill-orange-600' :
                  'text-purple-600 fill-purple-600'
                }`}
              />
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-white rounded-lg shadow-xl p-3 whitespace-nowrap">
                  <p className="text-sm mb-1">{provider.name}</p>
                  <ServiceBadge category={provider.category} size="sm" />
                  {provider.availability.bedsAvailable !== undefined && (
                    <p className="text-xs text-neutral-600 mt-1">
                      {provider.availability.bedsAvailable} beds available
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Current location */}
        {currentLocation && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="absolute inset-0 w-12 h-12 bg-blue-500/30 rounded-full animate-ping" />
              <div className="relative w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg" />
            </div>
          </div>
        )}
      </div>
      
      {/* Map controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button size="icon" className="bg-white text-neutral-900 hover:bg-neutral-100 shadow-lg">
          <Navigation className="h-5 w-5" />
        </Button>
        {showFilters && (
          <Button size="icon" className="bg-white text-neutral-900 hover:bg-neutral-100 shadow-lg">
            <Filter className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
        <h4 className="text-sm mb-2">Map Legend</h4>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span>High Priority Hotspot</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-600 fill-blue-600" />
            <span>Shelter</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-pink-600 fill-pink-600" />
            <span>Medical</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-orange-600 fill-orange-600" />
            <span>Food Services</span>
          </div>
        </div>
      </div>
    </div>
  );
}
