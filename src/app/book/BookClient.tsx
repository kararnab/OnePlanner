"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import BrandLogo from "@/components/ui/BrandLogo";
import {
    Clock,
    Video,
    Globe,
    CreditCard,
    CalendarOff,
    Check,
    User,
    Calendar as CalendarIcon,
    CalendarPlus,
    X,
    ArrowLeft,
    House,
    type LucideIcon,
} from "lucide-react";
import { Avatar, Card, FButton, FloatingInput, ThemeToggle } from "@/components/flows/Primitives";
import ErrorStateUI from "@/components/ui/ErrorStateUI";
import { useApiGet } from "@/lib/hooks/useApiGet";
import {
    type BookingPageResponse,
    type BookingSessionType,
    type BookingDayCell,
} from "@/lib/api/api.types";

export default function BookClient() {
    const router = useRouter();
    const params = useSearchParams();
    const stateParam = params.get("state");
    const handle = params.get("handle") || "amelia";

    const apiState: "default" | "empty" | "404" =
        stateParam === "empty"
            ? "empty"
            : stateParam === "404"
                ? "404"
                : "default";
    const showConfirmedDirectly = stateParam === "confirmed";

    const { data: page, loading, error, errorStatus, retry } = useApiGet<BookingPageResponse>(
        `/booking/${encodeURIComponent(handle)}?state=${apiState}`,
    );

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", background: "var(--background)", color: "var(--fg-1)" }}>
                <PublicTopBar handle={handle} />
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px 80px" }}>
                    <Card padding={28}>
                        <div className="animate-pulse" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <div style={{ height: 72, width: 72, borderRadius: 9999, background: "var(--surface-2)" }} />
                            <div style={{ height: 22, width: "30%", background: "var(--surface-2)", borderRadius: 6 }} />
                            <div style={{ height: 12, width: "55%", background: "var(--surface-2)", borderRadius: 4 }} />
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    if (errorStatus === 404) {
        return <NotFoundView onReset={() => router.replace("/book")} />;
    }

    if (error || !page) {
        return (
            <div style={{ minHeight: "100vh", background: "var(--background)", color: "var(--fg-1)" }}>
                <PublicTopBar handle={handle} />
                <div style={{ maxWidth: 560, margin: "60px auto", padding: "0 24px" }}>
                    <ErrorStateUI message={error || "Couldn't load booking page."} onRefresh={retry} />
                </div>
            </div>
        );
    }

    return (
        <BookingFlow
            key={`${apiState}:${showConfirmedDirectly}`}
            page={page}
            initialStep={showConfirmedDirectly ? "confirmed" : "pick"}
        />
    );
}

function BookingFlow({
    page,
    initialStep,
}: {
    page: BookingPageResponse;
    initialStep: "pick" | "confirmed";
}) {
    const [step, setStep] = useState<"pick" | "confirmed">(initialStep);

    const days = useMemo<BookingDayCell[]>(() => page.days, [page]);
    const firstAvail = days.find((d) => d.available);

    const [sessionId, setSessionId] = useState(page.sessionTypes[1]?.id ?? page.sessionTypes[0]?.id ?? "");
    const [selectedIso, setSelectedIso] = useState<string>(firstAvail?.iso || days[0]?.iso || "");
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [notes, setNotes] = useState("");

    const session = page.sessionTypes.find((s) => s.id === sessionId) || page.sessionTypes[0];
    const selectedDay = days.find((d) => d.iso === selectedIso) ?? days[0];

    if (step === "confirmed") {
        return (
            <ConfirmedView
                handle={page.expert.handle}
                session={session}
                selectedDate={iso => new Date(iso + "T00:00:00")}
                selectedIso={selectedDay?.iso || ""}
                selectedTime={selectedTime || "14:00"}
                email={email || "alex@morgan.co"}
                onReset={() => setStep("pick")}
            />
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "var(--background)", color: "var(--fg-1)" }}>
            <PublicTopBar handle={page.expert.handle} />

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px 80px" }}>
                <div className="op-booking-grid">
                    <aside style={{ minWidth: 0 }}>
                        <Card padding={28} style={{ position: "sticky", top: 96 }}>
                            <Avatar name={page.expert.name} size={72} />
                            <h1
                                style={{
                                    margin: "16px 0 4px",
                                    fontSize: 22,
                                    fontWeight: 600,
                                    letterSpacing: "-0.01em",
                                    color: "var(--fg-1)",
                                }}
                            >
                                {page.expert.name}
                            </h1>
                            <p style={{ margin: 0, fontSize: 14, color: "var(--fg-3)" }}>{page.expert.tagline}</p>
                            <p
                                style={{
                                    margin: "16px 0 0",
                                    fontSize: 14,
                                    lineHeight: 1.55,
                                    color: "var(--fg-2)",
                                }}
                            >
                                {page.expert.bio}
                            </p>

                            <div
                                style={{
                                    marginTop: 20,
                                    paddingTop: 18,
                                    borderTop: "1px solid var(--color-border)",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 10,
                                }}
                            >
                                <InfoRow icon={Clock} label={`${session.duration} min`} />
                                <InfoRow icon={Video} label="Video call" />
                                <InfoRow icon={Globe} label={page.expert.timezone} />
                                <InfoRow icon={CreditCard} label={session.price} />
                            </div>
                        </Card>
                    </aside>

                    <section style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 24 }}>
                        <Card padding={24}>
                            <h2 style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 600 }}>
                                Choose a session type
                            </h2>
                            <div style={{ display: "grid", gap: 10 }}>
                                {page.sessionTypes.map((s) => (
                                    <SessionTypeRow
                                        key={s.id}
                                        session={s}
                                        selected={s.id === sessionId}
                                        onSelect={() => setSessionId(s.id)}
                                    />
                                ))}
                            </div>
                        </Card>

                        <Card padding={24}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "baseline",
                                }}
                            >
                                <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Pick a time</h2>
                                <span style={{ fontSize: 12, color: "var(--fg-3)" }}>Times shown in PT</span>
                            </div>

                            {page.fullyBooked ? (
                                <EmptyAvailability />
                            ) : (
                                <>
                                    <DateStrip
                                        days={days}
                                        selectedIso={selectedIso}
                                        onSelect={(iso) => {
                                            setSelectedIso(iso);
                                            setSelectedTime(null);
                                        }}
                                    />
                                    <TimeSlotGrid
                                        slots={page.slots}
                                        selected={selectedTime}
                                        onSelect={setSelectedTime}
                                        takenIndexes={page.takenIndexes}
                                    />
                                </>
                            )}
                        </Card>

                        {!page.fullyBooked && (
                            <Card padding={24}>
                                <h2 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600 }}>Your details</h2>
                                <div style={{ display: "grid", gap: 14 }}>
                                    <FloatingInput label="Full name" value={name} onChange={setName} />
                                    <FloatingInput label="Email" type="email" value={email} onChange={setEmail} />
                                    <NotesField value={notes} onChange={setNotes} />
                                </div>
                                <div
                                    style={{
                                        marginTop: 20,
                                        display: "flex",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <FButton
                                        onClick={() => selectedTime && setStep("confirmed")}
                                        disabled={!selectedTime || !name || !email}
                                    >
                                        Confirm booking
                                    </FButton>
                                </div>
                                {!selectedTime && (
                                    <p
                                        style={{
                                            marginTop: 8,
                                            fontSize: 12,
                                            color: "var(--fg-3)",
                                            textAlign: "right",
                                        }}
                                    >
                                        Pick a time slot first
                                    </p>
                                )}
                            </Card>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}

function PublicTopBar({ handle }: { handle: string }) {
    return (
        <header
            style={{
                borderBottom: "1px solid var(--color-border)",
                background: "var(--background)",
                position: "sticky",
                top: 0,
                zIndex: 50,
            }}
        >
            <div
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    padding: "14px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <BrandLogo width={28} priority />
                    <span
                        style={{
                            fontSize: 13,
                            color: "var(--fg-3)",
                            fontFamily:
                                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                        }}
                    >
                        {handle}.oneplanner.app
                    </span>
                </div>
                <ThemeToggle />
            </div>
        </header>
    );
}

function InfoRow({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, color: "var(--fg-2)" }}>
            <Icon size={16} color="var(--fg-3)" />
            {label}
        </div>
    );
}

function SessionTypeRow({
    session,
    selected,
    onSelect,
}: {
    session: BookingSessionType;
    selected: boolean;
    onSelect: () => void;
}) {
    return (
        <div
            onClick={onSelect}
            style={{
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
                padding: "14px 16px",
                borderRadius: 12,
                border: `1px solid ${selected ? "var(--color-primary)" : "var(--color-border)"}`,
                background: selected ? "var(--color-primary-soft)" : "var(--surface)",
                cursor: "pointer",
                transition: "all 0.15s",
            }}
        >
            <div
                style={{
                    marginTop: 2,
                    width: 18,
                    height: 18,
                    borderRadius: 9999,
                    border: `2px solid ${selected ? "var(--color-primary)" : "var(--color-border-strong)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                {selected && (
                    <span
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: 9999,
                            background: "var(--color-primary)",
                        }}
                    />
                )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        gap: 12,
                    }}
                >
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 14.5, color: "var(--fg-1)" }}>
                        {session.title}
                    </p>
                    <span
                        style={{
                            fontSize: 13,
                            color: "var(--fg-2)",
                            fontVariantNumeric: "tabular-nums",
                        }}
                    >
                        {session.duration} min · {session.price}
                    </span>
                </div>
                <p
                    style={{
                        margin: "4px 0 0",
                        fontSize: 13,
                        color: "var(--fg-3)",
                        lineHeight: 1.45,
                    }}
                >
                    {session.blurb}
                </p>
            </div>
        </div>
    );
}

function DateStrip({
    days,
    selectedIso,
    onSelect,
}: {
    days: BookingDayCell[];
    selectedIso: string;
    onSelect: (iso: string) => void;
}) {
    return (
        <div
            style={{
                marginTop: 16,
                display: "flex",
                gap: 8,
                overflowX: "auto",
                padding: "4px 2px 12px",
                scrollbarWidth: "thin",
            }}
        >
            {days.map((d) => {
                const date = new Date(d.iso + "T00:00:00");
                const isSel = d.iso === selectedIso;
                const dow = date.toLocaleString("en-US", { weekday: "short" });
                const day = date.getDate();
                const disabled = !d.available;
                return (
                    <button
                        key={d.iso}
                        onClick={() => !disabled && onSelect(d.iso)}
                        disabled={disabled}
                        style={{
                            flexShrink: 0,
                            width: 60,
                            padding: "10px 0",
                            borderRadius: 12,
                            border: `1px solid ${isSel ? "var(--color-primary)" : "var(--color-border)"}`,
                            background: isSel ? "var(--color-primary-soft)" : "var(--surface)",
                            color: disabled ? "var(--fg-4)" : "var(--fg-1)",
                            opacity: disabled ? 0.45 : 1,
                            cursor: disabled ? "not-allowed" : "pointer",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                            fontFamily: "inherit",
                            transition: "all 0.15s",
                        }}
                    >
                        <span
                            style={{
                                fontSize: 11,
                                fontWeight: 500,
                                color: "var(--fg-3)",
                                letterSpacing: "0.04em",
                                textTransform: "uppercase",
                            }}
                        >
                            {dow}
                        </span>
                        <span
                            style={{
                                fontSize: 18,
                                fontWeight: 600,
                                color: isSel ? "var(--color-primary)" : "var(--fg-1)",
                                fontVariantNumeric: "tabular-nums",
                            }}
                        >
                            {day}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

function TimeSlotGrid({
    slots,
    selected,
    onSelect,
    takenIndexes,
}: {
    slots: string[];
    selected: string | null;
    onSelect: (s: string) => void;
    takenIndexes: number[];
}) {
    return (
        <div
            style={{
                marginTop: 8,
                display: "grid",
                gap: 10,
                gridTemplateColumns: "repeat(auto-fill, minmax(98px, 1fr))",
            }}
        >
            {slots.map((t, i) => {
                const taken = takenIndexes.includes(i);
                const isSel = selected === t;
                return (
                    <button
                        key={t}
                        disabled={taken}
                        onClick={() => onSelect(t)}
                        style={{
                            padding: "11px 0",
                            borderRadius: 10,
                            border: `1px solid ${isSel ? "var(--color-primary)" : "var(--color-border)"}`,
                            background: isSel ? "var(--color-primary)" : "var(--surface)",
                            color: isSel
                                ? "var(--color-primary-foreground)"
                                : taken
                                    ? "var(--fg-4)"
                                    : "var(--fg-1)",
                            opacity: taken ? 0.5 : 1,
                            cursor: taken ? "not-allowed" : "pointer",
                            textDecoration: taken ? "line-through" : "none",
                            fontFamily: "inherit",
                            fontVariantNumeric: "tabular-nums",
                            fontWeight: 500,
                            fontSize: 14,
                            transition: "all 0.15s",
                        }}
                    >
                        {t}
                    </button>
                );
            })}
        </div>
    );
}

function NotesField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const [focused, setFocused] = useState(false);
    const isFloating = focused || value.length > 0;
    return (
        <div style={{ position: "relative" }}>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                rows={3}
                style={{
                    width: "100%",
                    padding: "22px 16px 12px",
                    borderRadius: 12,
                    border: `1px solid ${focused ? "var(--color-primary)" : "var(--color-border-strong)"}`,
                    background: "var(--surface)",
                    color: "var(--fg-1)",
                    fontFamily: "inherit",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                    resize: "vertical",
                    transition: "all 0.2s",
                    boxShadow: focused ? "0 0 0 4px var(--color-primary-ring)" : "none",
                }}
            />
            <label
                style={{
                    position: "absolute",
                    left: 16,
                    background: "var(--surface)",
                    padding: "0 4px",
                    pointerEvents: "none",
                    userSelect: "none",
                    transition: "all 0.2s",
                    color: isFloating ? "var(--color-primary)" : "var(--fg-3)",
                    fontSize: isFloating ? 11 : 14,
                    fontWeight: isFloating ? 500 : 400,
                    top: isFloating ? 0 : 16,
                    transform: isFloating ? "translateY(-50%)" : "none",
                }}
            >
                Anything I should know? (optional)
            </label>
        </div>
    );
}

function EmptyAvailability() {
    return (
        <div
            style={{
                marginTop: 24,
                padding: "44px 24px",
                textAlign: "center",
                border: "1px dashed var(--color-border-strong)",
                borderRadius: 12,
                background: "var(--surface-2)",
            }}
        >
            <div
                style={{
                    width: 44,
                    height: 44,
                    margin: "0 auto 12px",
                    borderRadius: 9999,
                    background: "var(--color-primary-soft)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-primary)",
                }}
            >
                <CalendarOff size={20} />
            </div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "var(--fg-1)" }}>
                Fully booked for the next two weeks
            </p>
            <p style={{ margin: "6px auto 18px", fontSize: 13, color: "var(--fg-3)", maxWidth: 360 }}>
                Amelia opens new slots every Sunday. Drop your email and I&apos;ll ping you when the next batch goes live.
            </p>
            <div
                style={{
                    display: "inline-flex",
                    gap: 8,
                    padding: 6,
                    paddingLeft: 14,
                    border: "1px solid var(--color-border)",
                    borderRadius: 9999,
                    background: "var(--surface)",
                    alignItems: "center",
                }}
            >
                <input
                    placeholder="you@work.com"
                    style={{
                        border: 0,
                        background: "transparent",
                        outline: "none",
                        fontFamily: "inherit",
                        fontSize: 13,
                        color: "var(--fg-1)",
                        width: 180,
                    }}
                />
                <FButton compact>Notify me</FButton>
            </div>
        </div>
    );
}

function ConfirmedView({
    handle,
    session,
    selectedDate,
    selectedIso,
    selectedTime,
    email,
    onReset,
}: {
    handle: string;
    session: BookingSessionType;
    selectedDate: (iso: string) => Date;
    selectedIso: string;
    selectedTime: string;
    email: string;
    onReset: () => void;
}) {
    const d = selectedIso ? selectedDate(selectedIso) : new Date();
    const dateLabel = d.toLocaleString("en-US", { weekday: "long", month: "long", day: "numeric" });
    return (
        <div style={{ minHeight: "100vh", background: "var(--background)", color: "var(--fg-1)" }}>
            <PublicTopBar handle={handle} />
            <div style={{ maxWidth: 560, margin: "0 auto", padding: "60px 24px 80px" }}>
                <Card padding={36}>
                    <div
                        style={{
                            width: 52,
                            height: 52,
                            borderRadius: 9999,
                            background: "rgba(16,185,129,0.14)",
                            color: "#059669",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 18,
                        }}
                    >
                        <Check size={26} />
                    </div>
                    <h1
                        style={{
                            margin: "0 0 8px",
                            fontSize: 26,
                            fontWeight: 600,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        You&apos;re booked in
                    </h1>
                    <p style={{ margin: 0, color: "var(--fg-2)", fontSize: 14.5, lineHeight: 1.55 }}>
                        I&apos;ve sent a confirmation to{" "}
                        <strong style={{ color: "var(--fg-1)", fontWeight: 600 }}>{email}</strong> with a calendar
                        invite and the meeting link.
                    </p>

                    <div
                        style={{
                            marginTop: 24,
                            padding: 20,
                            borderRadius: 14,
                            background: "var(--surface-2)",
                            border: "1px solid var(--color-border)",
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                        }}
                    >
                        <ConfRow icon={User} label="Amelia Chen" sub={session.title} />
                        <ConfRow
                            icon={CalendarIcon}
                            label={dateLabel}
                            sub={`${selectedTime} PT · ${session.duration} min`}
                        />
                        <ConfRow icon={Video} label="One Planner video room" sub="Link in your email" />
                    </div>

                    <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
                        <FButton variant="secondary" leadingIcon={CalendarPlus} fullWidth>
                            Add to calendar
                        </FButton>
                        <FButton variant="secondary" leadingIcon={X} fullWidth>
                            Cancel
                        </FButton>
                    </div>

                    <p
                        style={{
                            marginTop: 22,
                            fontSize: 12,
                            color: "var(--fg-3)",
                            textAlign: "center",
                        }}
                    >
                        Need to reschedule? Use the link in your email up to 24 hours before the session.
                    </p>
                </Card>
                <div style={{ textAlign: "center", marginTop: 16 }}>
                    <button
                        onClick={onReset}
                        style={{
                            background: "transparent",
                            border: 0,
                            color: "var(--fg-3)",
                            fontSize: 12,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            textDecoration: "underline",
                        }}
                    >
                        ← Back to booking page
                    </button>
                </div>
            </div>
        </div>
    );
}

function ConfRow({ icon: Icon, label, sub }: { icon: LucideIcon; label: string; sub: string }) {
    return (
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div
                style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: "var(--surface)",
                    border: "1px solid var(--color-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-primary)",
                    flexShrink: 0,
                }}
            >
                <Icon size={16} />
            </div>
            <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--fg-1)" }}>{label}</p>
                <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--fg-3)" }}>{sub}</p>
            </div>
        </div>
    );
}

function NotFoundView({ onReset }: { onReset: () => void }) {
    return (
        <div style={{ minHeight: "100vh", background: "var(--background)", color: "var(--fg-1)" }}>
            <PublicTopBar handle="not-found" />
            <div style={{ maxWidth: 520, margin: "0 auto", padding: "100px 24px 80px", textAlign: "center" }}>
                <p
                    style={{
                        margin: 0,
                        fontFamily:
                            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                        fontSize: 12,
                        letterSpacing: "0.12em",
                        color: "var(--fg-3)",
                        textTransform: "uppercase",
                    }}
                >
                    404
                </p>
                <h1
                    style={{
                        margin: "10px 0 12px",
                        fontSize: 30,
                        fontWeight: 600,
                        letterSpacing: "-0.02em",
                    }}
                >
                    This page could not be found.
                </h1>
                <p style={{ margin: 0, color: "var(--fg-2)", fontSize: 15, lineHeight: 1.55 }}>
                    The meeting link may be broken, expired, or you may not have permission to view this page.
                </p>
                <div
                    style={{
                        marginTop: 28,
                        display: "flex",
                        justifyContent: "center",
                        gap: 10,
                    }}
                >
                    <FButton variant="secondary" onClick={onReset} leadingIcon={ArrowLeft}>
                        Try again
                    </FButton>
                    <Link href="/" style={{ textDecoration: "none" }}>
                        <FButton leadingIcon={House}>Go to One Planner</FButton>
                    </Link>
                </div>
            </div>
        </div>
    );
}

