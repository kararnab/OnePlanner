import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import AuthProvider from "@/components/auth/AuthProvider";
import HydrationGate from "@/components/auth/HydrationGate";
import LanguageProvider from "@/components/i18n/LanguageProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "OnePlanner",
    description: "Video Conferencing app",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <HydrationGate>
            <AuthProvider>
                <LanguageProvider>
                    {children}
                </LanguageProvider>
            </AuthProvider>
        </HydrationGate>

        </body>
        </html>
    );
}
