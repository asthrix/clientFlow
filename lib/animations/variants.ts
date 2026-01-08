// ============================================
// ClientFlow CRM - Animation Variants
// Centralized Framer Motion animation variants
// Following DRY principle - define once, use everywhere
// ============================================

import type { Variants, Transition } from 'framer-motion';

// ============================================
// Transition Presets
// ============================================

export const transitions = {
  // Fast, snappy transition for micro-interactions
  fast: {
    type: 'tween',
    duration: 0.15,
    ease: 'easeOut',
  } as Transition,

  // Default transition for most animations
  default: {
    type: 'tween',
    duration: 0.3,
    ease: [0.25, 0.1, 0.25, 1], // Custom ease
  } as Transition,

  // Smooth transition for page animations
  smooth: {
    type: 'tween',
    duration: 0.4,
    ease: 'easeInOut',
  } as Transition,

  // Spring transition for bouncy effects
  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  } as Transition,

  // Gentle spring for subtle movements
  gentleSpring: {
    type: 'spring',
    stiffness: 200,
    damping: 25,
  } as Transition,
};

// ============================================
// Page Transition Variants
// ============================================

export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: transitions.fast,
  },
};

// ============================================
// Fade Variants
// ============================================

export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    transition: transitions.fast,
  },
};

export const fadeUpVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: transitions.fast,
  },
};

export const fadeScaleVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: transitions.fast,
  },
};

// ============================================
// Card/Item Variants
// ============================================

export const cardVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.default,
  },
  hover: {
    y: -4,
    boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
    transition: transitions.fast,
  },
  tap: {
    scale: 0.98,
    transition: transitions.fast,
  },
};

export const listItemVariants: Variants = {
  initial: {
    opacity: 0,
    x: -10,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    x: 10,
    transition: transitions.fast,
  },
};

// ============================================
// Stagger Container Variants
// ============================================

export const staggerContainerVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerFastContainerVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

// ============================================
// Modal/Dialog Variants
// ============================================

export const modalVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 10,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.spring,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: transitions.fast,
  },
};

export const overlayVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

// ============================================
// Button/Interactive Variants
// ============================================

export const buttonVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: transitions.fast,
  },
  tap: {
    scale: 0.98,
    transition: transitions.fast,
  },
};

export const iconButtonVariants: Variants = {
  initial: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.1,
    transition: transitions.fast,
  },
  tap: {
    scale: 0.95,
    transition: transitions.fast,
  },
};

// ============================================
// Sidebar/Nav Variants
// ============================================

export const sidebarVariants: Variants = {
  closed: {
    x: '-100%',
    transition: transitions.default,
  },
  open: {
    x: 0,
    transition: transitions.spring,
  },
};

export const menuItemVariants: Variants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: -20,
  },
};

// ============================================
// Dropdown Variants
// ============================================

export const dropdownVariants: Variants = {
  initial: {
    opacity: 0,
    y: -8,
    scale: 0.96,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitions.fast,
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.96,
    transition: { duration: 0.1 },
  },
};

// ============================================
// Toast/Notification Variants
// ============================================

export const toastVariants: Variants = {
  initial: {
    opacity: 0,
    x: 100,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: transitions.spring,
  },
  exit: {
    opacity: 0,
    x: 100,
    scale: 0.9,
    transition: transitions.fast,
  },
};

// ============================================
// Status Badge Variants
// ============================================

export const pulseVariants: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const badgeVariants: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: transitions.spring,
  },
};

// ============================================
// Loading/Skeleton Variants
// ============================================

export const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export const shimmerVariants: Variants = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// ============================================
// Chart/Data Visualization Variants
// ============================================

export const chartBarVariants: Variants = {
  initial: { scaleY: 0, originY: 1 },
  animate: {
    scaleY: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export const chartLineVariants: Variants = {
  initial: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: 'easeInOut',
    },
  },
};

// ============================================
// Celebration/Success Variants
// ============================================

export const checkmarkVariants: Variants = {
  initial: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

export const confettiVariants: Variants = {
  initial: {
    opacity: 0,
    y: 0,
    scale: 0,
  },
  animate: {
    opacity: [0, 1, 1, 0],
    y: [-20, -60],
    scale: [0, 1, 1, 0.5],
    transition: {
      duration: 1,
      ease: 'easeOut',
    },
  },
};

// ============================================
// Form Field Variants
// ============================================

export const fieldErrorVariants: Variants = {
  initial: { opacity: 0, y: -5 },
  animate: {
    opacity: 1,
    y: 0,
    transition: transitions.fast,
  },
  exit: {
    opacity: 0,
    y: -5,
    transition: { duration: 0.1 },
  },
};

export const shakeVariants: Variants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 },
  },
};
