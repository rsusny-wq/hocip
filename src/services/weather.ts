/**
 * Weather Service using Open-Meteo API
 * Free, no API key required, global coverage
 * https://open-meteo.com/
 */

export interface WeatherData {
    temperature: number; // Celsius
    temperatureFahrenheit: number;
    feelsLike: number;
    feelsLikeFahrenheit: number;
    weatherCode: number;
    weatherDescription: string;
    windSpeed: number; // km/h
    windSpeedMph: number;
    precipitation: number; // mm
    humidity: number; // %
    timestamp: Date;
}

export interface WeatherForecast {
    date: Date;
    temperatureMax: number;
    temperatureMin: number;
    weatherCode: number;
    weatherDescription: string;
    precipitationProbability: number;
}

export interface WeatherAlert {
    severity: 'info' | 'warning' | 'danger';
    title: string;
    message: string;
    icon: string;
}

const WEATHER_API_BASE = 'https://api.open-meteo.com/v1';

// Weather code descriptions
const WEATHER_CODES: { [key: number]: string } = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
};

/**
 * Get current weather for a location
 */
export async function getCurrentWeather(
    lat: number,
    lng: number
): Promise<WeatherData | null> {
    try {
        const response = await fetch(
            `${WEATHER_API_BASE}/forecast?` +
            new URLSearchParams({
                latitude: lat.toString(),
                longitude: lng.toString(),
                current_weather: 'true',
                temperature_unit: 'celsius',
                windspeed_unit: 'kmh',
            })
        );

        if (!response.ok) {
            throw new Error('Weather API error');
        }

        const data = await response.json();
        const current = data.current_weather;

        return {
            temperature: current.temperature,
            temperatureFahrenheit: celsiusToFahrenheit(current.temperature),
            feelsLike: current.temperature, // Simplified, could calculate with wind chill
            feelsLikeFahrenheit: celsiusToFahrenheit(current.temperature),
            weatherCode: current.weathercode,
            weatherDescription: WEATHER_CODES[current.weathercode] || 'Unknown',
            windSpeed: current.windspeed,
            windSpeedMph: kmhToMph(current.windspeed),
            precipitation: 0, // Current weather doesn't include this
            humidity: 0, // Would need additional API call
            timestamp: new Date(current.time),
        };
    } catch (error) {
        console.error('Error fetching weather:', error);
        return null;
    }
}

/**
 * Get 7-day weather forecast
 */
export async function getWeatherForecast(
    lat: number,
    lng: number,
    days: number = 7
): Promise<WeatherForecast[]> {
    try {
        const response = await fetch(
            `${WEATHER_API_BASE}/forecast?` +
            new URLSearchParams({
                latitude: lat.toString(),
                longitude: lng.toString(),
                daily: 'temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max',
                temperature_unit: 'celsius',
                forecast_days: days.toString(),
            })
        );

        if (!response.ok) {
            throw new Error('Weather API error');
        }

        const data = await response.json();
        const daily = data.daily;

        return daily.time.map((time: string, index: number) => ({
            date: new Date(time),
            temperatureMax: daily.temperature_2m_max[index],
            temperatureMin: daily.temperature_2m_min[index],
            weatherCode: daily.weathercode[index],
            weatherDescription: WEATHER_CODES[daily.weathercode[index]] || 'Unknown',
            precipitationProbability: daily.precipitation_probability_max[index] || 0,
        }));
    } catch (error) {
        console.error('Error fetching forecast:', error);
        return [];
    }
}

/**
 * Generate weather alerts for vulnerable populations
 */
export function generateWeatherAlerts(weather: WeatherData): WeatherAlert[] {
    const alerts: WeatherAlert[] = [];

    // Extreme cold alert
    if (weather.temperatureFahrenheit <= 32) {
        alerts.push({
            severity: weather.temperatureFahrenheit <= 20 ? 'danger' : 'warning',
            title: 'Freezing Temperature Alert',
            message: `Temperature is ${Math.round(weather.temperatureFahrenheit)}°F. Seek indoor shelter immediately.`,
            icon: '❄️',
        });
    }

    // Extreme heat alert
    if (weather.temperatureFahrenheit >= 90) {
        alerts.push({
            severity: weather.temperatureFahrenheit >= 100 ? 'danger' : 'warning',
            title: 'Extreme Heat Alert',
            message: `Temperature is ${Math.round(weather.temperatureFahrenheit)}°F. Stay hydrated and seek cooling centers.`,
            icon: '🌡️',
        });
    }

    // Precipitation alert
    if (weather.weatherCode >= 61 && weather.weatherCode <= 82) {
        alerts.push({
            severity: 'warning',
            title: 'Rain Alert',
            message: `${weather.weatherDescription}. Seek dry shelter.`,
            icon: '🌧️',
        });
    }

    // Snow alert
    if (weather.weatherCode >= 71 && weather.weatherCode <= 86) {
        alerts.push({
            severity: 'warning',
            title: 'Snow Alert',
            message: `${weather.weatherDescription}. Seek warm shelter immediately.`,
            icon: '🌨️',
        });
    }

    // Thunderstorm alert
    if (weather.weatherCode >= 95) {
        alerts.push({
            severity: 'danger',
            title: 'Severe Weather Alert',
            message: 'Thunderstorm detected. Seek indoor shelter immediately.',
            icon: '⛈️',
        });
    }

    return alerts;
}

/**
 * Get weather-based recommendations
 */
export function getWeatherRecommendations(weather: WeatherData): string[] {
    const recommendations: string[] = [];

    if (weather.temperatureFahrenheit <= 32) {
        recommendations.push('Visit a warming center or shelter');
        recommendations.push('Wear layers and cover extremities');
        recommendations.push('Avoid prolonged outdoor exposure');
    }

    if (weather.temperatureFahrenheit >= 90) {
        recommendations.push('Visit a cooling center or library');
        recommendations.push('Drink plenty of water');
        recommendations.push('Avoid strenuous activity');
    }

    if (weather.weatherCode >= 61) {
        recommendations.push('Seek dry indoor location');
        recommendations.push('Protect belongings from water');
    }

    if (recommendations.length === 0) {
        recommendations.push('Weather conditions are moderate');
        recommendations.push('Good time for outdoor activities');
    }

    return recommendations;
}

/**
 * Format temperature for display
 */
export function formatTemperature(fahrenheit: number): string {
    return `${Math.round(fahrenheit)}°F`;
}

/**
 * Get weather icon emoji
 */
export function getWeatherIcon(weatherCode: number): string {
    if (weatherCode === 0 || weatherCode === 1) return '☀️';
    if (weatherCode === 2) return '⛅';
    if (weatherCode === 3) return '☁️';
    if (weatherCode >= 45 && weatherCode <= 48) return '🌫️';
    if (weatherCode >= 51 && weatherCode <= 65) return '🌧️';
    if (weatherCode >= 71 && weatherCode <= 86) return '🌨️';
    if (weatherCode >= 95) return '⛈️';
    return '🌤️';
}

/**
 * Helper: Celsius to Fahrenheit
 */
function celsiusToFahrenheit(celsius: number): number {
    return (celsius * 9 / 5) + 32;
}

/**
 * Helper: km/h to mph
 */
function kmhToMph(kmh: number): number {
    return kmh * 0.621371;
}

/**
 * Check if weather is dangerous for vulnerable populations
 */
export function isDangerousWeather(weather: WeatherData): boolean {
    return (
        weather.temperatureFahrenheit <= 20 ||
        weather.temperatureFahrenheit >= 100 ||
        weather.weatherCode >= 95 // Thunderstorm
    );
}
