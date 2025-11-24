import { useState } from 'react';
import { ArrowLeft, MapPin, Navigation2, Phone, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface FieldWorkerNavigationProps {
    onBack?: () => void;
    targetLocation?: { lat: number; lng: number };
    clientName?: string;
}

export function FieldWorkerNavigation({
    onBack,
    targetLocation = { lat: 40.7505, lng: -73.9934 }, // Default to Penn Station
    clientName = "Unknown Client"
}: FieldWorkerNavigationProps) {
    const [status, setStatus] = useState<'navigating' | 'arrived' | 'searching'>('navigating');

    const handleArrival = () => {
        setStatus('arrived');
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-neutral-200 px-4 py-4 flex items-center gap-3 shadow-sm z-10">
                <Button variant="ghost" size="icon" onClick={onBack}>
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">Navigating to Client</h1>
                    <p className="text-sm text-neutral-600">ETA: 12 mins • 0.8 miles</p>
                </div>
                <Button variant="outline" size="icon" className="rounded-full">
                    <Phone className="h-5 w-5" />
                </Button>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative">
                <MapContainer
                    center={[targetLocation.lat, targetLocation.lng]}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[targetLocation.lat, targetLocation.lng]}>
                        <Popup>
                            Client Location<br />
                            Last seen: 10 mins ago
                        </Popup>
                    </Marker>
                </MapContainer>

                {/* Floating Action Card */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/20 to-transparent">
                    <Card className="p-4 shadow-lg animate-in slide-in-from-bottom-10">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <MapPin className="h-6 w-6 text-primary-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{clientName}</h3>
                                <p className="text-sm text-neutral-600">Reported medical need (Chest pain)</p>
                                <div className="flex gap-2 mt-1">
                                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">High Priority</span>
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Medical</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {status === 'navigating' ? (
                                <>
                                    <Button
                                        className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                                        onClick={handleArrival}
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        I've Arrived
                                    </Button>
                                    <Button variant="outline" className="w-full">
                                        <Navigation2 className="h-4 w-4 mr-2" />
                                        Google Maps
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white col-span-2">
                                        Start Engagement
                                    </Button>
                                    <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                                        <AlertTriangle className="h-4 w-4 mr-2" />
                                        Client Not Found
                                    </Button>
                                    <Button variant="outline" className="w-full">
                                        Log Attempt
                                    </Button>
                                </>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
