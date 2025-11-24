import { useState } from 'react';
import { AlertCircle, ArrowLeft, MapPin, Phone, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { getCurrentLocation } from '../../services/navigation';

interface EmergencyAlertProps {
    onBack?: () => void;
    onAlertSent?: () => void;
}

type EmergencyType = 'medical' | 'safety' | 'shelter' | 'other';

export function EmergencyAlert({ onBack, onAlertSent }: EmergencyAlertProps) {
    const [selectedType, setSelectedType] = useState<EmergencyType | null>(null);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alertSent, setAlertSent] = useState(false);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

    const emergencyTypes: Array<{
        type: EmergencyType;
        label: string;
        icon: string;
        description: string;
        color: string;
    }> = [
            {
                type: 'medical',
                label: 'Medical Emergency',
                icon: '🏥',
                description: 'Injury, illness, or urgent medical need',
                color: 'red',
            },
            {
                type: 'safety',
                label: 'Safety Concern',
                icon: '🛡️',
                description: 'Feel unsafe or threatened',
                color: 'orange',
            },
            {
                type: 'shelter',
                label: 'Urgent Shelter Need',
                icon: '🏠',
                description: 'Need immediate safe place tonight',
                color: 'blue',
            },
            {
                type: 'other',
                label: 'Other Crisis',
                icon: '⚠️',
                description: 'Other urgent situation',
                color: 'purple',
            },
        ];

    const handleSubmit = async () => {
        if (!selectedType) return;

        setIsSubmitting(true);

        try {
            // Get current location
            const coords = await getCurrentLocation();
            setLocation(coords);

            // In production, send alert to coordinators via API
            // For now, simulate sending
            await new Promise(resolve => setTimeout(resolve, 1500));

            setAlertSent(true);
            onAlertSent?.();
        } catch (error) {
            console.error('Error sending alert:', error);
            // Still mark as sent even if location fails
            setAlertSent(true);
            onAlertSent?.();
        } finally {
            setIsSubmitting(false);
        }
    };

    if (alertSent) {
        return (
            <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
                <Card className="max-w-lg w-full p-8 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-green-900 mb-3">
                        Help Is On The Way
                    </h1>
                    <p className="text-lg text-green-800 mb-6">
                        We've notified our team. Someone will reach out to you soon.
                    </p>

                    {location && (
                        <div className="mb-6 p-4 bg-white rounded-lg border border-green-200">
                            <p className="text-sm text-neutral-600 mb-2">Your location shared:</p>
                            <p className="text-sm font-mono">
                                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                            </p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <p className="text-neutral-700">
                            <strong>What happens next:</strong>
                        </p>
                        <ul className="text-left space-y-2 text-neutral-700">
                            <li className="flex items-start gap-2">
                                <span className="text-green-600">✓</span>
                                <span>A coordinator has been alerted</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600">✓</span>
                                <span>They'll contact you within 15 minutes</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600">✓</span>
                                <span>Help is being arranged for you</span>
                            </li>
                        </ul>
                    </div>

                    <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-900 mb-3">
                            <strong>Life-threatening emergency?</strong>
                        </p>
                        <Button size="lg" variant="destructive" className="w-full" asChild>
                            <a href="tel:911" className="text-xl">
                                Call 911 Now
                            </a>
                        </Button>
                    </div>

                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full mt-4"
                        onClick={onBack}
                    >
                        Back to Home
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-red-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-red-200 px-4 py-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={onBack}>
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-xl font-semibold text-red-900">Emergency Alert</h1>
                        <p className="text-sm text-red-700">Get immediate help</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-2xl mx-auto">
                    {/* 911 Warning */}
                    <Card className="p-6 mb-6 bg-red-100 border-2 border-red-300">
                        <div className="flex items-start gap-4">
                            <AlertCircle className="h-8 w-8 text-red-600 flex-shrink-0" />
                            <div className="flex-1">
                                <h2 className="text-lg font-bold text-red-900 mb-2">
                                    Life-Threatening Emergency?
                                </h2>
                                <p className="text-red-800 mb-4">
                                    If you or someone else is in immediate danger, call 911 right now.
                                </p>
                                <Button size="lg" variant="destructive" className="w-full" asChild>
                                    <a href="tel:911" className="text-xl">
                                        <Phone className="h-6 w-6 mr-2" />
                                        Call 911
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Emergency Type Selection */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-4">What do you need help with?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {emergencyTypes.map((type) => (
                                <Card
                                    key={type.type}
                                    className={`p-6 cursor-pointer transition-all ${selectedType === type.type
                                            ? `border-2 border-${type.color}-500 bg-${type.color}-50`
                                            : 'border-2 border-neutral-200 hover:border-neutral-300'
                                        }`}
                                    onClick={() => setSelectedType(type.type)}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="text-4xl">{type.icon}</div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold mb-1">{type.label}</h3>
                                            <p className="text-sm text-neutral-600">{type.description}</p>
                                        </div>
                                        {selectedType === type.type && (
                                            <CheckCircle className="h-6 w-6 text-green-600" />
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Additional Message */}
                    {selectedType && (
                        <div className="mb-6">
                            <label className="block text-lg font-semibold mb-2">
                                Anything else we should know? (Optional)
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Tell us more about your situation..."
                                className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500 text-lg"
                                rows={4}
                            />
                        </div>
                    )}

                    {/* Location Sharing Info */}
                    {selectedType && (
                        <Card className="p-4 mb-6 bg-blue-50 border border-blue-200">
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1 text-sm text-blue-900">
                                    <p className="font-semibold mb-1">We'll share your location</p>
                                    <p>
                                        This helps our team find you quickly. Your location will only be
                                        shared with the coordinator helping you.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Submit Button */}
                    {selectedType && (
                        <Button
                            size="lg"
                            className="w-full text-xl py-6"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" />
                                    Sending Alert...
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="h-6 w-6 mr-2" />
                                    Send Emergency Alert
                                </>
                            )}
                        </Button>
                    )}

                    {/* Alternative Help */}
                    <div className="mt-8 p-6 bg-white rounded-lg border border-neutral-200">
                        <h3 className="font-semibold mb-3">Other Ways to Get Help:</h3>
                        <div className="space-y-3">
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <a href="tel:311">
                                    <Phone className="h-5 w-5 mr-3" />
                                    Call NYC 311 (24/7 city services)
                                </a>
                            </Button>
                            <Button variant="outline" className="w-full justify-start" asChild>
                                <a href="tel:988">
                                    <Phone className="h-5 w-5 mr-3" />
                                    Call 988 (Suicide & Crisis Lifeline)
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
