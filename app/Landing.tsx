'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Clock, 
  Target, 
  BarChart3,
  Zap,
  Shield,
  Globe,
  Star,
  Play,
  Sparkles,
  TrendingUp,
  MessageSquare,
  Calendar,
  Bell
} from 'lucide-react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';

const features = [
  { icon: Target, text: 'Intuitive Kanban boards', color: 'text-purple-500' },
  { icon: Users, text: 'Real-time collaboration', color: 'text-blue-500' },
  { icon: Zap, text: 'Custom workflows', color: 'text-emerald-500' },
  { icon: BarChart3, text: 'Advanced task tracking', color: 'text-orange-500' },
];

const stats = [
  { number: '50K+', label: 'Active Users', icon: Users },
  { number: '1M+', label: 'Tasks Completed', icon: CheckCircle2 },
  { number: '99.9%', label: 'Uptime', icon: Shield },
  { number: '150+', label: 'Countries', icon: Globe },
];

const detailedFeatures = [
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'AI-powered task scheduling that adapts to your workflow and deadlines.',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: Bell,
    title: 'Intelligent Notifications',
    description: 'Get notified about what matters most, when it matters most.',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: TrendingUp,
    title: 'Progress Analytics',
    description: 'Detailed insights into your productivity patterns and team performance.',
    gradient: 'from-emerald-500 to-teal-500'
  },
  {
    icon: MessageSquare,
    title: 'Team Communication',
    description: 'Built-in chat and comments keep everyone on the same page.',
    gradient: 'from-orange-500 to-red-500'
  }
];

const testimonials = [
  {
    quote: "Projex transformed how our team collaborates. The real-time updates and intuitive interface made us 40% more productive.",
    author: "Sarah Chen",
    role: "Product Manager at TechCorp",
    avatar: "👩‍💼",
    rating: 5
  },
  {
    quote: "Finally, a project management tool that doesn't get in the way. Clean, fast, and exactly what we needed.",
    author: "Marcus Rodriguez",
    role: "Startup Founder",
    avatar: "👨‍💻",
    rating: 5
  },
  {
    quote: "The analytics features helped us identify bottlenecks we didn't even know existed. Game-changer for our workflow.",
    author: "Emily Watson",
    role: "Operations Director",
    avatar: "👩‍🔬",
    rating: 5
  }
];

const LandingPage: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-background relative text-foreground overflow-hidden">
      {/* Enhanced Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse dark:bg-purple-500/10" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000 dark:bg-blue-500/10" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-emerald-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000 dark:bg-emerald-500/10" />
      </div>

      {/* Navigation */}
      {/* Enhanced Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 border border-purple-200 dark:border-purple-700/50">
              <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Now with AI-powered insights</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              Transform your
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                productivity
              </span>
              <br />
              forever
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The most intuitive project management platform that adapts to your workflow. 
              Collaborate seamlessly, track progress effortlessly, and achieve more together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {user ? (
                <Button size="lg" className="shadow-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg" asChild>
                  <Link href="/projects" className="gap-2">
                    Open Dashboard <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" className="shadow-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg" asChild>
                    <Link href="/create-account" className="gap-2">
                      Start Free Trial <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-2 border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900/20 px-8 py-6 text-lg backdrop-blur-sm" asChild>
                    <Link href="/demo" className="gap-2">
                      <Play className="h-5 w-5" /> Watch Demo
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Feature Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 max-w-4xl mx-auto">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 hover:scale-105 transition-transform">
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  <span className="font-medium text-gray-700 dark:text-gray-300">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* App Preview */}
          <div className="relative w-full max-w-6xl mx-auto mt-20 px-4">
            <div className="relative bg-white/10 dark:bg-gray-900/30 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/30">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-blue-500/10" />
              <Image
                src={resolvedTheme === 'dark' ? '/projex-dark.png' : '/projex-light.png'}
                alt="Projex app interface preview"
                width={1824}
                height={1080}
                className="rounded-2xl w-full relative z-10"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-3">
                <stat.icon className="h-10 w-10 mx-auto opacity-80" />
                <div className="text-4xl font-bold">{stat.number}</div>
                <div className="text-purple-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Everything you need to
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> succeed</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to streamline your workflow and boost team productivity
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {detailedFeatures.map((feature, index) => (
              <div key={index} className="group p-8 rounded-2xl bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-purple-50/30 dark:from-gray-900/50 dark:to-purple-900/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Loved by teams
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> worldwide</span>
            </h2>
            <div className="flex justify-center items-center gap-2 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-lg font-semibold">4.9/5 from 2,000+ reviews</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-900/50 rounded-2xl p-8 shadow-xl border border-white/50 dark:border-gray-700/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <h2 className="text-5xl font-bold mb-6">
            Ready to transform your workflow?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of teams who've already made the switch to smarter project management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 shadow-xl px-8 py-6 text-lg font-semibold" asChild>
              <Link href="/create-account" className="gap-2">
                Start Your Free Trial <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
          <p className="text-sm mt-4 opacity-75">No credit card required • 14-day free trial</p>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 dark:bg-black border-t border-gray-800 py-16 text-gray-300">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Projex
              </div>
              <p className="text-gray-400 max-w-xs">
                The future of project management. Simple, powerful, and designed for modern teams.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <div className="space-y-2">
                <Link href="/features" className="block hover:text-white transition-colors">Features</Link>
                <Link href="/pricing" className="block hover:text-white transition-colors">Pricing</Link>
                <Link href="/integrations" className="block hover:text-white transition-colors">Integrations</Link>
                <Link href="/api" className="block hover:text-white transition-colors">API</Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <div className="space-y-2">
                <Link href="/about" className="block hover:text-white transition-colors">About</Link>
                <Link href="/careers" className="block hover:text-white transition-colors">Careers</Link>
                <Link href="/blog" className="block hover:text-white transition-colors">Blog</Link>
                <Link href="/contact" className="block hover:text-white transition-colors">Contact</Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <div className="space-y-2">
                <Link href="/help" className="block hover:text-white transition-colors">Help Center</Link>
                <Link href="/privacy" className="block hover:text-white transition-colors">Privacy</Link>
                <Link href="/terms" className="block hover:text-white transition-colors">Terms</Link>
                <Link href="/status" className="block hover:text-white transition-colors">Status</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Projex. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;