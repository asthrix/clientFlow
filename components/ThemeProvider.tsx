"use client"

// ============================================
// ClientFlow CRM - Theme Provider (Shadcn)
// Using next-themes for dark mode support
// https://ui.shadcn.com/docs/dark-mode/next
// ============================================

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
