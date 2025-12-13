"use client";

import i18n from "./i18n-impl";
import type { CommonKeys } from "@/lib/types/i18n";

// Main translate function
export function t(
    key: CommonKeys,
    values?: Record<string, string | number>
): string {
    return i18n.t(key, values) as string;
}

// Change language
export function changeLanguage(lang: string): Promise<void> {
    return i18n.changeLanguage(lang).then(() => {});
}
