'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Freelance Web Developer',
    avatar: 'SJ',
    rating: 5,
    quote:
      "ClientFlow transformed how I manage my freelance business. I used to juggle spreadsheets and notes everywhere. Now everything is in one place, and I never miss a renewal or payment.",
  },
  {
    name: 'Marcus Chen',
    role: 'Full Stack Developer',
    avatar: 'MC',
    rating: 5,
    quote:
      "The credentials vault alone is worth it. No more digging through password managers to find client hosting details. Plus, the analytics help me understand my business better.",
  },
  {
    name: 'Emily Rodriguez',
    role: 'UI/UX Designer & Developer',
    avatar: 'ER',
    rating: 5,
    quote:
      "I've tried many project management tools, but ClientFlow is the first one built specifically for freelancers. The payment tracking feature has helped me get paid 40% faster.",
  },
  {
    name: 'David Kim',
    role: 'WordPress Developer',
    avatar: 'DK',
    rating: 5,
    quote:
      "Managing domain and hosting renewals for 30+ clients was a nightmare. ClientFlow sends me reminders weeks in advance. It's saved me from so many potential disasters.",
  },
  {
    name: 'Lisa Thompson',
    role: 'E-commerce Specialist',
    avatar: 'LT',
    rating: 5,
    quote:
      "The dashboard gives me a complete overview of my business at a glance. I love seeing my revenue trends and knowing exactly where I stand with each client.",
  },
  {
    name: 'James Wilson',
    role: 'Agency Owner',
    avatar: 'JW',
    rating: 5,
    quote:
      "We switched our small agency to ClientFlow and haven't looked back. The team features make collaboration seamless, and our clients love the professional updates.",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 lg:py-32 relative overflow-hidden">
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
            Testimonials
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
          >
            Loved by Freelancers
            <span className="block bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Worldwide
            </span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Join thousands of freelance developers who have streamlined their business
            with ClientFlow.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              variants={fadeInUp}
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)' }}
              className="relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10" />

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex gap-0.5 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-500 text-yellow-500"
                  />
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
