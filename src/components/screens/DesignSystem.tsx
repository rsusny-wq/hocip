import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ServiceBadge } from '../ServiceBadge';
import { Home as HomeIcon, Heart, Utensils, CreditCard, Droplet, Brain, ArrowLeft } from 'lucide-react';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface DesignSystemProps {
  onBack?: () => void;
}

export function DesignSystem({ onBack }: DesignSystemProps) {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-4xl mb-2">HOCI Design System</h1>
              <p className="text-xl text-neutral-600">
                Homeless Outreach Coordination Intelligence - Complete Component Library
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="buttons">Buttons</TabsTrigger>
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="icons">Icons</TabsTrigger>
          </TabsList>

          {/* Colors */}
          <TabsContent value="colors" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl mb-4">Color Palette</h2>
              <p className="text-neutral-600 mb-6">
                Warm, human-centered color system designed for accessibility and civic trust.
              </p>

              <div className="space-y-6">
                {/* Primary Colors */}
                <div>
                  <h3 className="text-lg mb-3">Primary (Trust Blue)</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                      <div key={shade} className="text-center">
                        <div
                          className="h-20 rounded-lg mb-2 border border-neutral-200"
                          style={{ backgroundColor: `var(--primary-${shade})` }}
                        />
                        <p className="text-sm">{shade}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Secondary Colors */}
                <div>
                  <h3 className="text-lg mb-3">Secondary (Compassionate Green)</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                      <div key={shade} className="text-center">
                        <div
                          className="h-20 rounded-lg mb-2 border border-neutral-200"
                          style={{ backgroundColor: `var(--secondary-${shade})` }}
                        />
                        <p className="text-sm">{shade}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Accent Colors */}
                <div>
                  <h3 className="text-lg mb-3">Accent (Warm Orange)</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                      <div key={shade} className="text-center">
                        <div
                          className="h-20 rounded-lg mb-2 border border-neutral-200"
                          style={{ backgroundColor: `var(--accent-${shade})` }}
                        />
                        <p className="text-sm">{shade}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Semantic Colors */}
                <div>
                  <h3 className="text-lg mb-3">Semantic Colors</h3>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="text-center">
                      <div className="h-20 bg-green-500 rounded-lg mb-2" />
                      <p className="text-sm">Success</p>
                    </div>
                    <div className="text-center">
                      <div className="h-20 bg-orange-500 rounded-lg mb-2" />
                      <p className="text-sm">Warning</p>
                    </div>
                    <div className="text-center">
                      <div className="h-20 bg-red-500 rounded-lg mb-2" />
                      <p className="text-sm">Error</p>
                    </div>
                    <div className="text-center">
                      <div className="h-20 bg-blue-500 rounded-lg mb-2" />
                      <p className="text-sm">Info</p>
                    </div>
                  </div>
                </div>

                {/* Service Category Colors */}
                <div>
                  <h3 className="text-lg mb-3">Service Category Colors</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="h-20 rounded-lg mb-2" style={{ backgroundColor: 'var(--shelter)' }} />
                      <p className="text-sm">Shelter (#1976d2)</p>
                    </div>
                    <div className="text-center">
                      <div className="h-20 rounded-lg mb-2" style={{ backgroundColor: 'var(--medical)' }} />
                      <p className="text-sm">Medical (#e91e63)</p>
                    </div>
                    <div className="text-center">
                      <div className="h-20 rounded-lg mb-2" style={{ backgroundColor: 'var(--food)' }} />
                      <p className="text-sm">Food (#ff9800)</p>
                    </div>
                    <div className="text-center">
                      <div className="h-20 rounded-lg mb-2" style={{ backgroundColor: 'var(--id-services)' }} />
                      <p className="text-sm">ID Services (#9c27b0)</p>
                    </div>
                    <div className="text-center">
                      <div className="h-20 rounded-lg mb-2" style={{ backgroundColor: 'var(--detox)' }} />
                      <p className="text-sm">Detox (#00bcd4)</p>
                    </div>
                    <div className="text-center">
                      <div className="h-20 rounded-lg mb-2" style={{ backgroundColor: 'var(--mental-health)' }} />
                      <p className="text-sm">Mental Health (#673ab7)</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Typography */}
          <TabsContent value="typography" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl mb-4">Typography Scale</h2>
              <p className="text-neutral-600 mb-6">
                Clear, accessible type hierarchy using Inter font family.
              </p>
              <div className="space-y-6">
                <div>
                  <h1>Heading 1 - 2.5rem / 700</h1>
                  <code className="text-sm text-neutral-600">font-size: 2.5rem; font-weight: 700;</code>
                </div>
                <div>
                  <h2>Heading 2 - 2rem / 600</h2>
                  <code className="text-sm text-neutral-600">font-size: 2rem; font-weight: 600;</code>
                </div>
                <div>
                  <h3>Heading 3 - 1.5rem / 600</h3>
                  <code className="text-sm text-neutral-600">font-size: 1.5rem; font-weight: 600;</code>
                </div>
                <div>
                  <h4>Heading 4 - 1.25rem / 600</h4>
                  <code className="text-sm text-neutral-600">font-size: 1.25rem; font-weight: 600;</code>
                </div>
                <div>
                  <p>Body Text - 1rem / 400</p>
                  <code className="text-sm text-neutral-600">font-size: 1rem; font-weight: 400;</code>
                </div>
                <div>
                  <p className="text-large">Large Text - 1.125rem / 400</p>
                  <code className="text-sm text-neutral-600">Optimized for accessibility</code>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Buttons */}
          <TabsContent value="buttons" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl mb-4">Buttons</h2>
              <p className="text-neutral-600 mb-6">
                All buttons meet minimum 44x44px touch target requirements for mobile accessibility.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg mb-3">Variants</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button>Primary Button</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg mb-3">Sizes</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg mb-3">With Icons</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button>
                      <HomeIcon className="h-5 w-5 mr-2" />
                      Shelter
                    </Button>
                    <Button variant="outline">
                      <Heart className="h-5 w-5 mr-2" />
                      Medical
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg mb-3">Mobile Touch Targets (min 44x44px)</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button className="h-14 px-6 tap-target">Mobile Large</Button>
                    <Button className="h-12 tap-target">Mobile Default</Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Inputs */}
          <TabsContent value="inputs" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl mb-4">Form Inputs</h2>
              <div className="space-y-6 max-w-md">
                <div>
                  <h3 className="text-lg mb-3">Text Input</h3>
                  <Input placeholder="Enter text..." />
                </div>
                <div>
                  <h3 className="text-lg mb-3">Large Input (Mobile Optimized)</h3>
                  <Input placeholder="Mobile friendly input" className="h-12" />
                </div>
                <div>
                  <h3 className="text-lg mb-3">Switch Toggle</h3>
                  <div className="flex items-center gap-3">
                    <Switch />
                    <span>Online/Offline Mode</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg mb-3">Progress Bar</h3>
                  <Progress value={65} className="h-2" />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Cards */}
          <TabsContent value="cards" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl mb-2">Standard Card</h3>
                <p className="text-neutral-600">
                  Default card component with shadow and padding.
                </p>
              </Card>

              <Card className="p-6 bg-blue-50 border-blue-200">
                <h3 className="text-xl mb-2">Info Card</h3>
                <p className="text-blue-900">
                  Card with colored background for emphasis.
                </p>
              </Card>

              <Card className="p-6 border-l-4 border-l-red-500">
                <h3 className="text-xl mb-2">Alert Card</h3>
                <p className="text-neutral-600">
                  Card with accent border for urgent items.
                </p>
              </Card>

              <div className="hoci-card">
                <h3 className="text-xl mb-2">HOCI Card</h3>
                <p className="text-neutral-600">
                  Custom utility class card.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Badges */}
          <TabsContent value="badges" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl mb-4">Badges & Labels</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg mb-3">Service Badges</h3>
                  <div className="flex flex-wrap gap-3">
                    <ServiceBadge category="shelter" />
                    <ServiceBadge category="medical" />
                    <ServiceBadge category="food" />
                    <ServiceBadge category="id-services" />
                    <ServiceBadge category="detox" />
                    <ServiceBadge category="mental-health" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg mb-3">Status Badges</h3>
                  <div className="flex flex-wrap gap-3">
                    <Badge className="bg-green-100 text-green-700">Confirmed</Badge>
                    <Badge className="bg-orange-100 text-orange-700">Pending</Badge>
                    <Badge className="bg-red-100 text-red-700">Urgent</Badge>
                    <Badge className="bg-blue-100 text-blue-700">In Progress</Badge>
                    <Badge variant="outline">Neutral</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg mb-3">Sizes</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <ServiceBadge category="shelter" size="sm" />
                    <ServiceBadge category="medical" size="md" />
                    <ServiceBadge category="food" size="lg" />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Icons */}
          <TabsContent value="icons" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl mb-4">Iconography</h2>
              <p className="text-neutral-600 mb-6">
                Consistent icon system using Lucide React for all service categories and actions.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg mb-3">Service Category Icons</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <HomeIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p>Shelter</p>
                        <code className="text-xs text-neutral-600">Home</code>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                        <Heart className="h-6 w-6 text-pink-600" />
                      </div>
                      <div>
                        <p>Medical</p>
                        <code className="text-xs text-neutral-600">Heart</code>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Utensils className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <p>Food</p>
                        <code className="text-xs text-neutral-600">Utensils</code>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p>ID Services</p>
                        <code className="text-xs text-neutral-600">CreditCard</code>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <Droplet className="h-6 w-6 text-cyan-600" />
                      </div>
                      <div>
                        <p>Detox</p>
                        <code className="text-xs text-neutral-600">Droplet</code>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                        <Brain className="h-6 w-6 text-violet-600" />
                      </div>
                      <div>
                        <p>Mental Health</p>
                        <code className="text-xs text-neutral-600">Brain</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
