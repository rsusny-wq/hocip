import { useState } from 'react';
import { MessageCircle, MapPin, AlertCircle, Heart, Phone } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { DHSCapacityInsight } from '../DHSCapacityInsight';
import { WeatherWidget } from '../WeatherWidget';

interface VulnerableUserHomeProps {
    onNavigate?: (screen: string) => void;
}

export function VulnerableUserHome({ onNavigate }: VulnerableUserHomeProps) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-4">
            {/* Header */}
            <div className="max-w-2xl mx-auto mb-8 text-center pt-8">
                <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-neutral-900 mb-3">
                    We're Here to Help
                </h1>
                <p className="text-xl text-neutral-700">
                    Find shelter, food, medical care, and support near you
                </p>
            </div>

            {/* Main Actions */}
            <div className="max-w-2xl mx-auto space-y-4">
                {/* Chat with AI */}
                <Card
                    className="p-8 hover:shadow-2xl transition-all cursor-pointer border-2 border-primary-200 bg-white"
                    onClick={() => onNavigate?.('ai-chat')}
                >
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <MessageCircle className="h-10 w-10 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2">Chat for Help</h2>
                            <p className="text-lg text-neutral-600">
                                Tell us what you need. We'll help you find services.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Find Services on Map */}
                <Card
                    className="p-8 hover:shadow-2xl transition-all cursor-pointer border-2 border-green-200 bg-white"
                    onClick={() => onNavigate?.('find-help')}
                >
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <MapPin className="h-10 w-10 text-green-600" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2">Find Help Near Me</h2>
                            <p className="text-lg text-neutral-600">
                                See shelters, food, and services on a map.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Emergency Alert */}
                <Card
                    className="p-8 hover:shadow-2xl transition-all cursor-pointer border-2 border-red-200 bg-red-50"
                    onClick={() => onNavigate?.('emergency-alert')}
                >
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="h-10 w-10 text-red-600" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2 text-red-900">Need Help Now?</h2>
                            <p className="text-lg text-red-800">
                                Get immediate assistance from our team.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Call 311 */}
                <Card className="p-6 bg-neutral-100 border-2 border-neutral-300">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Phone className="h-8 w-8 text-neutral-700" />
                            <div>
                                <p className="text-lg font-semibold">Call NYC 311</p>
                                <p className="text-sm text-neutral-600">24/7 city services</p>
                            </div>
                        </div>
                        <Button size="lg" asChild>
                            <a href="tel:311" className="text-xl px-8">
                                Call
                            </a>
                        </Button>
                    </div>
                </Card>

                {/* Weather Widget */}
                <WeatherWidget latitude={40.7128} longitude={-74.0060} />

                {/* DHS Capacity Insight */}
                <DHSCapacityInsight />
            </div>

            {/* Info Section */}
            <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">You're Not Alone</h3>
                <div className="space-y-3 text-neutral-700">
                    <p className="flex items-start gap-3">
                        <span className="text-2xl">🏠</span>
                        <span>We can help you find a safe place to stay tonight</span>
                    </p>
                    <p className="flex items-start gap-3">
                        <span className="text-2xl">🍽️</span>
                        <span>Free meals and food assistance available</span>
                    </p>
                    <p className="flex items-start gap-3">
                        <span className="text-2xl">🏥</span>
                        <span>Medical care with no ID or insurance required</span>
                    </p>
                    <p className="flex items-start gap-3">
                        <span className="text-2xl">🤝</span>
                        <span>All services are free and confidential</span>
                    </p>
                </div>
            </div>

            {/* Language Selector */}
            <div className="max-w-2xl mx-auto mt-8 text-center">
                <p className="text-sm text-neutral-600 mb-3">Choose your language:</p>
                <div className="flex flex-wrap justify-center gap-2">
                    <Button variant="outline" size="sm">English</Button>
                    <Button variant="outline" size="sm">Español</Button>
                    <Button variant="outline" size="sm">中文</Button>
                    <Button variant="outline" size="sm">العربية</Button>
                    <Button variant="outline" size="sm">Русский</Button>
                    <Button variant="outline" size="sm">Kreyòl</Button>
                </div>
            </div>
        </div>
    );
}
