'use client';
import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';
import Link from 'next/link';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';
import { usePathname } from 'next/navigation';
import { useAccessStore } from '@/stores/useAccessStore';
import { Sparkles } from 'lucide-react';

interface HeaderProps {
  className?: string;
}

const supabase = createClient();

export const Header = ({ className }: HeaderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        useAccessStore.getState().reset(); // Reset when session ends
      }
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-50 border-b border-white/20 dark:border-gray-700/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 transition-all duration-300',
        className
      )}
    >
      {/* Enhanced background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 via-blue-50/30 to-emerald-50/50 dark:from-purple-900/10 dark:via-blue-900/5 dark:to-emerald-900/10" />
      
      <div className="container flex h-16 items-center justify-between relative z-10">
        <Link
          href={user ? '/projects' : '/'}
          className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105"
        >
          {/* Enhanced logo with gradient and icon */}
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:via-blue-700 group-hover:to-emerald-700 transition-all duration-300">
              Projex
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              {/* User menu with enhanced styling */}
              <div className="p-1 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/30">
                <UserMenu user={user} />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {isLandingPage && (
                <>
                  <Button 
                    variant="ghost" 
                    className="hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-300 backdrop-blur-sm" 
                    asChild
                  >
                    <Link href="/login">Sign in</Link>
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm border-0" 
                    asChild
                  >
                    <Link href="/create-account">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          )}
          
          {/* Enhanced theme toggle section */}
          <div className="flex items-center border-l border-purple-200/50 dark:border-gray-700/50 pl-4 ml-2">
            <div className="p-1 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Subtle bottom border with gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-300/50 to-transparent dark:via-purple-700/30" />
    </header>
  );
};