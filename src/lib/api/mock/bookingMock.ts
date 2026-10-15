import type { BookingPageResponse, ApiError } from "@/lib/api/api.types";

const SLOTS = ["09:00", "09:30", "10:00", "10:30", "13:00", "14:00", "15:00", "16:00", "16:30"];

function buildDays(fullyBooked: boolean): BookingPageResponse["days"] {
    const today = new Date();
    return Array.from({ length: 14 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const dow = d.getDay();
        let available = !(dow === 0 || dow === 6);
        if (fullyBooked) available = false;
        if (i === 2 || i === 8) available = false;
        const iso = d.toISOString().slice(0, 10);
        return { iso, available };
    });
}

const AMELIA = {
    handle: "amelia",
    name: "Amelia Chen",
    tagline: "Product leadership coaching",
    bio: "I work with senior PMs and early-stage founders on the messy in-between — from first manager hire to the IC-or-VP fork in the road.",
    timezone: "Pacific time (PT)",
};

const SESSION_TYPES = [
    { id: "intro",  title: "Intro call",        duration: 30, price: "Free", blurb: "A short get-to-know-you so we can scope what you need.",            icon: "message-circle" },
    { id: "1on1",   title: "1:1 coaching",      duration: 60, price: "$120", blurb: "Deep-dive working session on a single problem you're stuck on.",    icon: "compass" },
    { id: "review", title: "Portfolio review",  duration: 45, price: "$80",  blurb: "I'll walk through up to 3 cases with written notes after.",         icon: "file-search" },
];

export async function mockGetBookingPage(
    handle: string,
    state: "default" | "empty" | "404",
): Promise<BookingPageResponse> {
    if (state === "404" || handle === "not-found") {
        const error: ApiError = { status: 404, message: "Expert booking page not found" };
        throw error;
    }

    const fullyBooked = state === "empty";

    return {
        expert: { ...AMELIA, handle },
        sessionTypes: SESSION_TYPES,
        days: buildDays(fullyBooked),
        slots: SLOTS,
        takenIndexes: [1, 5], // 09:30, 14:00
        fullyBooked,
    };
}
