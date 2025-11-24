/**
 * NYC DHS Daily Report API Service
 * Data source: https://data.cityofnewyork.us/resource/k46n-sa2m.json
 * Updates: Daily (morning)
 */

const DHS_API_BASE = 'https://data.cityofnewyork.us/resource/k46n-sa2m.json';
const CACHE_KEY = 'dhs_census_cache';
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface DHSCensusData {
    date_of_census: string;
    total_individuals_in_shelter: string;
    total_adults_in_shelter: string;
    total_children_in_shelter: string;
    single_adult_men_in_shelter: string;
    single_adult_women_in_shelter: string;
    total_single_adults_in_shelter: string;
    families_with_children_in_shelter: string;
    adults_in_families_with_children_in_shelter: string;
    children_in_families_with_children_in_shelter: string;
    total_individuals_in_families_with_children_in_shelter_: string;
    adult_families_in_shelter: string;
    individuals_in_adult_families_in_shelter: string;
}

export interface DHSCensusDataParsed {
    date: Date;
    totalIndividuals: number;
    totalAdults: number;
    totalChildren: number;
    singleAdultMen: number;
    singleAdultWomen: number;
    totalSingleAdults: number;
    familiesWithChildren: number;
    adultsInFamilies: number;
    childrenInFamilies: number;
    adultFamilies: number;
    individualsInAdultFamilies: number;
}

export interface DHSTrend {
    date: Date;
    total: number;
    change: number;
    changePercent: number;
}

export interface CachedDHSData {
    data: DHSCensusData[];
    lastFetched: string;
    expiresAt: string;
}

export type CapacityIndicator = 'low' | 'moderate' | 'high';

/**
 * Parse raw API data to typed format
 */
function parseRawData(raw: DHSCensusData): DHSCensusDataParsed {
    return {
        date: new Date(raw.date_of_census),
        totalIndividuals: parseInt(raw.total_individuals_in_shelter),
        totalAdults: parseInt(raw.total_adults_in_shelter),
        totalChildren: parseInt(raw.total_children_in_shelter),
        singleAdultMen: parseInt(raw.single_adult_men_in_shelter),
        singleAdultWomen: parseInt(raw.single_adult_women_in_shelter),
        totalSingleAdults: parseInt(raw.total_single_adults_in_shelter),
        familiesWithChildren: parseInt(raw.families_with_children_in_shelter),
        adultsInFamilies: parseInt(raw.adults_in_families_with_children_in_shelter),
        childrenInFamilies: parseInt(raw.children_in_families_with_children_in_shelter),
        adultFamilies: parseInt(raw.adult_families_in_shelter),
        individualsInAdultFamilies: parseInt(raw.individuals_in_adult_families_in_shelter),
    };
}

/**
 * Get cached data if available and fresh
 */
function getCachedData(): DHSCensusData[] | null {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const data: CachedDHSData = JSON.parse(cached);
        const expiresAt = new Date(data.expiresAt);

        if (expiresAt > new Date()) {
            return data.data;
        }

        return null;
    } catch (error) {
        console.error('Error reading DHS cache:', error);
        return null;
    }
}

/**
 * Cache data in localStorage
 */
function cacheData(data: DHSCensusData[]): void {
    try {
        const cache: CachedDHSData = {
            data,
            lastFetched: new Date().toISOString(),
            expiresAt: new Date(Date.now() + CACHE_DURATION_MS).toISOString(),
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
        console.error('Error caching DHS data:', error);
    }
}

/**
 * Fetch latest census data (today's or most recent)
 */
export async function getLatestCensus(): Promise<DHSCensusDataParsed | null> {
    try {
        // Check cache first
        const cached = getCachedData();
        if (cached && cached.length > 0) {
            return parseRawData(cached[0]);
        }

        // Fetch from API
        const response = await fetch(`${DHS_API_BASE}?$order=date_of_census DESC&$limit=1`);
        if (!response.ok) {
            throw new Error(`DHS API error: ${response.statusText}`);
        }

        const data: DHSCensusData[] = await response.json();
        if (data.length === 0) return null;

        // Cache the result
        cacheData(data);

        return parseRawData(data[0]);
    } catch (error) {
        console.error('Error fetching latest DHS census:', error);
        return null;
    }
}

/**
 * Fetch last N days of census data
 */
export async function getCensusHistory(days: number = 30): Promise<DHSCensusDataParsed[]> {
    try {
        // Check cache first
        const cached = getCachedData();
        if (cached && cached.length >= days) {
            return cached.slice(0, days).map(parseRawData);
        }

        // Fetch from API
        const response = await fetch(
            `${DHS_API_BASE}?$order=date_of_census DESC&$limit=${days}`
        );
        if (!response.ok) {
            throw new Error(`DHS API error: ${response.statusText}`);
        }

        const data: DHSCensusData[] = await response.json();

        // Cache the result
        cacheData(data);

        return data.map(parseRawData);
    } catch (error) {
        console.error('Error fetching DHS census history:', error);

        // Try to return cached data as fallback
        const cached = getCachedData();
        if (cached) {
            return cached.slice(0, days).map(parseRawData);
        }

        return [];
    }
}

/**
 * Calculate trends from historical data
 */
export function calculateTrends(data: DHSCensusDataParsed[]): DHSTrend[] {
    if (data.length < 2) return [];

    return data.slice(0, -1).map((current, index) => {
        const previous = data[index + 1];
        const change = current.totalIndividuals - previous.totalIndividuals;
        const changePercent = (change / previous.totalIndividuals) * 100;

        return {
            date: current.date,
            total: current.totalIndividuals,
            change,
            changePercent,
        };
    });
}

/**
 * Get capacity indicator based on current vs historical average
 */
export function getCapacityIndicator(
    current: number,
    historical: DHSCensusDataParsed[]
): CapacityIndicator {
    if (historical.length === 0) return 'moderate';

    const average = historical.reduce((sum, d) => sum + d.totalIndividuals, 0) / historical.length;
    const percentDiff = ((current - average) / average) * 100;

    if (percentDiff < -3) return 'low'; // 3% below average
    if (percentDiff > 3) return 'high'; // 3% above average
    return 'moderate';
}

/**
 * Get best time recommendation based on day-of-week patterns
 */
export function getBestTimeRecommendation(historical: DHSCensusDataParsed[]): string {
    if (historical.length < 7) {
        return 'Visit early morning (8-10 AM) for best availability';
    }

    // Calculate average occupancy by day of week
    const dayAverages: { [key: number]: number[] } = {
        0: [], // Sunday
        1: [], // Monday
        2: [], // Tuesday
        3: [], // Wednesday
        4: [], // Thursday
        5: [], // Friday
        6: [], // Saturday
    };

    historical.forEach((data) => {
        const dayOfWeek = data.date.getDay();
        dayAverages[dayOfWeek].push(data.totalIndividuals);
    });

    // Calculate averages
    const averages = Object.entries(dayAverages).map(([day, values]) => ({
        day: parseInt(day),
        average: values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0,
    }));

    // Find lowest occupancy day
    const lowestDay = averages.reduce((min, curr) =>
        curr.average < min.average && curr.average > 0 ? curr : min
    );

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[lowestDay.day];

    // Calculate percentage difference
    const overallAverage = averages.reduce((sum, d) => sum + d.average, 0) / averages.length;
    const percentLower = ((overallAverage - lowestDay.average) / overallAverage) * 100;

    if (percentLower > 2) {
        return `Shelter occupancy is typically ${percentLower.toFixed(0)}% lower on ${dayName}s`;
    }

    return 'Visit early morning (8-10 AM) for best availability';
}

/**
 * Get demographic breakdown
 */
export function getDemographicBreakdown(data: DHSCensusDataParsed) {
    return {
        singleAdults: {
            total: data.totalSingleAdults,
            men: data.singleAdultMen,
            women: data.singleAdultWomen,
            percentage: (data.totalSingleAdults / data.totalIndividuals) * 100,
        },
        families: {
            total: data.familiesWithChildren,
            adults: data.adultsInFamilies,
            children: data.childrenInFamilies,
            percentage: ((data.adultsInFamilies + data.childrenInFamilies) / data.totalIndividuals) * 100,
        },
        adultFamilies: {
            total: data.adultFamilies,
            individuals: data.individualsInAdultFamilies,
            percentage: (data.individualsInAdultFamilies / data.totalIndividuals) * 100,
        },
    };
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
    return num.toLocaleString('en-US');
}

/**
 * Get cache info for debugging
 */
export function getCacheInfo(): { lastFetched: string; expiresAt: string } | null {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const data: CachedDHSData = JSON.parse(cached);
        return {
            lastFetched: data.lastFetched,
            expiresAt: data.expiresAt,
        };
    } catch {
        return null;
    }
}

/**
 * Clear cache (for testing)
 */
export function clearCache(): void {
    localStorage.removeItem(CACHE_KEY);
}
