"use client";

import { Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ScheduleMeetingCard() {
    const router = useRouter();
    return (
        <div className="op-card p-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <div className="op-icon-bubble">
                    <Calendar size={20} />
                </div>
                <div>
                    <h3 className="op-card-title">Schedule a meeting</h3>
                    <p className="op-card-sub">Create a meeting for a future time</p>
                </div>
            </div>
            <button className="op-cta" onClick={() => router.push("/schedule")}>
                Schedule
            </button>
        </div>
    );
}
