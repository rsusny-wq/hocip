import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation2, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { ServiceBadge } from './ServiceBadge';
import type { ServiceProvider } from '../data/serviceProviders';
import type { Coordinates } from '../services/navigation';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LeafletMapProps {
    providers: ServiceProvider[];
    currentLocation?: Coordinates;
    onProviderSelect?: (provider: ServiceProvider) => void;
    onNavigate?: (provider: ServiceProvider) => void;
    height?: string;
    showControls?: boolean;
}

export function LeafletMap({
    providers,
    currentLocation,
    onProviderSelect,
    onNavigate,
    height = '500px',
    showControls = true,
}: LeafletMapProps) {
    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const markersRef = useRef<L.Marker[]>([]);
    const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);

    // Initialize map
    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        // Default to NYC coordinates
        const defaultCenter: [number, number] = currentLocation
            ? [currentLocation.lat, currentLocation.lng]
            : [40.7589, -73.9851]; // Times Square

        const map = L.map(mapContainerRef.current).setView(defaultCenter, 13);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
        }).addTo(map);

        mapRef.current = map;

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // Update current location marker
    useEffect(() => {
        if (!mapRef.current || !currentLocation) return;

        // Add current location marker
        const currentLocationMarker = L.marker([currentLocation.lat, currentLocation.lng], {
            icon: L.divIcon({
                className: 'current-location-marker',
                html: `
          <div style="
            width: 20px;
            height: 20px;
            background: #3b82f6;
            border: 4px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          "></div>
        `,
                iconSize: [20, 20],
                iconAnchor: [10, 10],
            }),
        }).addTo(mapRef.current);

        // Center map on current location
        mapRef.current.setView([currentLocation.lat, currentLocation.lng], 14);

        return () => {
            currentLocationMarker.remove();
        };
    }, [currentLocation]);

    // Add provider markers
    useEffect(() => {
        if (!mapRef.current) return;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Add new markers
        providers.forEach(provider => {
            const markerColor = getMarkerColor(provider.category);

            const marker = L.marker(
                [provider.location.lat, provider.location.lng],
                {
                    icon: L.divIcon({
                        className: 'custom-marker',
                        html: `
              <div style="
                width: 32px;
                height: 32px;
                background: ${markerColor};
                border: 3px solid white;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <div style="
                  transform: rotate(45deg);
                  color: white;
                  font-size: 16px;
                ">
                  ${getCategoryIcon(provider.category)}
                </div>
              </div>
            `,
                        iconSize: [32, 32],
                        iconAnchor: [16, 32],
                        popupAnchor: [0, -32],
                    }),
                }
            );

            // Create popup content
            const popupContent = createPopupContent(provider);
            marker.bindPopup(popupContent, {
                maxWidth: 300,
                className: 'provider-popup',
            });

            marker.on('click', () => {
                setSelectedProvider(provider);
                onProviderSelect?.(provider);
            });

            marker.addTo(mapRef.current!);
            markersRef.current.push(marker);
        });

        // Fit bounds to show all markers
        if (providers.length > 0) {
            const bounds = L.latLngBounds(
                providers.map(p => [p.location.lat, p.location.lng] as [number, number])
            );
            if (currentLocation) {
                bounds.extend([currentLocation.lat, currentLocation.lng]);
            }
            mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [providers, onProviderSelect]);

    function getMarkerColor(category: string): string {
        const colors: Record<string, string> = {
            shelter: '#3b82f6', // blue
            medical: '#ec4899', // pink
            food: '#f97316', // orange
            'mental-health': '#14b8a6', // teal
            detox: '#22c55e', // green
            'id-services': '#a855f7', // purple
        };
        return colors[category] || '#6b7280';
    }

    function getCategoryIcon(category: string): string {
        const icons: Record<string, string> = {
            shelter: '🏠',
            medical: '🏥',
            food: '🍽️',
            'mental-health': '🧠',
            detox: '💊',
            'id-services': '🆔',
        };
        return icons[category] || '📍';
    }

    function createPopupContent(provider: ServiceProvider): HTMLElement {
        const div = document.createElement('div');
        div.className = 'p-3';
        div.innerHTML = `
      <div class="mb-2">
        <h3 class="text-lg font-semibold mb-1">${provider.name}</h3>
        <p class="text-sm text-neutral-600">${provider.location.address}</p>
      </div>
      <div class="mb-2">
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${getMarkerColor(provider.category)}-100 text-${getMarkerColor(provider.category)}-700">
          ${provider.category}
        </span>
      </div>
      ${provider.availability?.bedsAvailable !== undefined ? `
        <p class="text-sm mb-2">
          <strong>${provider.availability.bedsAvailable}</strong> beds available
        </p>
      ` : ''}
      ${provider.availability?.walkInAvailable ? `
        <p class="text-sm mb-2 text-green-600">✓ Walk-ins welcome</p>
      ` : ''}
      <div class="flex gap-2 mt-3">
        <button 
          class="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
          onclick="window.handleNavigate('${provider.id}')"
        >
          Get Directions
        </button>
        <a 
          href="tel:${provider.contact.phone}" 
          class="px-3 py-2 bg-neutral-100 rounded-lg text-sm font-medium hover:bg-neutral-200"
        >
          📞
        </a>
      </div>
    `;

        // Add event listener for navigate button
        (window as any).handleNavigate = (providerId: string) => {
            const provider = providers.find(p => p.id === providerId);
            if (provider && onNavigate) {
                onNavigate(provider);
            }
        };

        return div;
    }

    return (
        <div className="relative w-full" style={{ height }}>
            <div ref={mapContainerRef} className="w-full h-full rounded-lg overflow-hidden" />

            {/* Attribution */}
            <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs text-neutral-600">
                © OpenStreetMap contributors
            </div>

            {/* Controls */}
            {showControls && currentLocation && (
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <Button
                        size="icon"
                        className="bg-white text-neutral-900 hover:bg-neutral-100 shadow-lg"
                        onClick={() => {
                            if (mapRef.current && currentLocation) {
                                mapRef.current.setView([currentLocation.lat, currentLocation.lng], 15);
                            }
                        }}
                    >
                        <Navigation2 className="h-5 w-5" />
                    </Button>
                </div>
            )}
        </div>
    );
}
