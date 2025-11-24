import { useState, useEffect } from 'react';
import { ArrowLeft, Filter, Search, MoreVertical, CheckCircle, Clock, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { alertService, type Alert } from '../../services/alertService';
import { formatDistanceToNow } from 'date-fns';

interface AlertManagementProps {
    onBack?: () => void;
}

export function AlertManagement({ onBack }: AlertManagementProps) {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');

    useEffect(() => {
        const unsubscribe = alertService.subscribe(setAlerts);
        return unsubscribe;
    }, []);

    const filteredAlerts = alerts.filter(a => {
        if (filter === 'all') return true;
        if (filter === 'active') return a.status !== 'resolved';
        if (filter === 'resolved') return a.status === 'resolved';
        return true;
    });

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-neutral-200 px-6 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={onBack}>
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-semibold text-neutral-900">Alert Management</h1>
                            <p className="text-sm text-neutral-600">Real-time coordination center</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </Button>
                        <Button variant="outline">
                            <Search className="h-4 w-4 mr-2" />
                            Search
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-5xl mx-auto w-full p-6">
                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        onClick={() => setFilter('all')}
                        className="rounded-full"
                    >
                        All Alerts
                    </Button>
                    <Button
                        variant={filter === 'active' ? 'default' : 'outline'}
                        onClick={() => setFilter('active')}
                        className="rounded-full"
                    >
                        Active ({alerts.filter(a => a.status !== 'resolved').length})
                    </Button>
                    <Button
                        variant={filter === 'resolved' ? 'default' : 'outline'}
                        onClick={() => setFilter('resolved')}
                        className="rounded-full"
                    >
                        Resolved
                    </Button>
                </div>

                {/* Alert List */}
                <div className="space-y-4">
                    {filteredAlerts.map(alert => (
                        <Card key={alert.id} className={`p-5 transition-all hover:shadow-md ${alert.status === 'resolved' ? 'opacity-75 bg-neutral-50' : 'border-l-4 border-l-red-500'}`}>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Badge variant={alert.status === 'resolved' ? 'secondary' : 'default'} className={
                                            alert.status === 'active' ? 'bg-red-100 text-red-700 hover:bg-red-200' : ''
                                        }>
                                            {alert.status.toUpperCase()}
                                        </Badge>
                                        <span className="text-sm text-neutral-500 flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                                        </span>
                                        <span className="text-sm text-neutral-500 flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {alert.location.lat.toFixed(4)}, {alert.location.lng.toFixed(4)}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-1">
                                        {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Alert
                                    </h3>
                                    <p className="text-neutral-700 mb-3">{alert.details}</p>

                                    <div className="flex items-center gap-4">
                                        <div className="flex -space-x-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-bold text-blue-700">
                                                JD
                                            </div>
                                        </div>
                                        <span className="text-sm text-neutral-600">
                                            {alert.assignedWorkerId ? 'Assigned to John Doe' : 'Unassigned'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Button variant="outline" size="sm">
                                        View Details
                                    </Button>
                                    {alert.status !== 'resolved' && (
                                        <Button
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                            onClick={() => alertService.updateAlertStatus(alert.id, 'resolved')}
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Resolve
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
