/**
 * Alert Service
 * Manages emergency alerts and coordination between users.
 * Uses localStorage to simulate a backend database.
 */

import { Coordinates } from './navigation';

export type AlertType = 'medical' | 'shelter' | 'crisis' | 'food' | 'other';
export type AlertPriority = 'low' | 'medium' | 'high' | 'critical';
export type AlertStatus = 'active' | 'assigned' | 'resolved';

export interface Alert {
    id: string;
    userId: string; // "Anonymous" or specific ID
    type: AlertType;
    priority: AlertPriority;
    status: AlertStatus;
    location: Coordinates;
    timestamp: number;
    details?: string;
    assignedWorkerId?: string;
}

const STORAGE_KEY = 'hoci_alerts';

// Mock initial data
const MOCK_ALERTS: Alert[] = [
    {
        id: 'alert-1',
        userId: 'user-123',
        type: 'medical',
        priority: 'high',
        status: 'active',
        location: { lat: 40.7505, lng: -73.9934 }, // Penn Station
        timestamp: Date.now() - 1000 * 60 * 30, // 30 mins ago
        details: 'User reported chest pain',
    },
    {
        id: 'alert-2',
        userId: 'user-456',
        type: 'shelter',
        priority: 'medium',
        status: 'active',
        location: { lat: 40.7410, lng: -73.9897 }, // Flatiron
        timestamp: Date.now() - 1000 * 60 * 120, // 2 hours ago
        details: 'Requesting shelter for tonight',
    }
];

class AlertService {
    private listeners: ((alerts: Alert[]) => void)[] = [];

    constructor() {
        // Initialize storage if empty
        if (!localStorage.getItem(STORAGE_KEY)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_ALERTS));
        }
    }

    getAlerts(): Alert[] {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    getActiveAlerts(): Alert[] {
        return this.getAlerts().filter(a => a.status !== 'resolved');
    }

    createAlert(alert: Omit<Alert, 'id' | 'timestamp' | 'status'>): Alert {
        const alerts = this.getAlerts();
        const newAlert: Alert = {
            ...alert,
            id: `alert-${Date.now()}`,
            timestamp: Date.now(),
            status: 'active',
        };

        alerts.unshift(newAlert); // Add to top
        this.saveAlerts(alerts);
        return newAlert;
    }

    updateAlertStatus(id: string, status: AlertStatus, workerId?: string) {
        const alerts = this.getAlerts();
        const index = alerts.findIndex(a => a.id === id);
        if (index !== -1) {
            alerts[index].status = status;
            if (workerId) alerts[index].assignedWorkerId = workerId;
            this.saveAlerts(alerts);
        }
    }

    subscribe(callback: (alerts: Alert[]) => void) {
        this.listeners.push(callback);
        // Initial call
        callback(this.getActiveAlerts());
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    private saveAlerts(alerts: Alert[]) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
        this.notifyListeners();
    }

    private notifyListeners() {
        const activeAlerts = this.getActiveAlerts();
        this.listeners.forEach(l => l(activeAlerts));
    }
}

export const alertService = new AlertService();
