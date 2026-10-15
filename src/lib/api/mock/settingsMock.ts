import type { SettingsResponse } from "@/lib/api/api.types";

const SETTINGS: SettingsResponse = {
    profile: {
        name: "Amelia Chen",
        handle: "amelia",
        tagline: "Product leadership coaching",
        bio: "I work with senior PMs and early-stage founders on the messy in-between — from first manager hire to the IC-or-VP fork in the road.",
        email: "amelia@chen.co",
        timezone: "America/Los_Angeles",
        language: "en",
    },
    availability: {
        days: [
            { id: "mon", label: "Monday",    on: true,  start: "09:00", end: "17:00" },
            { id: "tue", label: "Tuesday",   on: true,  start: "09:00", end: "17:00" },
            { id: "wed", label: "Wednesday", on: true,  start: "10:00", end: "15:00" },
            { id: "thu", label: "Thursday",  on: true,  start: "09:00", end: "17:00" },
            { id: "fri", label: "Friday",    on: true,  start: "09:00", end: "13:00" },
            { id: "sat", label: "Saturday",  on: false, start: "10:00", end: "14:00" },
            { id: "sun", label: "Sunday",    on: false, start: "10:00", end: "14:00" },
        ],
        bufferBefore: 0,
        bufferAfter: 15,
        maxPerDay: 6,
        horizon: 8,
        blackouts: [
            { date: "27 May – 3 Jun", reason: "Conference (Berlin)" },
            { date: "4 Jul",          reason: "Public holiday (US)" },
        ],
    },
    sessionTypes: [
        { id: "intro",  title: "Intro call",        duration: 30, price: "Free", color: "var(--color-primary)", icon: "message-circle", booked: 23,  visible: true,  blurb: "A short get-to-know-you so we can scope what you need." },
        { id: "1on1",   title: "1:1 coaching",      duration: 60, price: "$120", color: "#8b5cf6",              icon: "compass",        booked: 142, visible: true,  blurb: "Deep-dive working session on a single problem you're stuck on." },
        { id: "review", title: "Portfolio review",  duration: 45, price: "$80",  color: "#10b981",              icon: "file-search",    booked: 38,  visible: true,  blurb: "I'll walk through up to 3 cases with written notes after." },
        { id: "deep",   title: "Deep work 90",      duration: 90, price: "$180", color: "#f59e0b",              icon: "infinity",       booked: 12,  visible: false, blurb: "Long-form session for landing a meaty decision in one sitting." },
    ],
};

export async function mockGetSettings(): Promise<SettingsResponse> {
    return SETTINGS;
}
