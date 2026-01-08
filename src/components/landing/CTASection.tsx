'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export function CTASection() {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-linear-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-3xl" />

          <div className="relative bg-linear-to-br from-primary/5 via-card to-primary/5 rounded-3xl border border-primary/20 p-8 lg:p-16 text-center overflow-hidden">
            {/* Decorative elements */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-2xl"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 7, repeat: Infinity }}
              className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/15 rounded-full blur-2xl"
            />

            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Start for free, no credit card required
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            >
              Ready to Streamline Your
              <span className="block bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Freelance Business?
              </span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground max-w-xl mx-auto mb-8"
            >
              Join thousands of freelancers who are saving time, getting paid faster, and
              growing their business with ClientFlow.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/register">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" className="h-12 px-8 text-base gap-2 group">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/login">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                    Sign In
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className="text-sm text-muted-foreground mt-6"
            >
              Free plan includes 5 clients, 10 projects, and core features.
              <br className="hidden sm:block" /> Upgrade anytime to unlock unlimited access.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
