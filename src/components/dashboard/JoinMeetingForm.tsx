"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";
import Input from "@/components/ui/Input";

export default function JoinMeetingForm({
                                            onJoinMeeting,
                                        }: {
    onJoinMeeting: (roomId: string) => void;
}) {
    const [roomId, setRoomId] = useState("");

    return (
        <div
            className="rounded-2xl shadow-sm p-5 flex flex-col gap-4 border"
            style={{
                background: "var(--color-background)",
                color: "var(--color-foreground)",
                borderColor: "var(--color-border)",
            }}
        >
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-500/15">
                    <LogIn size={20} className="text-blue-600" />
                </div>

                <div>
                    <h3 className="font-semibold">Join a meeting</h3>
                    <p className="text-sm opacity-70">
                        Enter a meeting code to join
                    </p>
                </div>
            </div>

            <Input
                label="Meeting ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
            />

            <button
                onClick={() => roomId && onJoinMeeting(roomId)}
                className="
          w-full py-2.5 rounded-lg
          bg-blue-600 text-white font-medium
          hover:bg-blue-700 transition
        "
            >
                Join
            </button>
        </div>
    );
}
