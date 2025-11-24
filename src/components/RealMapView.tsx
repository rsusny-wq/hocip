import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { Button } from './ui/button';

interface RealMapViewProps {
  center?: { lat: number; lng: number };
  markers?: Array<{ lat: number; lng: number; label?: string; color?: string }>;
  onLocationSelect?: (location: { lat: number; lng: number; address?: string }) => void;
  height?: string;
  allowLocationSelection?: boolean;
  showCurrentLocation?: boolean;
}

export function RealMapView({
  center = { lat: 40.7128, lng: -74.0060 }, // Default to NYC
  markers = [],
  onLocationSelect,
  height = '400px',
  allowLocationSelection = false,
  showCurrentLocation = true,
}: RealMapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<{ lat: number; lng: number } | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || map) return;

    // Dynamically load Leaflet CSS and JS
    const loadLeaflet = async () => {
      // Load CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Load JS
      if (!(window as any).L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        
        await new Promise((resolve) => {
          script.onload = resolve;
          document.body.appendChild(script);
        });
      }

      const L = (window as any).L;
      
      // Initialize map
      const mapInstance = L.map(mapRef.current).setView([center.lat, center.lng], 13);

      // Add OpenStreetMap tiles (free!)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstance);

      // Add markers
      markers.forEach((marker) => {
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="background-color: ${marker.color || '#3B82F6'}; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        });

        const markerInstance = L.marker([marker.lat, marker.lng], { icon }).addTo(mapInstance);
        
        if (marker.label) {
          markerInstance.bindPopup(marker.label);
        }
      });

      // Allow clicking to select location
      if (allowLocationSelection) {
        mapInstance.on('click', async (e: any) => {
          const { lat, lng } = e.latlng;
          setSelectedMarker({ lat, lng });

          // Add temporary marker
          const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: #EF4444; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 30],
          });

          L.marker([lat, lng], { icon }).addTo(mapInstance);

          // Reverse geocode to get address
          const address = await reverseGeocode(lat, lng);
          
          if (onLocationSelect) {
            onLocationSelect({ lat, lng, address });
          }
        });
      }

      setMap(mapInstance);
    };

    loadLeaflet();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  // Update map center when center prop changes
  useEffect(() => {
    if (map && center) {
      map.setView([center.lat, center.lng]);
    }
  }, [map, center]);

  // Get current location
  const handleGetCurrentLocation = () => {
    setLoadingLocation(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(location);
          
          if (map) {
            map.setView([location.lat, location.lng], 15);
            
            // Add current location marker
            const L = (window as any).L;
            const icon = L.divIcon({
              className: 'custom-marker',
              html: `<div style="background-color: #10B981; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            });

            L.marker([location.lat, location.lng], { icon })
              .addTo(map)
              .bindPopup('You are here')
              .openPopup();
          }
          
          setLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please check your browser permissions.');
          setLoadingLocation(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
      setLoadingLocation(false);
    }
  };

  // Reverse geocoding using OpenStreetMap Nominatim (free!)
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
      console.error('Geocoding error:', error);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        style={{ height, width: '100%' }}
        className="rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800"
      />
      
      {showCurrentLocation && (
        <Button
          onClick={handleGetCurrentLocation}
          disabled={loadingLocation}
          className="absolute top-4 right-4 z-[1000] shadow-lg"
          size="sm"
        >
          {loadingLocation ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Navigation className="h-4 w-4 mr-2" />
          )}
          My Location
        </Button>
      )}

      {allowLocationSelection && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-white dark:bg-neutral-800 p-3 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-blue-500" />
            <span>Click on the map to select a location</span>
          </div>
        </div>
      )}
    </div>
  );
}
