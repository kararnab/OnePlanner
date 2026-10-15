"use client";

import { Video } from "lucide-react";

export default function DashboardCard({
                                          onStartMeeting,
                                      }: {
    onStartMeeting: () => void;
}) {
    return (
        <div className="op-card p-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <div className="op-icon-bubble">
                    <Video size={20} />
                </div>
                <div>
                    <h3 className="op-card-title">Start a meeting</h3>
                    <p className="op-card-sub">You will start a new video meeting</p>
                </div>
            </div>
            <button className="op-cta" onClick={onStartMeeting}>Start</button>
        </div>
    );
}
