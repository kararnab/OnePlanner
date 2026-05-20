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
        <div className="op-card p-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <div className="op-icon-bubble">
                    <LogIn size={20} />
                </div>
                <div>
                    <h3 className="op-card-title">Join a meeting</h3>
                    <p className="op-card-sub">Enter a meeting code to join</p>
                </div>
            </div>

            <Input
                label="Meeting ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
            />

            <button
                className="op-cta"
                disabled={!roomId}
                onClick={() => roomId && onJoinMeeting(roomId)}
            >
                Join
            </button>
        </div>
    );
}
