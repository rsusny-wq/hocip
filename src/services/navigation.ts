/**
 * Navigation Service for routing, geocoding, and location tracking
 * Uses OpenStreetMap Nominatim API and Leaflet Routing Machine
 */

export interface Coordinates {
    lat: number;
    lng: number;
}

export interface Route {
    coordinates: Coordinates[];
    distance: number; // in meters
    duration: number; // in seconds
    instructions: RouteInstruction[];
}

export interface RouteInstruction {
    text: string;
    distance: number;
    time: number;
    direction?: string;
}

export interface GeocodingResult {
    lat: number;
    lng: number;
    displayName: string;
    address: {
        road?: string;
        city?: string;
        state?: string;
        postcode?: string;
    };
}

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

/**
 * Geocode an address to coordinates
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
    try {
        const response = await fetch(
            `${NOMINATIM_BASE_URL}/search?` +
            new URLSearchParams({
                q: address,
                format: 'json',
                limit: '1',
                addressdetails: '1',
            }),
            {
                headers: {
                    'User-Agent': 'HOCI-Platform/1.0',
                },
            }
        );

        if (!response.ok) {
            throw new Error('Geocoding failed');
        }

        const data = await response.json();

        if (data.length === 0) {
            return null;
        }

        const result = data[0];
        return {
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon),
            displayName: result.display_name,
            address: {
                road: result.address?.road,
                city: result.address?.city,
                state: result.address?.state,
                postcode: result.address?.postcode,
            },
        };
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}

/**
 * Reverse geocode coordinates to address
 */
export async function reverseGeocode(lat: number, lng: number): Promise<GeocodingResult | null> {
    try {
        const response = await fetch(
            `${NOMINATIM_BASE_URL}/reverse?` +
            new URLSearchParams({
                lat: lat.toString(),
                lon: lng.toString(),
                format: 'json',
                addressdetails: '1',
            }),
            {
                headers: {
                    'User-Agent': 'HOCI-Platform/1.0',
                },
            }
        );

        if (!response.ok) {
            throw new Error('Reverse geocoding failed');
        }

        const result = await response.json();

        return {
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon),
            displayName: result.display_name,
            address: {
                road: result.address?.road,
                city: result.address?.city,
                state: result.address?.state,
                postcode: result.address?.postcode,
            },
        };
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        return null;
    }
}

/**
 * Calculate route between two points
 * Note: This is a simplified version. In production, use Leaflet Routing Machine
 */
export async function getRoute(
    origin: Coordinates,
    destination: Coordinates
): Promise<Route | null> {
    try {
        // Using OSRM (Open Source Routing Machine) public API
        const response = await fetch(
            `https://router.project-osrm.org/route/v1/walking/` +
            `${origin.lng},${origin.lat};${destination.lng},${destination.lat}?` +
            new URLSearchParams({
                overview: 'full',
                steps: 'true',
                geometries: 'geojson',
            })
        );

        if (!response.ok) {
            throw new Error('Routing failed');
        }

        const data = await response.json();

        if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
            return null;
        }

        const route = data.routes[0];
        const coordinates: Coordinates[] = route.geometry.coordinates.map(
            (coord: [number, number]) => ({
                lng: coord[0],
                lat: coord[1],
            })
        );

        const instructions: RouteInstruction[] = route.legs[0].steps.map((step: any) => ({
            text: step.maneuver.instruction || 'Continue',
            distance: step.distance,
            time: step.duration,
            direction: step.maneuver.modifier,
        }));

        return {
            coordinates,
            distance: route.distance,
            duration: route.duration,
            instructions,
        };
    } catch (error) {
        console.error('Routing error:', error);
        return null;
    }
}

/**
 * Calculate ETA based on route
 */
export function calculateETA(route: Route): Date {
    const now = new Date();
    const etaMs = now.getTime() + route.duration * 1000;
    return new Date(etaMs);
}

/**
 * Format distance for display
 */
export function formatDistance(meters: number): string {
    if (meters < 1000) {
        return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Format duration for display
 */
export function formatDuration(seconds: number): string {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
        return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
}

/**
 * Get current location using browser geolocation API
 */
export function getCurrentLocation(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => {
                reject(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    });
}

/**
 * Watch location changes
 */
export function watchLocation(
    callback: (coords: Coordinates) => void,
    errorCallback?: (error: GeolocationPositionError) => void
): number {
    if (!navigator.geolocation) {
        throw new Error('Geolocation not supported');
    }

    return navigator.geolocation.watchPosition(
        (position) => {
            callback({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });
        },
        errorCallback,
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 5000,
        }
    );
}

/**
 * Stop watching location
 */
export function stopWatchingLocation(watchId: number): void {
    navigator.geolocation.clearWatch(watchId);
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export function calculateDistance(
    coord1: Coordinates,
    coord2: Coordinates
): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (coord1.lat * Math.PI) / 180;
    const φ2 = (coord2.lat * Math.PI) / 180;
    const Δφ = ((coord2.lat - coord1.lat) * Math.PI) / 180;
    const Δλ = ((coord2.lng - coord1.lng) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

/**
 * Check if location services are available
 */
export function isGeolocationAvailable(): boolean {
    return 'geolocation' in navigator;
}

/**
 * Request location permission
 */
export async function requestLocationPermission(): Promise<boolean> {
    try {
        const coords = await getCurrentLocation();
        return true;
    } catch (error) {
        console.error('Location permission denied:', error);
        return false;
    }
}
