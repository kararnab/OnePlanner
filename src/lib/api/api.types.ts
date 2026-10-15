import {AgendaItemData} from "@/components/dashboard/AgendaCard";
import {InvitationItem} from "@/components/dashboard/InvitationCard";

export type HttpResponse<T> = {
    data: T;
    status: number;
    headers?: Record<string, string>;
};

export type ApiError = {
    status: number;
    message: string;
    code?: string;
};

export function isApiError(err: unknown): err is ApiError {
    return (
        typeof err === "object" &&
        err !== null &&
        "status" in err &&
        "message" in err
    );
}

export type LoginResponse = {
    user: {
        name: string;
        email: string;
    };
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn: number;
};

export type RefreshResponse = {
    accessToken: string;
    accessTokenExpiresIn: number;
};

export type DashboardResponse = {
    agenda: {
        date: string,
        data: AgendaItemData[]
    },
    invitation: {
        date: string,
        data: InvitationItem[]
    },
}

/* ===== Clients ===== */

export type SessionHistoryItem = {
    id: number;
    title: string;
    type: string;
    date: string;
    duration: string;
    hasNotes: boolean;
    hasRecording: boolean;
};

export type ClientNote = {
    date: string;
    body: string;
    tags: string[];
};

export type ClientFile = {
    name: string;
    meta: string;
    kind: "doc" | "markdown" | "archive" | "image";
};

export type ClientGoal = {
    label: string;
    pct: number;
};

export type ClientContact = {
    email: string;
    role: string;
    timezone: string;
    linkedin: string;
};

export type ClientResponse = {
    id: string;
    name: string;
    blurb: string;
    isNew: boolean;
    sessions: number;
    hours: string;
    nextSession: string;
    ltv: string;
    nextSessionDetail?: {
        eyebrow: string;
        title: string;
        when: string;
        clientNote: string;
    };
    contact: ClientContact;
    goals: ClientGoal[];
    history: SessionHistoryItem[];
    notes: ClientNote[];
    pinnedNotes: ClientNote[];
    files: ClientFile[];
};

/* ===== Settings ===== */

export type DayConfig = {
    id: string;
    label: string;
    on: boolean;
    start: string;
    end: string;
};

export type Blackout = {
    date: string;
    reason: string;
};

export type SessionTypeRecord = {
    id: string;
    title: string;
    duration: number;
    price: string;
    color: string;
    icon: string; // lucide-react name; resolved on the client
    booked: number;
    visible: boolean;
    blurb: string;
};

export type SettingsResponse = {
    profile: {
        name: string;
        handle: string;
        tagline: string;
        bio: string;
        email: string;
        timezone: string;
        language: string;
    };
    availability: {
        days: DayConfig[];
        bufferBefore: number;
        bufferAfter: number;
        maxPerDay: number;
        horizon: number;
        blackouts: Blackout[];
    };
    sessionTypes: SessionTypeRecord[];
};

/* ===== Booking (public expert page) ===== */

export type BookingSessionType = {
    id: string;
    title: string;
    duration: number;
    price: string;
    blurb: string;
    icon: string; // lucide-react name
};

export type BookingExpert = {
    handle: string;
    name: string;
    tagline: string;
    bio: string;
    timezone: string;
};

export type BookingDayCell = {
    iso: string; // YYYY-MM-DD
    available: boolean;
};

export type BookingPageResponse = {
    expert: BookingExpert;
    sessionTypes: BookingSessionType[];
    days: BookingDayCell[];
    slots: string[];
    takenIndexes: number[];
    fullyBooked: boolean;
};
