import { useState } from 'react';
import { Mail, Lock, User, Phone, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { supabase } from '../../utils/supabase/client';
import { signup, sendOTP } from '../../services/api';

interface AuthScreenProps {
  onAuthSuccess: (role: string) => void;
  onBack?: () => void;
}

export function AuthScreen({ onAuthSuccess, onBack }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'otp'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'field-worker' | 'case-manager' | 'program-manager'>('field-worker');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      const userRole = data.user?.user_metadata?.role || 'field-worker';
      onAuthSuccess(userRole);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signup({
        email,
        password,
        role,
        name,
        phone,
      });

      setMessage('Account created successfully! Please log in.');
      setMode('login');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await sendOTP(email);
      setMessage('OTP sent to your email. Please check your inbox.');
      setMode('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });

      if (verifyError) throw verifyError;

      const userRole = data.user?.user_metadata?.role || 'field-worker';
      onAuthSuccess(userRole);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="w-fit mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          <CardTitle>
            {mode === 'login' && 'Login to Outreach App'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'otp' && 'Verify OTP'}
          </CardTitle>
          <CardDescription>
            {mode === 'login' && 'Sign in with your email and password or use OTP'}
            {mode === 'signup' && 'Create a new account to get started'}
            {mode === 'otp' && 'Enter the code sent to your email'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert className="mb-4 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <AlertDescription className="text-green-800 dark:text-green-200">{message}</AlertDescription>
            </Alert>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setError('');
                    setMessage('');
                    setMode('signup');
                  }}
                >
                  Create Account
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setError('');
                    setMessage('');
                    handleSendOTP(new Event('submit') as any);
                  }}
                >
                  Login with OTP
                </Button>
              </div>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone-number">Phone (Optional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                  <Input
                    id="phone-number"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  required
                >
                  <option value="field-worker">Field Worker</option>
                  <option value="case-manager">Case Manager</option>
                  <option value="program-manager">Program Manager</option>
                </select>
              </div>

              <div className="space-y-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setError('');
                    setMessage('');
                    setMode('login');
                  }}
                >
                  Already have an account? Login
                </Button>
              </div>
            </form>
          )}

          {mode === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                  required
                />
              </div>

              <div className="space-y-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setError('');
                    setMessage('');
                    setMode('login');
                  }}
                >
                  Back to Login
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
