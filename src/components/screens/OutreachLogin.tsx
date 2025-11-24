import { useState } from 'react';
import { Mail, Phone, Lock, LogIn, Home } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { LanguageSwitcher } from '../LanguageSwitcher';
import type { Language } from '../../types';

interface OutreachLoginProps {
  onLogin?: (method: string) => void;
  onBackToHub?: () => void;
}

export function OutreachLogin({ onLogin, onBackToHub }: OutreachLoginProps) {
  const [language, setLanguage] = useState<Language>('en');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [passcode, setPasscode] = useState('');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 flex justify-between items-start border-b border-border">
        <div className="flex items-center gap-3">
          {onBackToHub && (
            <Button variant="ghost" size="icon" onClick={onBackToHub}>
              <Home className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h1 className="text-3xl">HOCI</h1>
            <p className="text-sm opacity-70">Homeless Outreach Coordination</p>
          </div>
        </div>
        <LanguageSwitcher
          currentLanguage={language}
          onLanguageChange={setLanguage}
          variant="mobile"
        />
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-2xl p-6 border border-border">
            <div className="text-center mb-6">
              <h2 className="text-2xl mb-2">Welcome Back</h2>
              <p className="opacity-70">Sign in to continue your outreach work</p>
            </div>

            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
                <TabsTrigger value="passcode">Passcode</TabsTrigger>
              </TabsList>

              {/* Email Login */}
              <TabsContent value="email" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="worker@hoci.org"
                      className="pl-10 h-12"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 h-12"
                    />
                  </div>
                </div>
                <Button
                  className="w-full h-12 tap-target"
                  onClick={() => onLogin?.('email')}
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </Button>
              </TabsContent>

              {/* Phone Login */}
              <TabsContent value="phone" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      className="pl-10 h-12"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  className="w-full h-12 tap-target"
                  onClick={() => onLogin?.('phone')}
                >
                  Send Verification Code
                </Button>
              </TabsContent>

              {/* Passcode Login */}
              <TabsContent value="passcode" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="passcode">6-Digit Passcode</Label>
                  <Input
                    id="passcode"
                    type="text"
                    placeholder="123456"
                    maxLength={6}
                    className="h-12 text-center text-2xl tracking-widest"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <Button
                  className="w-full h-12 tap-target"
                  onClick={() => onLogin?.('passcode')}
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </Button>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <a href="#" className="text-sm text-primary-600 hover:underline">
                Forgot your credentials?
              </a>
            </div>
          </div>

          {/* Footer info */}
          <div className="mt-6 text-center text-white text-sm">
            <p>Need help? Contact your supervisor</p>
            <p className="mt-2 text-primary-100">or call: (555) HOCI-HELP</p>
          </div>
        </div>
      </div>
    </div>
  );
}
