import type { ClientResponse, ApiError } from "@/lib/api/api.types";

const HISTORY = [
    { id: 1, title: "Q2 review + goal setting",       type: "1:1 coaching",      date: "08 May 2026", duration: "60 min", hasNotes: true,  hasRecording: true },
    { id: 2, title: "Manager 1:1 prep",                type: "1:1 coaching",      date: "24 Apr 2026", duration: "60 min", hasNotes: true,  hasRecording: true },
    { id: 3, title: "Career trajectory",               type: "1:1 coaching",      date: "10 Apr 2026", duration: "60 min", hasNotes: true,  hasRecording: false },
    { id: 4, title: "Portfolio review · staff IC cases", type: "Portfolio review", date: "27 Mar 2026", duration: "45 min", hasNotes: true,  hasRecording: true },
];

const PINNED_NOTES = [
    {
        date: "08 May 2026",
        body: "Locked in two Q2 goals: (1) ship the planning loop revamp end-to-end, (2) hire a senior IC and onboard them past first prod commit. Worried about #2 — sourcing is slow at the moment.",
        tags: ["goals", "Q2"],
    },
    {
        date: "24 Apr 2026",
        body: "Marcus is feeling the pull back to IC. Worth pressure-testing the assumption that the manager-track will look the same in 6 months given the org restructure.",
        tags: ["career"],
    },
];

const ALL_NOTES = [
    ...PINNED_NOTES,
    {
        date: "10 Apr 2026",
        body: "The manager path looks like a 3-quarter commitment minimum. Worth gut-checking whether Marcus wants the lateral move first.",
        tags: ["career"],
    },
    {
        date: "27 Mar 2026",
        body: "Portfolio shows strong systems-level thinking. Weakness is in articulating tradeoffs out loud — practice via the case-study format we used today.",
        tags: ["staff-track"],
    },
    {
        date: "13 Mar 2026",
        body: "First session. Big-picture problem: feels reactive at work, wants to be more deliberate. Suggested time-blocking experiment for 2 weeks.",
        tags: ["onboarding"],
    },
];

const FILES: ClientResponse["files"] = [
    { name: "Q2 goals worksheet.pdf",   meta: "08 May · 240 KB",  kind: "doc" },
    { name: "planning-loop-retro.md",   meta: "24 Apr · 12 KB",   kind: "markdown" },
    { name: "staff-IC-cases.zip",       meta: "27 Mar · 4.2 MB",  kind: "archive" },
    { name: "manager-1on1-prep.md",     meta: "24 Apr · 8 KB",    kind: "markdown" },
    { name: "career-mind-map.png",      meta: "10 Apr · 720 KB",  kind: "image" },
];

const MARCUS: ClientResponse = {
    id: "marcus",
    name: "Marcus Park",
    blurb: "Engineering manager at Northpoint · Client since March 2024",
    isNew: false,
    sessions: 14,
    hours: "11.5",
    nextSession: "Tue, 21 May",
    ltv: "$1,680",
    nextSessionDetail: {
        eyebrow: "Next session · in 3 days",
        title: "1:1 coaching — IC vs management fork",
        when: "Tuesday, 21 May · 14:00 – 15:00 PT",
        clientNote:
            "I want to bring the prep doc we started last session — manager picked up the team unexpectedly and I'm second-guessing whether to take the offer.",
    },
    contact: {
        email: "marcus.park@northpoint.io",
        role: "Engineering Manager, Northpoint",
        timezone: "Pacific time (PT)",
        linkedin: "linkedin.com/in/marcuspark",
    },
    goals: [
        { label: "Decide on IC ↔ manager direction by end of June", pct: 60 },
        { label: "Hire 1 senior IC and onboard past first prod commit", pct: 25 },
        { label: "Run a planning loop retro with leads", pct: 100 },
    ],
    history: HISTORY,
    pinnedNotes: PINNED_NOTES,
    notes: ALL_NOTES,
    files: FILES,
};

const PRIYA: ClientResponse = {
    id: "priya",
    name: "Priya Anand",
    blurb: "Senior PM at Helio · Added 2 days ago",
    isNew: true,
    sessions: 0,
    hours: "0",
    nextSession: "—",
    ltv: "—",
    contact: {
        email: "priya@helio.co",
        role: "Senior PM, Helio",
        timezone: "Pacific time (PT)",
        linkedin: "linkedin.com/in/priya-anand",
    },
    goals: [],
    history: [],
    pinnedNotes: [],
    notes: [],
    files: [],
};

const REGISTRY: Record<string, ClientResponse> = {
    marcus: MARCUS,
    priya: PRIYA,
};

export async function mockGetClient(id: string): Promise<ClientResponse> {
    const client = REGISTRY[id];
    if (!client) {
        const error: ApiError = { status: 404, message: `Client "${id}" not found` };
        throw error;
    }
    return client;
}
