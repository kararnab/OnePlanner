"use client";

import Link from "next/link";
import { VideoOff } from "lucide-react";

export default function NotFound() {
    return (
        <div
            className="min-h-screen flex items-center justify-center p-6"
            style={{
                background: "var(--color-background)",
                color: "var(--color-foreground)",
            }}
        >
            <div
                className="rounded-2xl shadow-sm p-8 flex flex-col gap-6 border max-w-md w-full text-center"
                style={{
                    background: "var(--color-background)",
                    color: "var(--color-foreground)",
                    borderColor: "var(--color-border)",
                }}
            >
                {/* Icon */}
                <div className="mx-auto p-3 rounded-full bg-red-500/15 w-fit">
                    <VideoOff size={28} className="text-red-600" />
                </div>

                {/* Title */}
                <div>
                    <h1 className="text-5xl font-bold mb-2">404</h1>
                    <p className="text-sm opacity-70">
                        This page could not be found.
                    </p>
                </div>

                {/* Description */}
                <p className="text-sm opacity-70 leading-relaxed">
                    The meeting link may be broken, expired, or you may not have
                    permission to view this page.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Link
                        href="/"
                        className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                    >
                        Go to Dashboard
                    </Link>

                    <Link
                        href="/"
                        className="w-full py-2.5 rounded-lg border font-medium transition hover:bg-black/5 dark:hover:bg-white/5"
                        style={{
                            borderColor: "var(--color-border)",
                        }}
                    >
                        Report a Problem
                    </Link>
                </div>
            </div>
        </div>
    );
}
