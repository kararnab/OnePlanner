"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    X,
    AlertCircle,
    MessageCircle,
    Compass,
    FileSearch,
    Calendar as CalendarIcon,
    Bell,
    type LucideIcon,
} from "lucide-react";
import { Avatar, FButton, FloatingInput } from "@/components/flows/Primitives";

type Attendee = { name: string; email: string };

const ATTENDEES_LIB: Attendee[] = [
    { name: "Marcus Park", email: "marcus.park@northpoint.io" },
    { name: "Priya Anand", email: "priya@helio.co" },
    { name: "Lena Park", email: "lena@goodtree.dev" },
    { name: "Dominic Hughes", email: "dom@huerto.com" },
    { name: "Samson Lee", email: "sam@studio-tactile.com" },
];

const SESSION_TYPES: { id: string; label: string; icon: LucideIcon }[] = [
    { id: "intro", label: "Intro", icon: MessageCircle },
    { id: "1on1", label: "1:1 coaching", icon: Compass },
    { id: "review", label: "Portfolio review", icon: FileSearch },
    { id: "other", label: "Other", icon: CalendarIcon },
];

const RECURRENCE = [
    { id: "none", label: "Doesn't repeat" },
    { id: "weekly", label: "Every week" },
    { id: "biweekly", label: "Every 2 weeks" },
    { id: "monthly", label: "Monthly" },
];

export default function ScheduleClient() {
    const router = useRouter();
    const params = useSearchParams();
    const showConflict = params.get("state") === "conflict";

    const [title, setTitle] = useState("");
    const [type, setType] = useState("1on1");
    const [date, setDate] = useState("2026-05-21");
    const [start, setStart] = useState("14:00");
    const [duration, setDuration] = useState(60);
    const [attendees, setAttendees] = useState<Attendee[]>([ATTENDEES_LIB[0]]);
    const [query, setQuery] = useState("");
    const [notes, setNotes] = useState("");
    const [recurrence, setRecurrence] = useState("none");
    const [saving, setSaving] = useState(false);

    const filtered = query
        ? ATTENDEES_LIB.filter(
              (a) =>
                  a.name.toLowerCase().includes(query.toLowerCase()) ||
                  a.email.toLowerCase().includes(query.toLowerCase()),
          ).filter((a) => !attendees.find((x) => x.email === a.email))
        : [];

    const endLabel = useMemo(() => {
        const [h, m] = start.split(":").map(Number);
        const end = new Date(2026, 4, 21, h, m + duration);
        return end.toTimeString().slice(0, 5);
    }, [start, duration]);

    const close = () => router.push("/dashboard");

    const submit = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            router.push("/dashboard");
        }, 700);
    };

    return (
        <div style={{ minHeight: "100vh", background: "var(--background)", color: "var(--fg-1)" }}>
            {/* Dimmed dashboard backdrop */}
            <DashboardBackdrop />

            {/* Modal layer */}
            <div
                onClick={close}
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.55)",
                    backdropFilter: "blur(2px)",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    padding: "60px 24px 24px",
                    zIndex: 100,
                    overflowY: "auto",
                }}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="op-fade-up"
                    style={{
                        width: "100%",
                        maxWidth: 640,
                        background: "var(--surface)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 20,
                        boxShadow: "0 20px 60px rgba(0,0,0,0.30)",
                        overflow: "hidden",
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            padding: "20px 24px",
                            borderBottom: "1px solid var(--color-border)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>
                            Schedule a meeting
                        </h1>
                        <button
                            onClick={close}
                            aria-label="Close"
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: 8,
                                border: 0,
                                background: "transparent",
                                color: "var(--fg-3)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {showConflict && (
                        <div
                            style={{
                                margin: 16,
                                padding: "10px 14px",
                                border: "1px solid rgba(234,67,53,0.30)",
                                background: "var(--color-danger-soft)",
                                color: "var(--color-danger)",
                                borderRadius: 10,
                                fontSize: 13,
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                            }}
                        >
                            <AlertCircle size={16} />
                            <div style={{ flex: 1 }}>
                                <strong style={{ fontWeight: 600 }}>Marcus is double-booked.</strong> He already has a
                                session at 14:00 on 21 May. Pick a different time.
                            </div>
                        </div>
                    )}

                    {/* Body */}
                    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
                        <FloatingInput label="Title" value={title} onChange={setTitle} />

                        <div>
                            <Label>Session type</Label>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {SESSION_TYPES.map((t) => {
                                    const sel = type === t.id;
                                    const Icon = t.icon;
                                    return (
                                        <button
                                            key={t.id}
                                            onClick={() => setType(t.id)}
                                            style={{
                                                padding: "8px 12px",
                                                borderRadius: 9999,
                                                border: `1px solid ${sel ? "var(--color-primary)" : "var(--color-border)"}`,
                                                background: sel ? "var(--color-primary-soft)" : "var(--surface)",
                                                color: sel ? "var(--color-primary)" : "var(--fg-1)",
                                                cursor: "pointer",
                                                fontSize: 13,
                                                fontWeight: 500,
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: 6,
                                                fontFamily: "inherit",
                                            }}
                                        >
                                            <Icon size={13} />
                                            {t.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div
                            style={{
                                display: "grid",
                                gap: 12,
                                gridTemplateColumns: "1.2fr 1fr 1fr",
                            }}
                            className="op-schedule-row"
                        >
                            <FieldGroup label="Date">
                                <NativeInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                            </FieldGroup>
                            <FieldGroup label="Starts">
                                <NativeInput type="time" value={start} onChange={(e) => setStart(e.target.value)} />
                            </FieldGroup>
                            <FieldGroup label="Duration">
                                <NativeSelect value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
                                    <option value={30}>30 min</option>
                                    <option value={45}>45 min</option>
                                    <option value={60}>60 min</option>
                                    <option value={90}>90 min</option>
                                </NativeSelect>
                            </FieldGroup>
                        </div>

                        <p
                            style={{
                                margin: "-6px 0 0",
                                fontSize: 12,
                                color: "var(--fg-3)",
                                fontVariantNumeric: "tabular-nums",
                            }}
                        >
                            {start} – {endLabel} PT · {fmtDate(date)}
                        </p>

                        {/* Attendees */}
                        <div>
                            <Label>Attendees</Label>
                            <div
                                style={{
                                    border: "1px solid var(--color-border-strong)",
                                    borderRadius: 12,
                                    padding: 8,
                                    background: "var(--surface)",
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 6,
                                    alignItems: "center",
                                }}
                            >
                                {attendees.map((a) => (
                                    <span
                                        key={a.email}
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 8,
                                            background: "var(--color-primary-soft)",
                                            color: "var(--color-primary)",
                                            padding: "4px 10px 4px 4px",
                                            borderRadius: 9999,
                                            fontSize: 13,
                                        }}
                                    >
                                        <Avatar name={a.name} size={20} />
                                        {a.name}
                                        <button
                                            onClick={() =>
                                                setAttendees(attendees.filter((x) => x.email !== a.email))
                                            }
                                            aria-label={`Remove ${a.name}`}
                                            style={{
                                                background: "transparent",
                                                border: 0,
                                                color: "inherit",
                                                cursor: "pointer",
                                                padding: 0,
                                                display: "inline-flex",
                                            }}
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder={attendees.length ? "Add another…" : "Search clients or email…"}
                                    style={{
                                        flex: 1,
                                        minWidth: 160,
                                        border: 0,
                                        background: "transparent",
                                        outline: "none",
                                        fontFamily: "inherit",
                                        fontSize: 13,
                                        color: "var(--fg-1)",
                                        padding: "4px 6px",
                                    }}
                                />
                            </div>

                            {filtered.length > 0 && (
                                <div
                                    style={{
                                        marginTop: 6,
                                        border: "1px solid var(--color-border)",
                                        borderRadius: 12,
                                        background: "var(--surface)",
                                        boxShadow: "var(--shadow-sm)",
                                        maxHeight: 180,
                                        overflowY: "auto",
                                    }}
                                >
                                    {filtered.map((p) => (
                                        <div
                                            key={p.email}
                                            onClick={() => {
                                                setAttendees([...attendees, p]);
                                                setQuery("");
                                            }}
                                            onMouseEnter={(e) =>
                                                (e.currentTarget.style.background = "var(--surface-2)")
                                            }
                                            onMouseLeave={(e) =>
                                                (e.currentTarget.style.background = "transparent")
                                            }
                                            style={{
                                                padding: "8px 12px",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 10,
                                                cursor: "pointer",
                                                transition: "all 0.15s",
                                            }}
                                        >
                                            <Avatar name={p.name} size={28} />
                                            <div style={{ minWidth: 0 }}>
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        fontSize: 13.5,
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {p.name}
                                                </p>
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        fontSize: 12,
                                                        color: "var(--fg-3)",
                                                    }}
                                                >
                                                    {p.email}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <Label>Repeat</Label>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                {RECURRENCE.map((r) => {
                                    const sel = recurrence === r.id;
                                    return (
                                        <button
                                            key={r.id}
                                            onClick={() => setRecurrence(r.id)}
                                            style={{
                                                padding: "6px 12px",
                                                borderRadius: 8,
                                                border: `1px solid ${sel ? "var(--color-primary)" : "var(--color-border)"}`,
                                                background: sel ? "var(--color-primary-soft)" : "var(--surface)",
                                                color: sel ? "var(--color-primary)" : "var(--fg-2)",
                                                cursor: "pointer",
                                                fontSize: 12.5,
                                                fontWeight: 500,
                                                fontFamily: "inherit",
                                            }}
                                        >
                                            {r.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <Label>Agenda / notes (optional)</Label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="What do you want to cover?"
                                rows={3}
                                style={{
                                    width: "100%",
                                    padding: 12,
                                    borderRadius: 12,
                                    border: "1px solid var(--color-border-strong)",
                                    background: "var(--surface)",
                                    color: "var(--fg-1)",
                                    fontFamily: "inherit",
                                    fontSize: 14,
                                    outline: "none",
                                    resize: "vertical",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div
                        style={{
                            padding: "16px 24px",
                            borderTop: "1px solid var(--color-border)",
                            background: "var(--surface-2)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 12,
                            flexWrap: "wrap",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                fontSize: 12,
                                color: "var(--fg-3)",
                            }}
                        >
                            <Bell size={13} /> Attendees get an email + calendar invite
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                            <FButton variant="secondary" compact onClick={close}>
                                Cancel
                            </FButton>
                            <FButton
                                compact
                                onClick={submit}
                                loading={saving}
                                disabled={!title || attendees.length === 0}
                            >
                                {saving ? "Saving…" : "Schedule"}
                            </FButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Label({ children }: { children: React.ReactNode }) {
    return (
        <p
            style={{
                margin: "0 0 8px",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--fg-2)",
                letterSpacing: "0.02em",
            }}
        >
            {children}
        </p>
    );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <Label>{label}</Label>
            {children}
        </div>
    );
}

function NativeInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid var(--color-border-strong)",
                background: "var(--surface)",
                color: "var(--fg-1)",
                fontFamily: "inherit",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
                colorScheme: "light dark",
            }}
        />
    );
}

function NativeSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select
            {...props}
            style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid var(--color-border-strong)",
                background: "var(--surface)",
                color: "var(--fg-1)",
                fontFamily: "inherit",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
                appearance: "none",
                backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 10px center",
                paddingRight: 30,
            }}
        >
            {props.children}
        </select>
    );
}

function fmtDate(iso: string) {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

function DashboardBackdrop() {
    return (
        <div
            aria-hidden
            style={{
                position: "absolute",
                inset: 0,
                background: "var(--background)",
                overflow: "hidden",
                pointerEvents: "none",
            }}
        >
            <header
                style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid var(--color-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "var(--surface)",
                }}
            >
                <span style={{ fontWeight: 600, color: "var(--fg-1)", fontSize: 15 }}>One Planner</span>
                <span style={{ color: "var(--fg-3)", fontSize: 13 }}>amelia@chen.co</span>
            </header>
            <div style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
                <p
                    style={{
                        fontSize: 24,
                        fontWeight: 600,
                        margin: "0 0 24px",
                        letterSpacing: "-0.01em",
                    }}
                >
                    Good morning, Amelia!
                </p>
                <div
                    style={{
                        display: "grid",
                        gap: 20,
                        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    }}
                >
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            style={{
                                background: "var(--surface)",
                                color: "var(--fg-1)",
                                border: "1px solid var(--color-border)",
                                borderRadius: 16,
                                padding: 20,
                                boxShadow: "var(--shadow-sm)",
                            }}
                        >
                            <div style={{ height: 14, width: "60%", background: "var(--color-border)", borderRadius: 4 }} />
                            <div
                                style={{
                                    height: 10,
                                    width: "85%",
                                    background: "var(--color-border)",
                                    borderRadius: 4,
                                    marginTop: 12,
                                    opacity: 0.6,
                                }}
                            />
                            <div
                                style={{
                                    height: 10,
                                    width: "70%",
                                    background: "var(--color-border)",
                                    borderRadius: 4,
                                    marginTop: 8,
                                    opacity: 0.6,
                                }}
                            />
                            <div
                                style={{
                                    height: 10,
                                    width: "50%",
                                    background: "var(--color-border)",
                                    borderRadius: 4,
                                    marginTop: 8,
                                    opacity: 0.6,
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
