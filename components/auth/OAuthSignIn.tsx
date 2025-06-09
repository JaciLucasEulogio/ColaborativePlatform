'use client';

import { Suspense, useState } from 'react';
import { Icons } from '@/components/Icons';
import { Button } from '@/components/ui/button';
import { auth } from '@/utils/auth';
import { useToast } from '@/components/ui/use-toast';
import { getAuthError } from '@/utils/auth-errors';
import { useSearchParams } from 'next/navigation';

interface Props {
  isLoading?: boolean;
  onLoadingChange?: (loading: boolean) => void;
  redirectUrl?: string;
}

// Separate component to handle search params
function OAuthButtons({ isLoading, onLoadingChange, redirectUrl }: Props) {
  const [internalLoading, setInternalLoading] = useState(false);
  const [clickedProvider, setClickedProvider] = useState<string | null>(null);
  const { toast } = useToast();
  const searchParams = useSearchParams();

  // Use either provided redirectUrl or next param from URL
  const nextUrl = redirectUrl || searchParams.get('next') || '/projects';

  // Use either parent loading state or internal state
  const loading = isLoading ?? internalLoading;
  const setLoading = onLoadingChange ?? setInternalLoading;

  const handleOAuthSignIn = async (provider: 'github' | 'google') => {
    try {
      setLoading(true);
      setClickedProvider(provider);
      await auth.signInWithOAuth(provider, nextUrl);
    } catch (error) {
      const { message } = getAuthError(error);
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: message,
      });
    } finally {
      setLoading(false);
      setClickedProvider(null);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        type="button"
        disabled={loading}
        onClick={() => handleOAuthSignIn('github')}
        className="w-full h-12 text-sm font-medium border-2 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-md group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        <div className="relative flex items-center justify-center">
          {loading && clickedProvider === 'github' ? (
            <div className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
          ) : (
            <Icons.gitHub className="mr-3 h-5 w-5 text-gray-700 dark:text-gray-300" />
          )}
          <span className="text-gray-700 dark:text-gray-300">
            {loading && clickedProvider === 'github' ? 'Connecting...' : 'Continue with GitHub'}
          </span>
        </div>
      </Button>

      <Button
        variant="outline"
        type="button"
        disabled={loading}
        onClick={() => handleOAuthSignIn('google')}
        className="w-full h-12 text-sm font-medium border-2 hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-200 hover:shadow-md group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        <div className="relative flex items-center justify-center">
          {loading && clickedProvider === 'google' ? (
            <div className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-blue-300 border-t-blue-600" />
          ) : (
            <Icons.google className="mr-3 h-5 w-5" />
          )}
          <span className="text-gray-700 dark:text-gray-300">
            {loading && clickedProvider === 'google' ? 'Connecting...' : 'Continue with Google'}
          </span>
        </div>
      </Button>
    </div>
  );
}

export function OAuthSignIn(props: Props) {
  return (
    <div className="w-full">
      {/* Enhanced divider with gradient and glow effect */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
            Or continue with
          </span>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="space-y-3">
            <Button variant="outline" disabled className="w-full h-12">
              <div className="mr-3 h-4 w-4 animate-pulse rounded bg-gray-300" />
              <span className="animate-pulse">Loading...</span>
            </Button>
            <Button variant="outline" disabled className="w-full h-12">
              <div className="mr-3 h-4 w-4 animate-pulse rounded bg-gray-300" />
              <span className="animate-pulse">Loading...</span>
            </Button>
          </div>
        }
      >
        <OAuthButtons {...props} />
      </Suspense>

      {/* Optional: Trust indicators */}
      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">
          Secure authentication powered by OAuth 2.0
        </p>
      </div>
    </div>
  );
}