'use client';

import { motion } from 'framer-motion';
import {
  Users,
  FolderKanban,
  Lock,
  Globe,
  CreditCard,
  BarChart3,
} from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const features = [
  {
    icon: Users,
    title: 'Client Management',
    description:
      'Store comprehensive client details, track communication history, and manage relationships all in one place.',
    color: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    icon: FolderKanban,
    title: 'Project Tracking',
    description:
      'Monitor project status, deadlines, progress, and milestones with intuitive kanban boards and timelines.',
    color: 'from-violet-500/20 to-purple-500/20',
  },
  {
    icon: Lock,
    title: 'Credentials Vault',
    description:
      'Securely store and manage all your client credentials, API keys, and passwords with encrypted storage.',
    color: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    icon: Globe,
    title: 'Domain & Hosting',
    description:
      'Track domain renewals, hosting details, and never miss an expiration with automated reminders.',
    color: 'from-orange-500/20 to-amber-500/20',
  },
  {
    icon: CreditCard,
    title: 'Payment Tracking',
    description:
      'Manage invoices, track payment milestones, and monitor outstanding balances effortlessly.',
    color: 'from-pink-500/20 to-rose-500/20',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description:
      'Get insights into your business with revenue charts, project analytics, and performance metrics.',
    color: 'from-indigo-500/20 to-blue-500/20',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          >
            Features
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
          >
            Everything You Need to
            <span className="block bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Run Your Business
            </span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            A complete toolkit designed specifically for freelance developers to manage
            clients, projects, and finances in one unified platform.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}
              className="group relative p-6 lg:p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors"
            >
              {/* Gradient background on hover */}
              <div
                className={`absolute inset-0 bg-linear-to-br ${feature.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>

                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
