import { useEffect, useState } from 'react';
import { TrendingDown, TrendingUp, Minus, Info } from 'lucide-react';
import { Card } from './ui/card';
import {
    getLatestCensus,
    getCensusHistory,
    getCapacityIndicator,
    getBestTimeRecommendation,
    formatNumber,
    type DHSCensusDataParsed,
    type CapacityIndicator,
} from '../services/dhsData';

export function DHSCapacityInsight() {
    const [latestData, setLatestData] = useState<DHSCensusDataParsed | null>(null);
    const [indicator, setIndicator] = useState<CapacityIndicator>('moderate');
    const [recommendation, setRecommendation] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setIsLoading(true);
            setError(null);

            // Fetch latest and historical data
            const [latest, history] = await Promise.all([
                getLatestCensus(),
                getCensusHistory(30),
            ]);

            if (!latest) {
                throw new Error('No data available');
            }

            setLatestData(latest);

            // Calculate indicator and recommendation
            const capacityIndicator = getCapacityIndicator(latest.totalIndividuals, history);
            setIndicator(capacityIndicator);

            const bestTime = getBestTimeRecommendation(history);
            setRecommendation(bestTime);
        } catch (err) {
            console.error('Error loading DHS data:', err);
            setError('Unable to load shelter data');
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return (
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-green-50">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-neutral-200 rounded-full animate-pulse" />
                    <div className="flex-1 space-y-2">
                        <div className="h-6 bg-neutral-200 rounded animate-pulse w-3/4" />
                        <div className="h-4 bg-neutral-200 rounded animate-pulse w-1/2" />
                    </div>
                </div>
            </Card>
        );
    }

    if (error || !latestData) {
        return null; // Silently fail - don't show error to vulnerable users
    }

    const indicatorConfig = {
        low: {
            color: 'bg-green-100',
            iconColor: 'text-green-600',
            borderColor: 'border-green-300',
            icon: <TrendingDown className="h-8 w-8" />,
            label: 'Lower than usual',
            message: 'Good time to seek shelter',
        },
        moderate: {
            color: 'bg-blue-100',
            iconColor: 'text-blue-600',
            borderColor: 'border-blue-300',
            icon: <Minus className="h-8 w-8" />,
            label: 'Typical occupancy',
            message: 'Shelters accepting applications',
        },
        high: {
            color: 'bg-orange-100',
            iconColor: 'text-orange-600',
            borderColor: 'border-orange-300',
            icon: <TrendingUp className="h-8 w-8" />,
            label: 'Busier than usual',
            message: 'Still accepting applications',
        },
    };

    const config = indicatorConfig[indicator];

    return (
        <Card className={`p-6 bg-gradient-to-br from-blue-50 to-green-50 border-2 ${config.borderColor}`}>
            <div className="flex items-start gap-4">
                {/* Indicator Icon */}
                <div className={`w-16 h-16 ${config.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <div className={config.iconColor}>
                        {config.icon}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">NYC Shelter System</h3>
                    <p className="text-lg text-neutral-700 mb-3">
                        {config.label} • {config.message}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-white bg-opacity-60 rounded-lg p-3">
                            <p className="text-sm text-neutral-600">People in shelters today</p>
                            <p className="text-2xl font-bold text-neutral-900">
                                {formatNumber(latestData.totalIndividuals)}
                            </p>
                        </div>
                        <div className="bg-white bg-opacity-60 rounded-lg p-3">
                            <p className="text-sm text-neutral-600">Families with children</p>
                            <p className="text-2xl font-bold text-neutral-900">
                                {formatNumber(latestData.familiesWithChildren)}
                            </p>
                        </div>
                    </div>

                    {/* Recommendation */}
                    {recommendation && (
                        <div className="flex items-start gap-2 p-3 bg-white bg-opacity-80 rounded-lg">
                            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-neutral-900 mb-1">💡 Helpful Tip</p>
                                <p className="text-sm text-neutral-700">{recommendation}</p>
                            </div>
                        </div>
                    )}

                    {/* Data source note */}
                    <p className="text-xs text-neutral-500 mt-3">
                        Data from NYC Department of Homeless Services • Updated daily
                    </p>
                </div>
            </div>
        </Card>
    );
}
