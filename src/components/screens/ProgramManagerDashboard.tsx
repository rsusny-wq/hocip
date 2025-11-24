import { TrendingUp, Users, MapPin, Calendar, Download, AlertTriangle, CheckCircle, Clock, Home } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProgramManagerDashboardProps {
  onBackToHub?: () => void;
}

export function ProgramManagerDashboard({ onBackToHub }: ProgramManagerDashboardProps) {
  const weeklyData = [
    { day: 'Mon', contacts: 45, placements: 32, followUps: 12 },
    { day: 'Tue', contacts: 52, placements: 38, followUps: 15 },
    { day: 'Wed', contacts: 48, placements: 35, followUps: 14 },
    { day: 'Thu', contacts: 61, placements: 42, followUps: 18 },
    { day: 'Fri', contacts: 58, placements: 40, followUps: 16 },
    { day: 'Sat', contacts: 72, placements: 48, followUps: 22 },
    { day: 'Sun', contacts: 68, placements: 45, followUps: 20 },
  ];

  const placementData = [
    { name: 'Shelter', value: 145, color: '#1976d2' },
    { name: 'Detox', value: 42, color: '#00bcd4' },
    { name: 'Medical', value: 78, color: '#e91e63' },
    { name: 'Other', value: 35, color: '#9c27b0' },
  ];

  const boroughData = [
    { borough: 'Manhattan', contacts: 245 },
    { borough: 'Brooklyn', contacts: 189 },
    { borough: 'Queens', contacts: 156 },
    { borough: 'Bronx', contacts: 134 },
    { borough: 'Staten Island', contacts: 76 },
  ];

  const teamCoverage = [
    { name: 'Team Alpha', workers: 8, coverage: 92, contacts: 156 },
    { name: 'Team Beta', workers: 6, coverage: 88, contacts: 134 },
    { name: 'Team Gamma', workers: 7, coverage: 85, contacts: 142 },
    { name: 'Team Delta', workers: 5, coverage: 78, contacts: 98 },
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
                <h1 className="text-3xl text-neutral-900">Program Manager Dashboard</h1>
                <p className="text-neutral-600">Citywide Analytics & Operations</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Calendar className="h-5 w-5 mr-2" />
                Last 7 Days
              </Button>
              <Button>
                <Download className="h-5 w-5 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Total Outreach Contacts</p>
                <p className="text-3xl text-neutral-900">2,847</p>
                <p className="text-xs text-green-600 mt-1">↑ 15% from last week</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Successful Placements</p>
                <p className="text-3xl text-neutral-900">1,856</p>
                <p className="text-xs text-green-600 mt-1">78% placement rate</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Missed Follow-ups</p>
                <p className="text-3xl text-neutral-900">8.2%</p>
                <p className="text-xs text-orange-600 mt-1">Target: &lt; 10%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Avg Time to Placement</p>
                <p className="text-3xl text-neutral-900">4.2h</p>
                <p className="text-xs text-green-600 mt-1">↓ 12% improvement</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Weekly Activity */}
          <Card className="p-6">
            <h2 className="text-xl mb-4">Weekly Activity Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="contacts" stroke="#1976d2" strokeWidth={2} name="Contacts" />
                <Line type="monotone" dataKey="placements" stroke="#4caf50" strokeWidth={2} name="Placements" />
                <Line type="monotone" dataKey="followUps" stroke="#ff9800" strokeWidth={2} name="Follow-ups" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Placement Distribution */}
          <Card className="p-6">
            <h2 className="text-xl mb-4">Placement Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={placementData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {placementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Borough Breakdown */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl mb-4">Borough-Level Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={boroughData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="borough" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="contacts" fill="#1976d2" name="Contacts" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Team Coverage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl mb-4">Team Coverage & Performance</h2>
            <div className="space-y-4">
              {teamCoverage.map((team) => (
                <div key={team.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p>{team.name}</p>
                      <p className="text-sm text-neutral-600">{team.workers} workers • {team.contacts} contacts this week</p>
                    </div>
                    <span className="text-lg font-medium">{team.coverage}%</span>
                  </div>
                  <Progress value={team.coverage} className="h-2" />
                </div>
              ))}
            </div>
          </Card>

          {/* Weather Impact */}
          <Card className="p-6">
            <h2 className="text-xl mb-4">Weather Impact Analysis</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-blue-900 mb-1">Cold Weather Alert</h4>
                    <p className="text-sm text-blue-800 mb-2">
                      Temperatures below 32°F expected for next 3 days
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Predicted contact increase:</span>
                        <span className="font-medium">+35%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shelter capacity needed:</span>
                        <span className="font-medium">+120 beds</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Recommended team deployment:</span>
                        <span className="font-medium">+8 workers</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="p-4 border-green-200 bg-green-50">
                <h4 className="text-green-900 mb-2">Resource Allocation Recommendations</h4>
                <ul className="space-y-1 text-sm text-green-800">
                  <li>• Deploy 2 additional teams to Manhattan</li>
                  <li>• Increase evening shift coverage by 30%</li>
                  <li>• Activate emergency shelter protocols</li>
                  <li>• Stock warming centers with supplies</li>
                </ul>
              </Card>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
