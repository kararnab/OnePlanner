"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Participant {
    id: string;
    name: string;
    stream?: MediaStream;
}

const GAP = 12;
const OUTER_PAD = 12;

/**
 * Google Meet's landscape row distribution.
 * Smaller row goes on top, centered, so the larger row anchors the bottom.
 */
function getRowsLandscape(n: number): number[] {
    switch (n) {
        case 0: return [];
        case 1: return [1];
        case 2: return [2];
        case 3: return [3];
        case 4: return [2, 2];
        case 5: return [2, 3];
        case 6: return [3, 3];
        case 7: return [3, 4];
        case 8: return [4, 4];
        case 9: return [3, 3, 3];
        case 10: return [3, 3, 4];
        case 11: return [3, 4, 4];
        case 12: return [4, 4, 4];
        case 13: return [4, 4, 5];
        case 14: return [4, 5, 5];
        case 15: return [5, 5, 5];
        default: return [4, 4, 4, 4]; // 16
    }
}

/** Portrait fallback — transposed honeycomb. */
function getRowsPortrait(n: number): number[] {
    switch (n) {
        case 0: return [];
        case 1: return [1];
        case 2: return [1, 1];
        case 3: return [1, 2];
        case 4: return [2, 2];
        case 5: return [1, 2, 2];
        case 6: return [2, 2, 2];
        case 7: return [2, 2, 3];
        case 8: return [2, 3, 3];
        case 9: return [3, 3, 3];
        case 10: return [2, 2, 3, 3];
        case 11: return [2, 3, 3, 3];
        case 12: return [3, 3, 3, 3];
        case 13: return [3, 3, 3, 4];
        case 14: return [3, 3, 4, 4];
        case 15: return [3, 4, 4, 4];
        default: return [4, 4, 4, 4];
    }
}

function useContainerSize() {
    const ref = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ w: 0, h: 0 });

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const ro = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const cr = entry.contentRect;
                setSize({ w: cr.width, h: cr.height });
            }
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    return { ref, size };
}

function useIsMobile() {
    const [m, setM] = useState(false);
    useEffect(() => {
        const c = () => setM(window.innerWidth < 640);
        c();
        window.addEventListener("resize", c);
        return () => window.removeEventListener("resize", c);
    }, []);
    return m;
}

export default function VideoGrid({
    participants = [],
    screenShare,
}: {
    participants?: Participant[];
    screenShare: { active: boolean; ownerId: string | null };
}) {
    const isMobile = useIsMobile();
    const list = participants.slice(0, 16);

    const sharer = screenShare.active
        ? participants.find((p) => p.id === screenShare.ownerId) ?? null
        : null;
    const others = sharer ? participants.filter((p) => p.id !== sharer.id) : [];

    if (sharer) {
        return isMobile ? (
            <MobileScreenShare sharer={sharer} others={others} />
        ) : (
            <DesktopScreenShare sharer={sharer} others={others} />
        );
    }

    if (isMobile && list.length === 2) {
        return <MobileTwoPersonPiP main={list[0]} self={list[1]} />;
    }

    return <BestFitGrid list={list} />;
}

function BestFitGrid({ list }: { list: Participant[] }) {
    const { ref, size } = useContainerSize();
    const landscape = size.w >= size.h;
    const rows = landscape ? getRowsLandscape(list.length) : getRowsPortrait(list.length);
    const maxCols = Math.max(...rows, 1);
    const R = Math.max(rows.length, 1);

    // Inner area after outer padding
    const innerW = Math.max(0, size.w - OUTER_PAD * 2);
    const innerH = Math.max(0, size.h - OUTER_PAD * 2);

    // Meet's Dynamic layout: tiles fill the cell, no fixed aspect ratio.
    // Same cell size for every tile, sized by the widest row.
    const tileW = Math.max(0, (innerW - GAP * (maxCols - 1)) / maxCols);
    const tileH = Math.max(0, (innerH - GAP * (R - 1)) / R);

    // Position each participant (smaller rows centered above larger rows)
    const positions: Record<string, { x: number; y: number }> = {};

    let cursor = 0;
    rows.forEach((rowSize, rowIdx) => {
        const rowW = tileW * rowSize + GAP * (rowSize - 1);
        const xStart = OUTER_PAD + (innerW - rowW) / 2;
        const y = OUTER_PAD + rowIdx * (tileH + GAP);
        for (let i = 0; i < rowSize; i++) {
            const p = list[cursor];
            if (!p) break;
            positions[p.id] = { x: xStart + i * (tileW + GAP), y };
            cursor++;
        }
    });

    const measured = size.w > 0 && size.h > 0 && tileW > 0 && tileH > 0;
    const spring = { type: "spring" as const, stiffness: 260, damping: 30, mass: 0.7 };

    return (
        <div ref={ref} className="flex-1 w-full h-full bg-black overflow-hidden relative">
            {measured && (
                <AnimatePresence>
                    {list.map((p) => {
                        const pos = positions[p.id] ?? {
                            x: size.w / 2 - tileW / 2,
                            y: size.h / 2 - tileH / 2,
                        };
                        return (
                            <motion.div
                                key={p.id}
                                initial={{
                                    opacity: 0,
                                    scale: 0.85,
                                    x: pos.x,
                                    y: pos.y,
                                    width: tileW,
                                    height: tileH,
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    x: pos.x,
                                    y: pos.y,
                                    width: tileW,
                                    height: tileH,
                                }}
                                exit={{ opacity: 0, scale: 0.85 }}
                                transition={spring}
                                style={{ position: "absolute", top: 0, left: 0 }}
                                className="bg-[#202124] rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-lg"
                            >
                                <VideoTile participant={p} />
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            )}
        </div>
    );
}

function MobileTwoPersonPiP({ main, self }: { main: Participant; self: Participant }) {
    return (
        <div className="flex-1 w-full bg-black p-2 relative overflow-hidden">
            <motion.div
                layout
                className="w-full h-full rounded-xl overflow-hidden ring-1 ring-white/10"
            >
                <VideoTile participant={main} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 220, damping: 22 }}
                drag
                dragMomentum={false}
                dragElastic={0.15}
                className="absolute bottom-28 right-3 w-28 h-40 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/20 bg-[#202124] cursor-grab active:cursor-grabbing"
            >
                <VideoTile participant={self} />
            </motion.div>
        </div>
    );
}

function DesktopScreenShare({
    sharer,
    others,
}: {
    sharer: Participant;
    others: Participant[];
}) {
    return (
        <div className="flex-1 w-full h-full bg-black flex overflow-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="flex-1 h-full p-3"
            >
                <div className="w-full h-full bg-[#202124] rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-xl">
                    <VideoTile participant={sharer} />
                </div>
            </motion.div>

            <motion.div
                initial={{ x: 220, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 220, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 28 }}
                className="w-64 h-full flex flex-col gap-3 p-3 overflow-y-auto"
            >
                <AnimatePresence mode="popLayout">
                    {others.map((p) => (
                        <motion.div
                            key={p.id}
                            layout
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.92 }}
                            transition={{ type: "spring", stiffness: 240, damping: 26 }}
                            className="aspect-video w-full shrink-0 bg-[#202124] rounded-xl overflow-hidden ring-1 ring-white/10"
                        >
                            <VideoTile participant={p} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

function MobileScreenShare({
    sharer,
    others,
}: {
    sharer: Participant;
    others: Participant[];
}) {
    return (
        <div className="flex-1 w-full h-full bg-black flex flex-col overflow-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.28 }}
                className="flex-1 p-2"
            >
                <div className="w-full h-full rounded-xl overflow-hidden bg-[#202124] ring-1 ring-white/10">
                    <VideoTile participant={sharer} />
                </div>
            </motion.div>

            <motion.div
                initial={{ y: 120, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 160, damping: 22 }}
                className="w-full flex gap-2 p-2 overflow-x-auto"
            >
                <AnimatePresence mode="popLayout">
                    {others.map((p) => (
                        <motion.div
                            key={p.id}
                            layout
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.92 }}
                            className="h-24 aspect-video shrink-0 bg-[#202124] rounded-lg overflow-hidden ring-1 ring-white/10"
                        >
                            <VideoTile participant={p} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

function VideoTile({ participant }: { participant: Participant }) {
    const initials = participant.name
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[#3a3a3d] to-[#1f1f22]">
            <video
                autoPlay
                playsInline
                muted
                ref={(el) => {
                    if (el && participant.stream) el.srcObject = participant.stream;
                }}
                className="w-full h-full object-cover"
            />
            {!participant.stream && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-lg sm:text-2xl shadow-lg ring-2 ring-white/10">
                        {initials || "?"}
                    </div>
                </div>
            )}
            <div className="absolute bottom-2 left-2 px-2.5 py-1 text-xs bg-black/55 backdrop-blur rounded-md text-white font-medium">
                {participant.name}
            </div>
        </div>
    );
}
