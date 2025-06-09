'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/Icons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { auth } from '@/utils/auth';
import { useToast } from '@/components/ui/use-toast';
import { getAuthError } from '@/utils/auth-errors';
import { OAuthSignIn } from '@/components/auth/OAuthSignIn';
import { Lock, Mail, Eye, EyeOff, Sparkles, Shield } from 'lucide-react';

export function CreateAccountForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Passwords do not match',
      });
      return;
    }

    try {
      setIsLoading(true);
      await auth.signUp(email, password);
      toast({
        title: 'Success',
        description: 'Please check your email to verify your account.',
      });
      router.push('/login');
    } catch (error) {
      const { message } = getAuthError(error);

      toast({
        variant: 'destructive',
        title: 'Account Creation Error',
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full pt-20 pb-12 px-4 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20" />
        <div className="dark:hidden absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-200/40 via-sky-200/30 to-emerald-200/40" />
        <div className="dark:hidden absolute inset-0 bg-[conic-gradient(from_230.29deg_at_51.63%_52.16%,_rgb(36,_0,_255,_0.07)_0deg,_rgb(0,_135,_255,_0.07)_67.5deg,_rgb(108,_39,_157,_0.07)_198.75deg,_rgb(24,_38,_163,_0.07)_251.25deg,_rgb(54,_103,_196,_0.07)_301.88deg,_rgb(105,_30,_255,_0.07)_360deg)]" />
        
        {/* Animated floating orbs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-r from-violet-300/30 to-purple-400/30 dark:from-purple-500/20 dark:to-violet-500/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-300/30 to-blue-400/30 dark:from-blue-500/20 dark:to-cyan-500/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-gradient-to-r from-emerald-300/30 to-teal-400/30 dark:from-emerald-500/20 dark:to-teal-500/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl animate-pulse delay-2000" />
      </div>

      {/* Scrollable container with proper spacing for navbar */}
      <div className="max-w-md mx-auto flex flex-col justify-center min-h-[calc(100vh-5rem)] pt-80 py-8">
        <Card className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 shadow-2xl">
          <div onSubmit={handleSubmit}>
            <CardHeader className="space-y-4 text-center pb-6 pt-8">
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-xl flex items-center justify-center mb-2 shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
                Create Account
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Join us and start your journey today
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 px-8">
              <div className="text-center text-sm">
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  className="font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors underline-offset-4 hover:underline"
                >
                  Sign in
                </Link>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-12 bg-white/70 dark:bg-gray-800/70 border-gray-200/60 dark:border-gray-700/60 focus:border-violet-500 dark:focus:border-violet-400 focus:ring-violet-500/20 transition-all rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="pr-10 h-12 bg-white/70 dark:bg-gray-800/70 border-gray-200/60 dark:border-gray-700/60 focus:border-violet-500 dark:focus:border-violet-400 focus:ring-violet-500/20 transition-all rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="pr-10 h-12 bg-white/70 dark:bg-gray-800/70 border-gray-200/60 dark:border-gray-700/60 focus:border-violet-500 dark:focus:border-violet-400 focus:ring-violet-500/20 transition-all rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Password strength indicator */}
              {password && (
                <div className="space-y-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Password strength:</div>
                  <div className="flex space-x-1">
                    <div className={`h-1 flex-1 rounded ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                    <div className={`h-1 flex-1 rounded ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                    <div className={`h-1 flex-1 rounded ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                    <div className={`h-1 flex-1 rounded ${/[^A-Za-z0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Include: 8+ characters, uppercase, number, special character
                  </div>
                </div>
              )}

              <Button 
                className="w-full h-12 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 rounded-lg" 
                type="submit" 
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Create Account
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400 leading-relaxed">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 underline-offset-2 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 underline-offset-2 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </CardContent>

            <CardFooter className="pt-6 pb-8 px-8">
              <OAuthSignIn isLoading={isLoading} onLoadingChange={setIsLoading} />
            </CardFooter>
          </div>
        </Card>

        {/* Trust indicators at bottom */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Shield className="h-3 w-3" />
              <span>Secure</span>
            </div>
            <div className="flex items-center space-x-1">
              <Lock className="h-3 w-3" />
              <span>Encrypted</span>
            </div>
            <div className="flex items-center space-x-1">
              <Sparkles className="h-3 w-3" />
              <span>Trusted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}