import { useState, useEffect } from 'react';
import { ArrowLeft, Filter, Navigation2, Phone, MapPin as MapPinIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { LeafletMap } from '../LeafletMap';
import { serviceProviders, getProvidersNearLocation, type ServiceProvider } from '../../data/serviceProviders';
import { getCurrentLocation, type Coordinates } from '../../services/navigation';
import type { ServiceCategory } from '../../types';

interface FindHelpProps {
    onBack?: () => void;
    onNavigate?: (provider: ServiceProvider) => void;
}

export function FindHelp({ onBack, onNavigate }: FindHelpProps) {
    const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
    const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>(serviceProviders);
    const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    // Get current location on mount
    useEffect(() => {
        requestLocation();
    }, []);

    // Filter providers when category changes
    useEffect(() => {
        if (selectedCategory === 'all') {
            setFilteredProviders(serviceProviders);
        } else {
            setFilteredProviders(
                serviceProviders.filter(p => p.category === selectedCategory)
            );
        }
    }, [selectedCategory]);

    const requestLocation = async () => {
        setIsLoadingLocation(true);
        setLocationError(null);
        try {
            const coords = await getCurrentLocation();
            setCurrentLocation(coords);
        } catch (error) {
            setLocationError("Couldn't get your location. Using default NYC location.");
            // Default to Times Square
            setCurrentLocation({ lat: 40.7589, lng: -73.9851 });
        } finally {
            setIsLoadingLocation(false);
        }
    };

    const categories: Array<{ value: ServiceCategory | 'all'; label: string; icon: string; color: string }> = [
        { value: 'all', label: 'All', icon: '📍', color: 'neutral' },
        { value: 'shelter', label: 'Shelter', icon: '🏠', color: 'blue' },
        { value: 'food', label: 'Food', icon: '🍽️', color: 'orange' },
        { value: 'medical', label: 'Medical', icon: '🏥', color: 'pink' },
        { value: 'mental-health', label: 'Mental Health', icon: '🧠', color: 'teal' },
        { value: 'detox', label: 'Detox', icon: '💊', color: 'green' },
        { value: 'id-services', label: 'ID Services', icon: '🆔', color: 'purple' },
    ];

    const nearbyProviders = currentLocation
        ? getProvidersNearLocation(currentLocation.lat, currentLocation.lng, 5, selectedCategory === 'all' ? undefined : selectedCategory)
        : filteredProviders;

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-neutral-200 px-4 py-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                    <Button variant="ghost" size="icon" onClick={onBack}>
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-xl font-semibold">Find Help Near You</h1>
                        <p className="text-sm text-neutral-600">
                            {nearbyProviders.length} services nearby
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={requestLocation}
                        disabled={isLoadingLocation}
                    >
                        <Navigation2 className="h-4 w-4 mr-2" />
                        {isLoadingLocation ? 'Finding...' : 'My Location'}
                    </Button>
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
                    {categories.map((cat) => (
                        <Button
                            key={cat.value}
                            variant={selectedCategory === cat.value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategory(cat.value)}
                            className="flex-shrink-0"
                        >
                            <span className="mr-2">{cat.icon}</span>
                            {cat.label}
                        </Button>
                    ))}
                </div>

                {locationError && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                        {locationError}
                    </div>
                )}
            </div>

            {/* Map */}
            <div className="flex-1 relative">
                <LeafletMap
                    providers={nearbyProviders}
                    currentLocation={currentLocation || undefined}
                    onProviderSelect={setSelectedProvider}
                    onNavigate={onNavigate}
                    height="100%"
                    showControls={true}
                />
            </div>

            {/* Selected Provider Details */}
            {selectedProvider && (
                <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-neutral-200 shadow-2xl p-4 max-h-[50vh] overflow-y-auto">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-1">{selectedProvider.name}</h2>
                                <p className="text-neutral-600 flex items-center gap-2">
                                    <MapPinIcon className="h-4 w-4" />
                                    {selectedProvider.location.address}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedProvider(null)}
                            >
                                ✕
                            </Button>
                        </div>

                        {/* Availability */}
                        {selectedProvider.availability?.bedsAvailable !== undefined && (
                            <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-lg font-semibold text-green-900">
                                    {selectedProvider.availability.bedsAvailable} beds available now
                                </p>
                            </div>
                        )}

                        {selectedProvider.availability?.walkInAvailable && (
                            <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                                ✓ Walk-ins welcome - No appointment needed
                            </div>
                        )}

                        {/* Services */}
                        <div className="mb-3">
                            <h3 className="font-semibold mb-2">Services:</h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedProvider.services.map((service, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 bg-neutral-100 rounded-full text-sm"
                                    >
                                        {service}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Hours */}
                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">Hours:</h3>
                            <p className="text-sm text-neutral-700">
                                {getHoursDisplay(selectedProvider)}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button
                                size="lg"
                                className="flex-1"
                                onClick={() => onNavigate?.(selectedProvider)}
                            >
                                <Navigation2 className="h-5 w-5 mr-2" />
                                Get Directions
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <a href={`tel:${selectedProvider.contact.phone}`}>
                                    <Phone className="h-5 w-5 mr-2" />
                                    Call
                                </a>
                            </Button>
                        </div>

                        {/* Notes */}
                        {selectedProvider.notes && (
                            <div className="mt-3 p-3 bg-neutral-50 rounded text-sm text-neutral-700">
                                <strong>Note:</strong> {selectedProvider.notes}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Help Text */}
            {!selectedProvider && (
                <div className="bg-white border-t border-neutral-200 p-4">
                    <div className="max-w-2xl mx-auto text-center text-sm text-neutral-600">
                        <p>Tap any marker on the map to see details and get directions</p>
                    </div>
                </div>
            )}
        </div>
    );
}

function getHoursDisplay(provider: ServiceProvider): string {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todayHours = provider.hours[today as keyof typeof provider.hours];

    if (!todayHours) return 'Hours not available';
    if (todayHours === 'closed') return 'Closed today';
    if (typeof todayHours === 'object') {
        if (todayHours.open === '24 hours') return 'Open 24 hours';
        return `Today: ${todayHours.open} - ${todayHours.close}`;
    }
    return 'Hours not available';
}
