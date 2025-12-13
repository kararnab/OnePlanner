"use client";

import { Calendar } from "lucide-react";

export default function ScheduleMeetingCard() {
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
                    <Calendar size={20} className="text-blue-600" />
                </div>

                <div>
                    <h3 className="font-semibold">Schedule a meeting</h3>
                    <p className="text-sm opacity-70">
                        Create a meeting for a future time
                    </p>
                </div>
            </div>

            <button
                className="
          w-full py-2.5 rounded-lg
          bg-blue-600 text-white font-medium
          hover:bg-blue-700 transition
        "
            >
                Schedule
            </button>
        </div>
    );
}
