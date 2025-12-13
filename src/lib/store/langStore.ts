"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { changeLanguage } from "@/lib/i18n";

type LangStore = {
    lang: string;
    setLang: (lng: string) => void;
};

export const useLangStore = create<LangStore>()(
    persist(
        (set) => ({
            lang: "en", // getCurrentLanguage(), // i18n default (usually "en")

            setLang: async  (lng) => {
                await changeLanguage(lng);      // update i18n engine
                set({ lang: lng });       // update Zustand
            },
        }),
        {
            name: "app-language",        // localStorage key
        }
    )
);
