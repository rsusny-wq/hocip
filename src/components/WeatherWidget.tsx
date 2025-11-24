import { useEffect, useState } from 'react';
import { AlertTriangle, ThermometerSun, Wind } from 'lucide-react';
import { Card } from './ui/card';
import {
    getCurrentWeather,
    generateWeatherAlerts,
    getWeatherIcon,
    formatTemperature,
    type WeatherData,
    type WeatherAlert,
} from '../services/weather';

interface WeatherWidgetProps {
    latitude?: number;
    longitude?: number;
}

export function WeatherWidget({ latitude = 40.7128, longitude = -74.0060 }: WeatherWidgetProps) {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadWeather();
        // Refresh every 15 minutes
        const interval = setInterval(loadWeather, 15 * 60 * 1000);
        return () => clearInterval(interval);
    }, [latitude, longitude]);

    async function loadWeather() {
        try {
            const data = await getCurrentWeather(latitude, longitude);
            if (data) {
                setWeather(data);
                const weatherAlerts = generateWeatherAlerts(data);
                setAlerts(weatherAlerts);
            }
        } catch (error) {
            console.error('Error loading weather:', error);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return (
            <Card className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white bg-opacity-50 rounded-full animate-pulse" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-white bg-opacity-50 rounded animate-pulse w-24" />
                        <div className="h-3 bg-white bg-opacity-50 rounded animate-pulse w-32" />
                    </div>
                </div>
            </Card>
        );
    }

    if (!weather) {
        return null; // Silently fail
    }

    const hasDangerousAlerts = alerts.some(a => a.severity === 'danger');
    const hasWarnings = alerts.some(a => a.severity === 'warning');

    return (
        <div className="space-y-3">
            {/* Weather Alerts */}
            {alerts.map((alert, index) => (
                <Card
                    key={index}
                    className={`p-4 border-2 ${alert.severity === 'danger'
                            ? 'bg-red-50 border-red-300'
                            : alert.severity === 'warning'
                                ? 'bg-orange-50 border-orange-300'
                                : 'bg-blue-50 border-blue-300'
                        }`}
                >
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">{alert.icon}</div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg mb-1">{alert.title}</h3>
                            <p className="text-sm">{alert.message}</p>
                        </div>
                        {alert.severity === 'danger' && (
                            <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
                        )}
                    </div>
                </Card>
            ))}

            {/* Current Weather */}
            {!hasDangerousAlerts && !hasWarnings && (
                <Card className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100">
                    <div className="flex items-center gap-4">
                        <div className="text-5xl">{getWeatherIcon(weather.weatherCode)}</div>
                        <div className="flex-1">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold">
                                    {formatTemperature(weather.temperatureFahrenheit)}
                                </span>
                                <span className="text-sm text-neutral-600">
                                    Feels like {formatTemperature(weather.feelsLikeFahrenheit)}
                                </span>
                            </div>
                            <p className="text-neutral-700 mt-1">{weather.weatherDescription}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-neutral-600">
                                <div className="flex items-center gap-1">
                                    <Wind className="h-4 w-4" />
                                    <span>{Math.round(weather.windSpeedMph)} mph</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
