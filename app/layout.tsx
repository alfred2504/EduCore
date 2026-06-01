import type { Metadata } from "next";
import "./globals.css";

import AuthProvider from "@/components/providers/session-provider";
import NextThemeProvider from "@/components/providers/theme-provider";

import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "EduCore AI",
  description: "AI-powered School Operating System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <NextThemeProvider>
            {children}

            <Toaster richColors />
          </NextThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}