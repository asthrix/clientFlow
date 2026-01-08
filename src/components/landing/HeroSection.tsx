'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Users, Briefcase, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fadeInUp, staggerContainer, float } from '@/lib/animations';

const stats = [
  { icon: Users, value: '2,500+', label: 'Active Freelancers' },
  { icon: Briefcase, value: '15,000+', label: 'Projects Managed' },
  { icon: Shield, value: '99.9%', label: 'Uptime' },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 lg:pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-primary/10" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl"
        />
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Now with AI-powered insights
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="block">Manage Your Freelance</span>
            <span className="block bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Business Effortlessly
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            The all-in-one CRM for freelance developers. Track clients, manage projects,
            secure credentials, and get paid faster—all in one beautiful dashboard.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link href="/register">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" className="h-12 px-8 text-base gap-2 group">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </Link>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" size="lg" className="h-12 px-8 text-base gap-2">
                <Play className="w-4 h-4" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center justify-center gap-8 lg:gap-16"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="mt-16 lg:mt-24 relative"
        >
          <motion.div
            variants={float}
            animate="animate"
            className="relative mx-auto max-w-5xl"
          >
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-linear-to-r from-primary/20 via-primary/10 to-primary/20 rounded-2xl blur-2xl" />
            
            {/* Dashboard mockup container */}
            <div className="relative bg-card rounded-xl lg:rounded-2xl border border-border shadow-2xl overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md bg-background text-xs text-muted-foreground">
                    clientflow-dev.vercel.app/dashboard
                  </div>
                </div>
              </div>
              
              {/* Dashboard content placeholder */}
              <div className="aspect-video bg-linear-to-br from-background to-muted/30 p-4 lg:p-8">
                <div className="grid grid-cols-4 gap-4 h-full">
                  {/* Sidebar */}
                  <div className="col-span-1 hidden sm:block bg-card/50 rounded-lg border border-border/50 p-3">
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-8 rounded-md ${i === 0 ? 'bg-primary/20' : 'bg-muted/50'}`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Main content */}
                  <div className="col-span-4 sm:col-span-3 space-y-4">
                    {/* Stats row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-card/50 rounded-lg border border-border/50 p-3"
                        >
                          <div className="h-3 w-16 bg-muted/50 rounded mb-2" />
                          <div className="h-6 w-12 bg-primary/20 rounded" />
                        </div>
                      ))}
                    </div>
                    
                    {/* Chart placeholder */}
                    <div className="bg-card/50 rounded-lg border border-border/50 p-4 flex-1">
                      <div className="h-3 w-24 bg-muted/50 rounded mb-4" />
                      <div className="flex items-end justify-between gap-2 h-24 lg:h-32">
                        {[40, 65, 45, 80, 55, 70, 60, 85, 50, 75, 90, 65].map((h, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: 0.8 + i * 0.05, duration: 0.5 }}
                            className="flex-1 bg-primary/30 rounded-t"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
