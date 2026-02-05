import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Providers } from "@/components/Providers";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
   subsets: ["latin"],
   variable: "--font-sans",
});

export const metadata: Metadata = {
   title: "ClientFlow CRM | Freelance Developer Client Management",
   description:
      "A comprehensive client and project management system for freelance web developers. Manage clients, projects, credentials, payments, and track analytics.",
   keywords: [
      "CRM",
      "freelance",
      "client management",
      "project management",
      "web developer",
   ],
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang='en' suppressHydrationWarning>
         <head>
            <script
               dangerouslySetInnerHTML={{
                  __html: `
              try {
                const theme = localStorage.getItem('theme');
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (theme === 'dark' || (!theme && systemDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
               }}
            />
         </head>
         <body className={`${inter.variable} font-sans antialiased`}>
            <ThemeProvider
               attribute='class'
               defaultTheme='system'
               enableSystem
               disableTransitionOnChange
            >
               <Providers>
                  {children}
                  <Analytics />
               </Providers>
            </ThemeProvider>
         </body>
      </html>
   );
}
