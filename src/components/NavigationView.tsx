import { useEffect, useState } from 'react';
import { ArrowLeft, Navigation as NavigationIcon, Phone, MapPin, AlertCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import {
    getRoute,
    getCurrentLocation,
    watchLocation,
    stopWatchingLocation,
    formatDistance,
    formatDuration,
    calculateETA,
    type Route,
    type Coordinates,
} from '../services/navigation';

interface NavigationViewProps {
    destination: {
        name: string;
        address: string;
        coordinates: Coordinates;
        phone?: string;
    };
    onCancel: () => void;
    onArrived?: () => void;
}

export function NavigationView({ destination, onCancel, onArrived }: NavigationViewProps) {
    const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
    const [route, setRoute] = useState<Route | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [watchId, setWatchId] = useState<number | null>(null);
    const [eta, setEta] = useState<Date | null>(null);

    useEffect(() => {
        startNavigation();
        return () => {
            if (watchId !== null) {
                stopWatchingLocation(watchId);
            }
        };
    }, []);

    async function startNavigation() {
        try {
            setIsLoading(true);
            setError(null);

            // Get current location
            const location = await getCurrentLocation();
            if (!location) {
                throw new Error('Unable to get your location');
            }
            setCurrentLocation(location);

            // Calculate route
            const calculatedRoute = await getRoute(location, destination.coordinates);
            if (!calculatedRoute) {
                throw new Error('Unable to calculate route');
            }
            setRoute(calculatedRoute);
            setEta(calculateETA(calculatedRoute));

            // Start watching location
            const id = watchLocation((newLocation) => {
                setCurrentLocation(newLocation);
                updateCurrentStep(newLocation, calculatedRoute);
            });
            setWatchId(id);
        } catch (err) {
            console.error('Navigation error:', err);
            setError(err instanceof Error ? err.message : 'Navigation error');
        } finally {
            setIsLoading(false);
        }
    }

    function updateCurrentStep(location: Coordinates, routeData: Route) {
        // Simple logic: find closest instruction
        // In production, use more sophisticated logic
        if (!routeData.instructions || routeData.instructions.length === 0) return;

        // For now, just increment step based on progress
        // This is simplified - real implementation would use distance to next turn
    }

    function handleEmergency() {
        window.location.href = 'tel:911';
    }

    function handleCallDestination() {
        if (destination.phone) {
            window.location.href = `tel:${destination.phone}`;
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-xl">Calculating route...</p>
                </div>
            </div>
        );
    }

    if (error || !route || !currentLocation) {
        return (
            <div className="min-h-screen bg-neutral-900 text-white p-4">
                <div className="max-w-2xl mx-auto">
                    <Card className="p-6 bg-red-900 border-red-700">
                        <div className="flex items-start gap-3 mb-4">
                            <AlertCircle className="h-6 w-6 flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-xl font-bold mb-2">Navigation Error</h2>
                                <p>{error || 'Unable to start navigation'}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button onClick={startNavigation} className="flex-1">
                                Try Again
                            </Button>
                            <Button onClick={onCancel} variant="outline">
                                Cancel
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    const currentInstruction = route.instructions?.[currentStep]?.text || 'Continue straight';
    const remainingDistance = route.distance; // Simplified
    const remainingTime = route.duration; // Simplified

    return (
        <div className="min-h-screen bg-neutral-900 text-white flex flex-col">
            {/* Header */}
            <div className="bg-neutral-800 p-4 border-b border-neutral-700">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                    <Button
                        variant="ghost"
                        onClick={onCancel}
                        className="text-white hover:bg-neutral-700"
                    >
                        <X className="h-5 w-5 mr-2" />
                        Exit
                    </Button>
                    <div className="text-center flex-1">
                        <p className="text-sm text-neutral-400">Navigating to</p>
                        <p className="font-semibold">{destination.name}</p>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={handleEmergency}
                        className="text-red-400 hover:bg-red-900"
                    >
                        SOS
                    </Button>
                </div>
            </div>

            {/* Main Navigation Display */}
            <div className="flex-1 flex flex-col">
                {/* Current Instruction */}
                <div className="bg-blue-600 p-8 text-center">
                    <div className="max-w-2xl mx-auto">
                        <div className="mb-4">
                            <NavigationIcon className="h-16 w-16 mx-auto" />
                        </div>
                        <p className="text-4xl font-bold mb-2">{currentInstruction}</p>
                        <p className="text-xl opacity-90">
                            {formatDistance(remainingDistance)} • {formatDuration(remainingTime)}
                        </p>
                    </div>
                </div>

                {/* ETA and Details */}
                <div className="bg-neutral-800 p-6">
                    <div className="max-w-2xl mx-auto grid grid-cols-2 gap-4">
                        <Card className="p-4 bg-neutral-700 border-neutral-600">
                            <p className="text-sm text-neutral-400 mb-1">Arrival Time</p>
                            <p className="text-2xl font-bold">
                                {eta?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </Card>
                        <Card className="p-4 bg-neutral-700 border-neutral-600">
                            <p className="text-sm text-neutral-400 mb-1">Distance</p>
                            <p className="text-2xl font-bold">{formatDistance(route.distance)}</p>
                        </Card>
                    </div>
                </div>

                {/* Destination Info */}
                <div className="bg-neutral-800 p-6 border-t border-neutral-700">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex items-start gap-4">
                            <MapPin className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-1">{destination.name}</h3>
                                <p className="text-neutral-400">{destination.address}</p>
                            </div>
                            {destination.phone && (
                                <Button
                                    onClick={handleCallDestination}
                                    variant="outline"
                                    className="flex-shrink-0"
                                >
                                    <Phone className="h-4 w-4 mr-2" />
                                    Call
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Turn-by-Turn Instructions */}
                {route.instructions && route.instructions.length > 0 && (
                    <div className="flex-1 overflow-y-auto bg-neutral-900 p-6">
                        <div className="max-w-2xl mx-auto">
                            <h3 className="text-lg font-semibold mb-4">Upcoming Turns</h3>
                            <div className="space-y-3">
                                {route.instructions.map((instruction, index) => (
                                    <Card
                                        key={index}
                                        className={`p-4 ${index === currentStep
                                            ? 'bg-blue-900 border-blue-700'
                                            : 'bg-neutral-800 border-neutral-700'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center ${index === currentStep ? 'bg-blue-600' : 'bg-neutral-700'
                                                    }`}
                                            >
                                                {index + 1}
                                            </div>
                                            <p className="flex-1">{instruction.text}</p>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Actions */}
            <div className="bg-neutral-800 p-4 border-t border-neutral-700">
                <div className="max-w-2xl mx-auto flex gap-3">
                    <Button
                        onClick={handleEmergency}
                        className="flex-1 bg-red-600 hover:bg-red-700"
                    >
                        <AlertCircle className="h-5 w-5 mr-2" />
                        Emergency (911)
                    </Button>
                    <Button
                        onClick={() => {
                            if (confirm('Have you arrived at your destination?')) {
                                onArrived?.();
                                onCancel();
                            }
                        }}
                        variant="outline"
                        className="flex-1"
                    >
                        I've Arrived
                    </Button>
                </div>
            </div>
        </div>
    );
}
