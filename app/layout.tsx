import type { Metadata } from "next";
import "./globals.css";

import AuthProvider from "@/components/providers/session-provider";

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
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}