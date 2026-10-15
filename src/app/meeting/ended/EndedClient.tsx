"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import BrandLogo from "@/components/ui/BrandLogo";
import {
    PhoneOff,
    FileText,
    CalendarPlus,
    CirclePlay,
    Check,
    Bell,
    Star,
    type LucideIcon,
} from "lucide-react";
import { Avatar, Card, FButton, ThemeToggle } from "@/components/flows/Primitives";

export default function EndedClient() {
    const router = useRouter();
    const params = useSearchParams();
    const isGuest = params.get("role") === "guest";

    const onReturn = () => router.push(isGuest ? "/book" : "/dashboard");
    const onRebook = () => router.push("/book");

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
            <header
                style={{
                    padding: "14px 24px",
                    borderBottom: "1px solid var(--color-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Link href="/" style={{ display: "inline-flex" }}>
                    <BrandLogo width={70} priority />
                </Link>
                <ThemeToggle />
            </header>

            <div
                style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "40px 24px",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: 760,
                        display: "grid",
                        gap: 20,
                        gridTemplateColumns: "1fr",
                    }}
                    className="op-fade-up"
                >
                    {/* Hero card */}
                    <Card padding={32}>
                        <div style={{ display: "flex", gap: 22, flexWrap: "wrap", alignItems: "center" }}>
                            <div
                                style={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: 9999,
                                    background: "rgba(16,185,129,0.14)",
                                    color: "#059669",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <PhoneOff size={26} />
                            </div>
                            <div style={{ flex: 1, minWidth: 220 }}>
                                <h1
                                    style={{
                                        margin: "0 0 6px",
                                        fontSize: 26,
                                        fontWeight: 600,
                                        letterSpacing: "-0.02em",
                                    }}
                                >
                                    {isGuest ? "Thanks for joining" : "Session ended"}
                                </h1>
                                <p style={{ margin: 0, color: "var(--fg-2)", fontSize: 14.5 }}>
                                    {isGuest
                                        ? "Amelia will follow up with notes within 24 hours."
                                        : "We've saved your notes and the recording to Marcus Park's profile."}
                                </p>
                            </div>
                        </div>

                        <div
                            style={{
                                marginTop: 24,
                                display: "grid",
                                gap: 14,
                                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                            }}
                        >
                            <Metric label="Duration" value="58:04" />
                            <Metric label="Participants" value="2" />
                            <Metric label="Recording" value="1.2 GB" />
                            <Metric label={isGuest ? "Action items" : "Notes"} value={isGuest ? "2" : "3"} />
                        </div>
                    </Card>

                    {isGuest ? (
                        <GuestNextActions onRebook={onRebook} />
                    ) : (
                        <HostNextActions onReturn={onReturn} />
                    )}

                    <div style={{ textAlign: "center", marginTop: 4 }}>
                        <button
                            onClick={onReturn}
                            style={{
                                background: "transparent",
                                border: 0,
                                cursor: "pointer",
                                fontSize: 13,
                                color: "var(--fg-3)",
                                fontFamily: "inherit",
                                textDecoration: "underline",
                            }}
                        >
                            {isGuest ? "Back to Amelia's page" : "Back to dashboard"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Metric({ label, value }: { label: string; value: string }) {
    return (
        <div
            style={{
                padding: 14,
                borderRadius: 12,
                background: "var(--surface-2)",
                border: "1px solid var(--color-border)",
            }}
        >
            <p
                style={{
                    margin: 0,
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--fg-3)",
                }}
            >
                {label}
            </p>
            <p
                style={{
                    margin: "6px 0 0",
                    fontSize: 22,
                    fontWeight: 600,
                    color: "var(--fg-1)",
                    letterSpacing: "-0.01em",
                    fontVariantNumeric: "tabular-nums",
                }}
            >
                {value}
            </p>
        </div>
    );
}

function HostNextActions({ onReturn }: { onReturn: () => void }) {
    return (
        <Card padding={24}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                <Avatar name="Marcus Park" size={44} />
                <div>
                    <p style={{ margin: 0, fontSize: 14.5, fontWeight: 600 }}>Marcus Park</p>
                    <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--fg-3)" }}>
                        1:1 coaching · 60 min
                    </p>
                </div>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
                <ActionRow
                    icon={FileText}
                    title="Write session note"
                    sub="3 takeaways jotted during the call — clean them up while it's fresh"
                    actionLabel="Open notes"
                />
                <ActionRow
                    icon={CalendarPlus}
                    title="Schedule the next session"
                    sub="Marcus suggested 'in 2 weeks, same time'"
                    actionLabel="Schedule"
                />
                <ActionRow
                    icon={CirclePlay}
                    title="Watch the recording"
                    sub="Available for 90 days · 58 min · ready in ~3 min"
                    actionLabel="Watch"
                    muted
                />
            </div>
            <div
                style={{
                    marginTop: 22,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 8,
                    flexWrap: "wrap",
                }}
            >
                <FButton variant="secondary" onClick={onReturn}>
                    Back to dashboard
                </FButton>
                <FButton leadingIcon={Check}>Mark done</FButton>
            </div>
        </Card>
    );
}

function GuestNextActions({ onRebook }: { onRebook: () => void }) {
    return (
        <Card padding={24}>
            <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 600 }}>What&apos;s next</h3>
            <div style={{ display: "grid", gap: 12 }}>
                <ActionRow
                    icon={Bell}
                    title="You'll get notes by tomorrow"
                    sub="We email a summary plus any action items we agreed on."
                />
                <ActionRow
                    icon={CalendarPlus}
                    title="Book your next session"
                    sub="Most clients book the next slot before they close this tab."
                    actionLabel="Book again"
                    onAction={onRebook}
                />
                <ActionRow
                    icon={Star}
                    title="Rate this session"
                    sub="60 seconds of feedback helps a lot."
                    actionLabel="Leave feedback"
                />
            </div>
        </Card>
    );
}

function ActionRow({
    icon: Icon,
    title,
    sub,
    actionLabel,
    onAction,
    muted,
}: {
    icon: LucideIcon;
    title: string;
    sub: string;
    actionLabel?: string;
    onAction?: () => void;
    muted?: boolean;
}) {
    return (
        <div
            style={{
                display: "flex",
                gap: 14,
                alignItems: "center",
                padding: 14,
                borderRadius: 12,
                border: "1px solid var(--color-border)",
                background: muted ? "var(--surface-2)" : "var(--surface)",
                flexWrap: "wrap",
            }}
        >
            <div
                style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "var(--color-primary-soft)",
                    color: "var(--color-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                <Icon size={16} />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{title}</p>
                <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--fg-3)", lineHeight: 1.45 }}>{sub}</p>
            </div>
            {actionLabel && (
                <FButton variant="secondary" compact onClick={onAction}>
                    {actionLabel}
                </FButton>
            )}
        </div>
    );
}
