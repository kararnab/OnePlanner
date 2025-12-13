"use client";

import { useState } from "react";
import { Plus, Minus, MonitorUp, MonitorOff } from "lucide-react";
import VideoGrid from "@/components/meeting/VideoGrid";
import Controls from "@/components/meeting/Controls";

interface Participant {
    id: string;
    name: string;
}

const NAME_POOL = [
    "Alex",
    "Sam",
    "Jordan",
    "Riley",
    "Casey",
    "Taylor",
    "Morgan",
    "Drew",
    "Pat",
    "Quinn",
    "Reese",
    "Rowan",
    "Avery",
    "Skyler",
    "Sage",
];

const initialParticipants: Participant[] = [
    { id: "self", name: "You" },
    { id: "p-1", name: "Person A" },
    { id: "p-2", name: "Person B" },
];

export default function MeetingClient({ roomId }: { roomId: string }) {
    const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
    const [shareActive, setShareActive] = useState(false);

    const addParticipant = () => {
        setParticipants((prev) => {
            if (prev.length >= 16) return prev;
            const name = NAME_POOL[(prev.length - 1) % NAME_POOL.length] ?? `Guest ${prev.length}`;
            return [...prev, { id: `auto-${Date.now()}-${prev.length}`, name }];
        });
    };

    const removeParticipant = () => {
        setParticipants((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
    };

    return (
        <div className="h-screen flex flex-col bg-black text-white">
            {/* Video Area */}
            <main className="flex-1 flex overflow-hidden pb-28 md:pb-0 relative">
                <VideoGrid
                    participants={participants}
                    screenShare={{
                        active: shareActive,
                        ownerId: shareActive ? participants[0]?.id ?? null : null,
                    }}
                />

                {/* Demo controls — remove once real WebRTC join/leave is wired up */}
                <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                    <button
                        onClick={() => setShareActive((s) => !s)}
                        className="h-9 px-3 rounded-full bg-black/55 backdrop-blur ring-1 ring-white/15 hover:bg-black/75 transition flex items-center gap-1.5 text-xs"
                        aria-label="Toggle screen share"
                    >
                        {shareActive ? <MonitorOff size={14} /> : <MonitorUp size={14} />}
                        <span className="hidden sm:inline">
                            {shareActive ? "Stop share" : "Share"}
                        </span>
                    </button>

                    <div className="flex items-center bg-black/55 backdrop-blur ring-1 ring-white/15 rounded-full overflow-hidden">
                        <button
                            onClick={removeParticipant}
                            disabled={participants.length <= 1}
                            className="w-9 h-9 hover:bg-white/10 transition flex items-center justify-center disabled:opacity-40 disabled:hover:bg-transparent"
                            aria-label="Remove participant"
                        >
                            <Minus size={16} />
                        </button>
                        <span className="px-2 text-xs font-medium tabular-nums min-w-[1.5rem] text-center">
                            {participants.length}
                        </span>
                        <button
                            onClick={addParticipant}
                            disabled={participants.length >= 16}
                            className="w-9 h-9 hover:bg-white/10 transition flex items-center justify-center disabled:opacity-40 disabled:hover:bg-transparent"
                            aria-label="Add participant"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
            </main>

            {/* Controls */}
            <footer
                className="
                    shrink-0 p-4
                    fixed bottom-0 left-0 w-full
                    md:static md:w-auto
                    bg-black/80 md:bg-transparent
                    backdrop-blur md:backdrop-blur-0
                    z-20
                    pb-[calc(env(safe-area-inset-bottom)+1rem)]
                "
            >
                <Controls roomId={roomId} />
            </footer>
        </div>
    );
}
