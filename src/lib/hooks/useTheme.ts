"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "op-theme";

export type Theme = "light" | "dark";

function readInitialTheme(): Theme {
    if (typeof window === "undefined") return "light";
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored === "light" || stored === "dark") return stored;
    } catch {
        /* ignore */
    }
    const attr = document.documentElement.getAttribute("data-theme") as Theme | null;
    return attr === "dark" ? "dark" : "light";
}

function applyTheme(t: Theme) {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", t);
    try {
        window.localStorage.setItem(STORAGE_KEY, t);
    } catch {
        /* ignore */
    }
}

export function useTheme(): { theme: Theme; toggleTheme: () => void; setTheme: (t: Theme) => void } {
    const [theme, setThemeState] = useState<Theme>(readInitialTheme);

    // Keep the DOM in sync with React state. No setState here — only an external write.
    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const setTheme = useCallback((t: Theme) => setThemeState(t), []);
    const toggleTheme = useCallback(
        () => setThemeState((prev) => (prev === "dark" ? "light" : "dark")),
        [],
    );

    return { theme, toggleTheme, setTheme };
}
