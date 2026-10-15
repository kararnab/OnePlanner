"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import BrandLogo from "@/components/ui/BrandLogo";
import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    Aperture,
    Volume2,
    ChevronDown,
    CameraOff,
    Lock,
    Hourglass,
    Monitor,
    Phone,
    Link as LinkIcon,
    Captions,
    RefreshCw,
    CircleHelp,
    Circle,
    type LucideIcon,
} from "lucide-react";
import { Avatar, Chip, FButton, ThemeToggle } from "@/components/flows/Primitives";

type State = "ready" | "waiting" | "permissions";

export default function PreviewClient() {
    const router = useRouter();
    const params = useSearchParams();
    const stateParam = params.get("state");
    const state: State =
        stateParam === "waiting"
            ? "waiting"
            : stateParam === "permissions"
                ? "permissions"
                : "ready";
    const roomId = params.get("roomId") || "mxk-prkw-tcz";

    // Remount when the demo state flips so internal toggles reset cleanly.
    return <PreviewFlow key={state} state={state} roomId={roomId} router={router} />;
}

function PreviewFlow({
    state,
    roomId,
    router,
}: {
    state: State;
    roomId: string;
    router: ReturnType<typeof useRouter>;
}) {
    const blocked = state === "permissions";
    const waiting = state === "waiting";

    const [camOn, setCamOn] = useState(!blocked);
    const [micOn, setMicOn] = useState(!blocked);
    const [blurOn, setBlurOn] = useState(false);

    const join = () => {
        if (!blocked && !waiting) router.push(`/meeting?roomId=${roomId}`);
    };
    const back = () => router.push("/dashboard");

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "var(--background)",
                color: "var(--fg-1)",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <PreviewTopBar roomId={roomId} onBack={back} />

            <div
                className="op-preview-grid"
                style={{
                    flex: 1,
                    maxWidth: 1240,
                    margin: "0 auto",
                    width: "100%",
                    padding: "32px 24px 48px",
                }}
            >
                {/* LEFT — self-view */}
                <section style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                    <SelfView
                        camOn={camOn && !blocked}
                        micOn={micOn && !blocked}
                        blurOn={blurOn}
                        blocked={blocked}
                    />
                    <ControlStrip
                        camOn={camOn}
                        setCamOn={setCamOn}
                        micOn={micOn}
                        setMicOn={setMicOn}
                        blurOn={blurOn}
                        setBlurOn={setBlurOn}
                        blocked={blocked}
                    />
                    <DeviceRow blocked={blocked} />
                </section>

                {/* RIGHT — join panel */}
                <aside
                    style={{
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 18,
                        justifyContent: "center",
                    }}
                >
                    <JoinPanel
                        blocked={blocked}
                        waiting={waiting}
                        roomId={roomId}
                        onJoin={join}
                    />
                    {blocked ? <PermissionsHelp /> : <OtherWaysToJoin roomId={roomId} />}
                </aside>
            </div>
        </div>
    );
}

function PreviewTopBar({ roomId, onBack }: { roomId: string; onBack: () => void }) {
    return (
        <header
            style={{
                padding: "14px 20px",
                borderBottom: "1px solid var(--color-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--surface)",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
                <Link href="/dashboard" style={{ display: "inline-flex" }} onClick={onBack}>
                    <BrandLogo width={70} priority />
                </Link>
                <span
                    style={{
                        padding: "3px 10px",
                        borderRadius: 9999,
                        background: "var(--surface-2)",
                        border: "1px solid var(--color-border)",
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                        fontSize: 11.5,
                        color: "var(--fg-3)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    amelia.oneplanner.app / room / {roomId}
                </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                    style={{
                        fontSize: 12,
                        color: "var(--fg-3)",
                        fontVariantNumeric: "tabular-nums",
                    }}
                    className="hidden sm:inline"
                >
                    14:00 · Tue, 21 May
                </span>
                <ThemeToggle />
            </div>
        </header>
    );
}

/* -----------------------------------------------------------
   Self-view tile — always dark inside (video chrome rule)
----------------------------------------------------------- */

function SelfView({
    camOn,
    micOn,
    blurOn,
    blocked,
}: {
    camOn: boolean;
    micOn: boolean;
    blurOn: boolean;
    blocked: boolean;
}) {
    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 9",
                borderRadius: 16,
                overflow: "hidden",
                background: "#202124",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10)",
            }}
        >
            {camOn ? <FauxCameraFeed blurOn={blurOn} /> : <CameraOffPlaceholder />}

            {/* Top-left: device label */}
            <div
                style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    padding: "4px 10px",
                    borderRadius: 9999,
                    background: "rgba(0,0,0,0.55)",
                    backdropFilter: "blur(6px)",
                    color: "rgba(255,255,255,0.85)",
                    fontSize: 11.5,
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                }}
            >
                <span
                    style={{
                        width: 6,
                        height: 6,
                        borderRadius: 9999,
                        background: blocked ? "#ea4335" : "#10b981",
                        boxShadow: blocked
                            ? "0 0 0 3px rgba(234,67,53,0.30)"
                            : "0 0 0 3px rgba(16,185,129,0.30)",
                    }}
                />
                {blocked ? "No camera" : "FaceTime HD"}
            </div>

            {/* Top-right: mic-level meter */}
            {!blocked && (
                <div
                    style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 10px",
                        borderRadius: 9999,
                        background: "rgba(0,0,0,0.55)",
                        backdropFilter: "blur(6px)",
                    }}
                >
                    {micOn ? (
                        <Mic size={13} color="rgba(255,255,255,0.85)" />
                    ) : (
                        <MicOff size={13} color="rgba(255,255,255,0.85)" />
                    )}
                    <MicLevelMeter active={micOn} />
                </div>
            )}

            {/* Bottom-left: name chip */}
            <div
                style={{
                    position: "absolute",
                    bottom: 12,
                    left: 12,
                    padding: "6px 12px",
                    borderRadius: 9999,
                    background: "rgba(0,0,0,0.55)",
                    backdropFilter: "blur(6px)",
                    color: "rgba(255,255,255,0.92)",
                    fontSize: 13,
                    fontWeight: 500,
                }}
            >
                You · Amelia Chen
            </div>

            {/* Bottom-right: status badges */}
            <div
                style={{
                    position: "absolute",
                    bottom: 12,
                    right: 12,
                    display: "flex",
                    gap: 6,
                }}
            >
                {!micOn && !blocked && (
                    <span
                        style={{
                            padding: "6px 10px",
                            borderRadius: 9999,
                            background: "rgba(234,67,53,0.20)",
                            border: "1px solid rgba(234,67,53,0.40)",
                            color: "#fca5a5",
                            fontSize: 11.5,
                            fontWeight: 500,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                        }}
                    >
                        <MicOff size={12} /> Mic off
                    </span>
                )}
                {blurOn && camOn && (
                    <span
                        style={{
                            padding: "6px 10px",
                            borderRadius: 9999,
                            background: "rgba(0,0,0,0.55)",
                            backdropFilter: "blur(6px)",
                            color: "rgba(255,255,255,0.85)",
                            fontSize: 11.5,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                        }}
                    >
                        <Aperture size={12} /> Blur
                    </span>
                )}
            </div>

            {/* Permissions banner overlay */}
            {blocked && (
                <>
                    <div
                        aria-hidden
                        style={{
                            position: "absolute",
                            inset: 0,
                            background:
                                "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.65) 100%)",
                            pointerEvents: "none",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            bottom: 24,
                            left: 16,
                            right: 16,
                            background: "rgba(234,67,53,0.16)",
                            backdropFilter: "blur(8px)",
                            border: "1px solid rgba(234,67,53,0.40)",
                            borderRadius: 12,
                            padding: "12px 14px",
                            color: "#fff",
                            fontSize: 13,
                            lineHeight: 1.45,
                            display: "flex",
                            gap: 12,
                            alignItems: "center",
                        }}
                    >
                        <CameraOff size={18} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <strong style={{ fontWeight: 600 }}>Camera &amp; mic blocked.</strong>{" "}
                            One Planner can&apos;t access them — your browser hasn&apos;t been granted
                            permission.
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function FauxCameraFeed({ blurOn }: { blurOn: boolean }) {
    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
                background:
                    "radial-gradient(circle at 50% 38%, #4a5568 0%, #2d3748 35%, #1a202c 65%, #0d1117 100%)",
                filter: blurOn ? "blur(14px)" : "none",
                transform: blurOn ? "scale(1.05)" : "none",
                transition: "filter 0.3s, transform 0.3s",
            }}
        >
            <svg
                viewBox="0 0 320 180"
                preserveAspectRatio="xMidYMid slice"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            >
                <defs>
                    <radialGradient id="op-prev-halo" cx="50%" cy="42%" r="40%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </radialGradient>
                    <linearGradient id="op-prev-silh" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0d1117" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#0d1117" stopOpacity="1" />
                    </linearGradient>
                </defs>
                <rect x="0" y="0" width="320" height="180" fill="url(#op-prev-halo)" />
                <ellipse cx="160" cy="86" rx="26" ry="32" fill="url(#op-prev-silh)" />
                <path
                    d="M 80 200 C 80 150, 110 130, 160 130 C 210 130, 240 150, 240 200 Z"
                    fill="url(#op-prev-silh)"
                />
            </svg>
        </div>
    );
}

function CameraOffPlaceholder() {
    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
                background: "#202124",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 14,
            }}
        >
            <div
                style={{
                    width: 96,
                    height: 96,
                    borderRadius: 9999,
                    background: "var(--avatar-gradient)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                    fontSize: 36,
                    letterSpacing: "-0.02em",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.50)",
                }}
            >
                AC
            </div>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.55)", fontSize: 13 }}>
                Camera is off
            </p>
        </div>
    );
}

/* -----------------------------------------------------------
   Mic-level meter — animated bars while mic is on.
   setInterval is an external subscription, setState lives in
   the timer callback. Lint-clean.
----------------------------------------------------------- */

function MicLevelMeter({ active }: { active: boolean }) {
    const [levels, setLevels] = useState<number[]>([0.3, 0.5, 0.2, 0.6]);
    useEffect(() => {
        if (!active) return;
        const id = window.setInterval(() => {
            setLevels(Array.from({ length: 4 }, () => 0.15 + Math.random() * 0.85));
        }, 220);
        return () => window.clearInterval(id);
    }, [active]);
    const shown = active ? levels : [0.05, 0.05, 0.05, 0.05];
    return (
        <div style={{ display: "flex", gap: 2, alignItems: "end", height: 14 }}>
            {shown.map((v, i) => (
                <span
                    key={i}
                    style={{
                        width: 3,
                        height: `${Math.max(0.12, v) * 100}%`,
                        background: active ? "#10b981" : "rgba(255,255,255,0.30)",
                        borderRadius: 1,
                        transition: "height 0.18s",
                    }}
                />
            ))}
        </div>
    );
}

/* -----------------------------------------------------------
   Control strip — mic / cam / blur
----------------------------------------------------------- */

function ControlStrip({
    camOn,
    setCamOn,
    micOn,
    setMicOn,
    blurOn,
    setBlurOn,
    blocked,
}: {
    camOn: boolean;
    setCamOn: (fn: (prev: boolean) => boolean) => void;
    micOn: boolean;
    setMicOn: (fn: (prev: boolean) => boolean) => void;
    blurOn: boolean;
    setBlurOn: (fn: (prev: boolean) => boolean) => void;
    blocked: boolean;
}) {
    return (
        <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
            <ControlPill
                active={micOn}
                onClick={() => !blocked && setMicOn((v) => !v)}
                icon={micOn ? Mic : MicOff}
                label={micOn ? "Mute" : "Unmute"}
                danger={!micOn}
                disabled={blocked}
            />
            <ControlPill
                active={camOn}
                onClick={() => !blocked && setCamOn((v) => !v)}
                icon={camOn ? Video : VideoOff}
                label={camOn ? "Turn off camera" : "Turn on camera"}
                danger={!camOn}
                disabled={blocked}
            />
            <ControlPill
                active={blurOn}
                onClick={() => !blocked && setBlurOn((v) => !v)}
                icon={Aperture}
                label="Blur background"
                disabled={blocked || !camOn}
            />
        </div>
    );
}

function ControlPill({
    icon: Icon,
    label,
    active,
    danger,
    disabled,
    onClick,
}: {
    icon: LucideIcon;
    label: string;
    active?: boolean;
    danger?: boolean;
    disabled?: boolean;
    onClick: () => void;
}) {
    const [hover, setHover] = useState(false);
    const bg = danger
        ? hover && !disabled
            ? "#d93025"
            : "var(--color-danger)"
        : active
            ? hover && !disabled
                ? "#5F6368"
                : "#3C4043"
            : hover && !disabled
                ? "var(--surface-2)"
                : "var(--surface)";
    const color = danger ? "#fff" : active ? "#fff" : "var(--fg-1)";
    const border = danger || active ? "1px solid transparent" : "1px solid var(--color-border-strong)";
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            disabled={disabled}
            title={label}
            aria-label={label}
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: 9999,
                background: bg,
                color,
                border,
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.45 : 1,
                transition: "all 0.15s",
                boxShadow: danger ? "0 4px 14px rgba(234,67,53,0.35)" : "none",
                fontFamily: "inherit",
            }}
        >
            <Icon size={20} />
        </button>
    );
}

/* -----------------------------------------------------------
   Device row
----------------------------------------------------------- */

function DeviceRow({ blocked }: { blocked: boolean }) {
    return (
        <div
            style={{
                display: "grid",
                gap: 10,
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            }}
        >
            <DeviceSelect
                icon={Mic}
                label="MacBook Pro Microphone"
                sub="Microphone"
                disabled={blocked}
            />
            <DeviceSelect icon={Video} label="FaceTime HD Camera" sub="Camera" disabled={blocked} />
            <DeviceSelect icon={Volume2} label="MacBook Pro Speakers" sub="Speakers" disabled={blocked} />
        </div>
    );
}

function DeviceSelect({
    icon: Icon,
    label,
    sub,
    disabled,
}: {
    icon: LucideIcon;
    label: string;
    sub: string;
    disabled: boolean;
}) {
    const [hover, setHover] = useState(false);
    return (
        <button
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            disabled={disabled}
            style={{
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid var(--color-border)",
                background: hover && !disabled ? "var(--surface-2)" : "var(--surface)",
                color: "var(--fg-1)",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.45 : 1,
                fontFamily: "inherit",
                transition: "all 0.15s",
                minWidth: 0,
            }}
        >
            <Icon size={16} color="var(--fg-3)" />
            <div style={{ flex: 1, minWidth: 0 }}>
                <p
                    style={{
                        margin: 0,
                        fontSize: 11,
                        color: "var(--fg-3)",
                        fontWeight: 500,
                        letterSpacing: "0.02em",
                        textTransform: "uppercase",
                    }}
                >
                    {sub}
                </p>
                <p
                    style={{
                        margin: "2px 0 0",
                        fontSize: 13,
                        fontWeight: 500,
                        color: "var(--fg-1)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {label}
                </p>
            </div>
            <ChevronDown size={14} color="var(--fg-3)" />
        </button>
    );
}

/* -----------------------------------------------------------
   Join panel
----------------------------------------------------------- */

function JoinPanel({
    blocked,
    waiting,
    roomId,
    onJoin,
}: {
    blocked: boolean;
    waiting: boolean;
    roomId: string;
    onJoin: () => void;
}) {
    return (
        <div
            style={{
                padding: "28px 28px 26px",
                borderRadius: 18,
                background: "var(--surface)",
                border: "1px solid var(--color-border)",
                boxShadow: "var(--shadow-sm)",
            }}
        >
            <p
                style={{
                    margin: 0,
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--color-primary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.10em",
                }}
            >
                1:1 coaching · 60 min
            </p>
            <h1
                style={{
                    margin: "8px 0 4px",
                    fontSize: 26,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                }}
            >
                Ready to join?
            </h1>
            <p style={{ margin: 0, color: "var(--fg-3)", fontSize: 14, lineHeight: 1.5 }}>
                Marcus Park · IC vs management fork
            </p>

            <PresencePanel waiting={waiting} />

            <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 10 }}>
                <FButton
                    onClick={onJoin}
                    fullWidth
                    leadingIcon={waiting ? Hourglass : Video}
                    disabled={blocked || waiting}
                >
                    {waiting ? "Asking to join…" : "Join now"}
                </FButton>
                {!waiting && !blocked && (
                    <FButton variant="secondary" fullWidth leadingIcon={Monitor}>
                        Present without joining
                    </FButton>
                )}
            </div>

            <div
                style={{
                    marginTop: 18,
                    paddingTop: 16,
                    borderTop: "1px solid var(--color-border)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: 12,
                    color: "var(--fg-3)",
                    fontVariantNumeric: "tabular-nums",
                }}
            >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <Lock size={12} /> End-to-end encrypted
                </span>
                <span>{roomId}</span>
            </div>
        </div>
    );
}

function PresencePanel({ waiting }: { waiting: boolean }) {
    if (waiting) {
        return (
            <div
                style={{
                    marginTop: 18,
                    padding: "14px 16px",
                    borderRadius: 12,
                    background: "rgba(245,158,11,0.12)",
                    border: "1px solid rgba(245,158,11,0.35)",
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        width: 28,
                        height: 28,
                        borderRadius: 9999,
                        background: "rgba(245,158,11,0.25)",
                        color: "#b45309",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <Hourglass size={14} />
                </div>
                <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: "var(--fg-1)" }}>
                        Waiting for Amelia to let you in
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "var(--fg-2)" }}>
                        You&apos;ll join automatically once the host admits you.
                    </p>
                </div>
            </div>
        );
    }
    return (
        <div
            style={{
                marginTop: 18,
                padding: "14px 16px",
                borderRadius: 12,
                background: "var(--surface-2)",
                border: "1px solid var(--color-border)",
                display: "flex",
                gap: 12,
                alignItems: "center",
            }}
        >
            <div style={{ display: "flex" }}>
                <Avatar name="Marcus Park" size={28} />
                <span style={{ marginLeft: -8 }}>
                    <Avatar name="Amelia Chen" size={28} />
                </span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: "var(--fg-1)" }}>
                    Marcus is here already
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "var(--fg-3)" }}>
                    Joined 2 minutes ago · waiting for you
                </p>
            </div>
            <Chip tone="success" size="sm" icon={Circle}>
                Live
            </Chip>
        </div>
    );
}

/* -----------------------------------------------------------
   Other ways to join + permissions help
----------------------------------------------------------- */

function OtherWaysToJoin({ roomId }: { roomId: string }) {
    return (
        <div
            style={{
                padding: 18,
                borderRadius: 14,
                background: "var(--surface-2)",
                border: "1px solid var(--color-border)",
            }}
        >
            <p
                style={{
                    margin: "0 0 10px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--fg-3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                }}
            >
                Other ways to join
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <JoinOption icon={Phone} label="Join by phone" sub="+1 (415) 555-0142 · PIN 28194" />
                <JoinOption
                    icon={LinkIcon}
                    label="Copy meeting link"
                    sub={`amelia.oneplanner.app/room/${roomId}`}
                />
                <JoinOption icon={Captions} label="Turn on captions before joining" />
            </div>
        </div>
    );
}

function JoinOption({
    icon: Icon,
    label,
    sub,
}: {
    icon: LucideIcon;
    label: string;
    sub?: string;
}) {
    const [hover, setHover] = useState(false);
    return (
        <button
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                border: 0,
                background: hover ? "var(--surface)" : "transparent",
                color: "var(--fg-1)",
                borderRadius: 10,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
                fontFamily: "inherit",
            }}
        >
            <div
                style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "var(--color-primary-soft)",
                    color: "var(--color-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                <Icon size={14} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13.5, fontWeight: 500 }}>{label}</p>
                {sub && (
                    <p
                        style={{
                            margin: "2px 0 0",
                            fontSize: 12,
                            color: "var(--fg-3)",
                            fontFamily:
                                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {sub}
                    </p>
                )}
            </div>
        </button>
    );
}

function PermissionsHelp() {
    return (
        <div
            style={{
                padding: 18,
                borderRadius: 14,
                background: "var(--color-danger-soft)",
                border: "1px solid rgba(234,67,53,0.30)",
            }}
        >
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: 9999,
                        background: "rgba(234,67,53,0.18)",
                        color: "var(--color-danger)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <Lock size={14} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--fg-1)" }}>
                        Allow camera &amp; mic to join
                    </p>
                    <p style={{ margin: "4px 0 12px", fontSize: 13, color: "var(--fg-2)", lineHeight: 1.5 }}>
                        Click the camera icon in your browser&apos;s address bar and choose{" "}
                        <strong>Allow</strong>, then come back here.
                    </p>
                    <div style={{ display: "flex", gap: 8 }}>
                        <FButton compact leadingIcon={RefreshCw}>
                            Try again
                        </FButton>
                        <FButton compact variant="secondary" leadingIcon={CircleHelp}>
                            Help
                        </FButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
