"use client";

import "@/lib/i18n/i18n-impl";   // ✅ i18n initialized here
import React, { useEffect, useRef } from "react";
import { useLangStore } from "@/lib/store/langStore";

const SUPPORTED_LANGS = ["en", "hi"];

function normalizeLang(lang: string): string {
    // "en-US" → "en"
    // "hi-IN" → "hi"
    return lang.split("-")[0].toLowerCase();
}

export default function LanguageProvider({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    const lang = useLangStore((s) => s.lang);
    const setLang = useLangStore((s) => s.setLang);

    const hasInitialized = useRef(false);

    useEffect(() => {
        // ✅ First run only: resolve initial language
        if (!hasInitialized.current) {
            hasInitialized.current = true;

            const browserLang = normalizeLang(navigator.language);
            const resolved = SUPPORTED_LANGS.includes(browserLang)
                ? browserLang
                : "en";

            // Only override if persisted value does not exist
            if (!lang || lang === "en") {
                setLang(resolved); // ✅ store handles changeLanguage
                document.documentElement.lang = resolved;
                return;
            }
        }

        // ✅ Normal sync on future updates
        document.documentElement.lang = lang;
    }, [lang, setLang]);

    return <>{children}</>;
}
