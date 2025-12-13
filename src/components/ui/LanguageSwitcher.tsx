"use client";

import { useLangStore } from "@/lib/store/langStore";

export default function LanguageSwitcher() {
    const lang = useLangStore((s) => s.lang);
    const setLang = useLangStore((s) => s.setLang);

    return (
        <select
            className="p-2 rounded bg-gray-800 text-white"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
        >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
        </select>
    );
}
