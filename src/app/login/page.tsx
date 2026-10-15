"use client";

import BrandLogo from "@/components/ui/BrandLogo";
import LoginClient from "./LoginClient";
import { t } from "@/lib/i18n";

export default function LoginPage() {
    return (
        <div
            className="min-h-screen flex"
            style={{
                background: "var(--color-background)",
                color: "var(--color-foreground)",
            }}
        >
            {/* Brand panel — desktop only */}
            <aside className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white p-12 flex-col justify-between">
                <div
                    aria-hidden
                    className="pointer-events-none absolute -top-32 -right-24 w-[420px] h-[420px] rounded-full bg-white/15 blur-3xl"
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-40 -left-32 w-[520px] h-[520px] rounded-full bg-white/10 blur-3xl"
                />

                <div className="relative z-10 flex items-center gap-3">
                    <div className="bg-white/15 rounded-xl p-2 backdrop-blur ring-1 ring-white/20">
                        <BrandLogo width={42} priority />
                    </div>
                    <span className="text-lg font-semibold tracking-tight">
                        {t("appName")}
                    </span>
                </div>

                <div className="relative z-10 space-y-4 max-w-md">
                    <h2 className="text-4xl font-semibold leading-tight tracking-tight">
                        {t("tagline")}
                    </h2>
                    <p className="text-white/80 text-lg leading-relaxed">
                        {t("taglineSubtitle")}
                    </p>
                </div>

                <div className="relative z-10 text-xs text-white/60">
                    © {new Date().getFullYear()} {t("appName")}
                </div>
            </aside>

            {/* Form panel */}
            <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex justify-center">
                        <BrandLogo width={72} priority />
                    </div>

                    <div className="space-y-2 text-center lg:text-left">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            {t("welcomeBack")}
                        </h1>
                        <p className="text-sm opacity-70">{t("signInSubtitle")}</p>
                    </div>

                    <LoginClient />
                </div>
            </main>
        </div>
    );
}
