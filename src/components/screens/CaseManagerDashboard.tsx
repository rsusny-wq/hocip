import { Users, Calendar, MapPin, AlertCircle, TrendingUp, Clock, CheckCircle, Home, Bell } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { ServiceBadge } from '../ServiceBadge';
import { useState, useEffect } from 'react';
import { alertService, type Alert } from '../../services/alertService';
import { formatDistanceToNow } from 'date-fns';

interface CaseManagerDashboardProps {
  onNavigate?: (screen: string) => void;
  onBackToHub?: () => void;
}

export function CaseManagerDashboard({ onNavigate, onBackToHub }: CaseManagerDashboardProps) {
  const todayStats = {
    outreachLogs: 47,
    urgentCases: 8,
    needingFollowUp: 12,
    recentBookings: 15,
  };

  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const unsubscribe = alertService.subscribe(setAlerts);
    return unsubscribe;
  }, []);

  const recentActivity = [
    {
      time: '10 min ago',
      worker: 'Maria R.',
      action: 'Logged encounter',
      client: 'James T.',
      status: 'pending',
    },
    {
      time: '25 min ago',
      worker: 'David L.',
      action: 'Booked shelter',
      client: 'Sarah M.',
      status: 'confirmed',
    },
    {
      time: '1 hour ago',
      worker: 'Emily K.',
      action: 'Medical appointment',
      client: 'Robert P.',
      status: 'confirmed',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onBackToHub}>
                <Home className="h-6 w-6" />
              </Button>
              <div>
                <h1 className="text-3xl text-neutral-900">Case Manager Dashboard</h1>
                <p className="text-neutral-600">Manhattan Team • Today's Overview</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Calendar className="h-5 w-5 mr-2" />
                Nov 17, 2025
              </Button>
              <Button onClick={() => onNavigate?.('client-profile')}>
                <Users className="h-5 w-5 mr-2" />
                View All Clients
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Today's Outreach Logs</p>
                <p className="text-3xl text-neutral-900">{todayStats.outreachLogs}</p>
                <p className="text-xs text-green-600 mt-1">↑ 12% from yesterday</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Urgent Cases</p>
                <p className="text-3xl text-neutral-900">{alerts.length}</p>
                <p className="text-xs text-red-600 mt-1">Requires immediate action</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Needs Follow-up</p>
                <p className="text-3xl text-neutral-900">{todayStats.needingFollowUp}</p>
                <p className="text-xs text-orange-600 mt-1">Within next 24 hours</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Recent Bookings</p>
                <p className="text-3xl text-neutral-900">{todayStats.recentBookings}</p>
                <p className="text-xs text-green-600 mt-1">↑ 8% placement rate</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Urgent Cases */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl flex items-center gap-2">
                  <Bell className="h-5 w-5 text-red-500" />
                  Live Alerts Feed
                </h2>
                <Badge className="bg-red-100 text-red-700">{alerts.length} active</Badge>
              </div>

              <div className="space-y-4">
                {alerts.length === 0 ? (
                  <p className="text-neutral-500 text-center py-8">No active alerts.</p>
                ) : (
                  alerts.map((alert) => (
                    <Card key={alert.id} className="p-4 border-l-4 border-l-red-500">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold">
                              {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Alert
                            </h3>
                            <Badge className={
                              alert.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                            }>
                              {alert.priority.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-neutral-600 mb-2">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {alert.location.lat.toFixed(4)}, {alert.location.lng.toFixed(4)}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-700 mb-2">{alert.details}</p>
                          <div className="flex items-center gap-2 text-xs text-neutral-500">
                            <Users className="h-3 w-3" />
                            User ID: {alert.userId}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          Assign Worker
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onNavigate?.('service-matching')}>
                          Find Services
                        </Button>
                        <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6 mt-6">
              <h2 className="text-xl mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-center gap-4 pb-3 border-b border-neutral-200 last:border-0">
                    <div className={`w-2 h-2 rounded-full ${activity.status === 'confirmed' ? 'bg-green-500' :
                      activity.status === 'pending' ? 'bg-orange-500' : 'bg-neutral-300'
                      }`} />
                    <div className="flex-1">
                      <p className="text-sm">
                        <strong>{activity.worker}</strong> {activity.action} for <strong>{activity.client}</strong>
                      </p>
                      <p className="text-xs text-neutral-600">{activity.time}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Metrics */}
            <Card className="p-6">
              <h3 className="mb-4">This Week's Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Placement Rate</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Follow-up Success</span>
                    <span className="font-medium">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Avg Response Time</span>
                    <span className="font-medium">2.4 hrs</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </div>
            </Card>

            {/* Weather Alert */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-blue-900 mb-1">Weather Alert</h4>
                  <p className="text-sm text-blue-800">
                    Temperature dropping to 28°F tonight. Winter shelter capacity increased by 20%.
                  </p>
                  <Button size="sm" variant="outline" className="mt-3 border-blue-300 hover:bg-blue-100">
                    View Winter Resources
                  </Button>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate?.('appointments')}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Appointment Manager
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate?.('messages')}>
                  <Users className="h-4 w-4 mr-2" />
                  Messages Center
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
