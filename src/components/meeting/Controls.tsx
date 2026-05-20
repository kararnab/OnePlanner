"use client";

import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    Captions,
    MonitorUp,
    MoreHorizontal,
    Phone,
} from "lucide-react";
import React from "react";

export default function Controls({ roomId }: { roomId: string }) {
    const muted = false; // replace with state
    const cameraOff = false; // replace with state

    return (
        <div className="w-full flex items-center justify-center shrink-0 py-4">
            {/* Floating bar */}
            <div className="
                flex items-center gap-3
                px-5 py-3
                bg-[#202124]/95
                backdrop-blur-md
                rounded-full
                shadow-[0_4px_20px_rgba(0,0,0,0.4)]
            ">
                <ControlCircle active={!muted}>
                    {muted ? <MicOff size={20}/> : <Mic size={20}/>}
                </ControlCircle>

                <ControlCircle active={!cameraOff}>
                    {cameraOff ? <VideoOff size={20}/> : <Video size={20}/>}
                </ControlCircle>

                <ControlCircle>
                    <Captions size={20}/>
                </ControlCircle>

                <ControlCircle>
                    <MonitorUp size={20}/>
                </ControlCircle>

                <ControlCircle>
                    <MoreHorizontal size={22}/>
                </ControlCircle>
            </div>

            {/* Hangup */}
            <button
                aria-label="Leave call"
                className="
                    ml-4 h-14 px-6 rounded-full
                    bg-[#EA4335] hover:bg-[#D93025]
                    flex items-center justify-center shadow-lg
                    transition shrink-0
                "
                onClick={() => (window.location.href = "/meeting/ended")}
            >
                <Phone size={24} className="text-white rotate-[135deg]" fill="currentColor" />
            </button>
        </div>
    );
}


function ControlCircle({
                           children,
                           active = true,
                           onClick,
                       }: {
    children: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`
                w-11 h-11 rounded-full 
                flex items-center justify-center
                transition
                ${active
                ? "bg-[#3C4043] hover:bg-[#5F6368]"
                : "bg-[#5F6368]/80 hover:bg-[#80868B]"
            }
            `}
        >
            {children}
        </button>
    );
}
