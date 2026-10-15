"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
    User,
    CalendarClock,
    Sparkles,
    Upload,
    Copy,
    Trash2,
    Info,
    Plus,
    Minus,
    Eye,
    EyeOff,
    Users,
    Link as LinkIcon,
    Check,
    Pencil,
    X,
    type LucideIcon,
} from "lucide-react";
import { Avatar, Card, Chip, FButton, FloatingInput } from "@/components/flows/Primitives";
import { ExpertTopBar, ExpertSidebar } from "@/components/flows/ExpertChrome";
import ErrorStateUI from "@/components/ui/ErrorStateUI";
import LucideByName from "@/components/flows/LucideByName";
import { useApiGet } from "@/lib/hooks/useApiGet";
import {
    type SettingsResponse,
    type DayConfig,
    type SessionTypeRecord,
} from "@/lib/api/api.types";

type Tab = "profile" | "availability" | "sessions";

export default function SettingsClient() {
    const params = useSearchParams();
    const initial = (params.get("tab") || "profile") as Tab;
    const [tab, setTab] = useState<Tab>(
        initial === "availability" || initial === "sessions" ? initial : "profile",
    );

    const { data: settings, loading, error, retry } = useApiGet<SettingsResponse>("/settings");

    return (
        <div style={{ background: "var(--background)", color: "var(--fg-1)", minHeight: "100vh" }}>
            <ExpertTopBar />
            <div style={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
                <ExpertSidebar active="Settings" />
                <main style={{ flex: 1, minWidth: 0, padding: "20px 28px 40px" }}>
                    <header style={{ marginBottom: 18 }}>
                        <p
                            style={{
                                margin: 0,
                                fontFamily:
                                    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                                fontSize: 11,
                                letterSpacing: "0.1em",
                                color: "var(--fg-3)",
                                textTransform: "uppercase",
                            }}
                        >
                            Settings
                        </p>
                        <h1 style={{ margin: "6px 0 0", fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em" }}>
                            {tab === "profile" && "Profile"}
                            {tab === "availability" && "Availability"}
                            {tab === "sessions" && "Session types"}
                        </h1>
                    </header>

                    <Tabs value={tab} onChange={setTab} />

                    <div style={{ marginTop: 22 }}>
                        {loading && <SettingsSkeleton />}
                        {!loading && error && <ErrorStateUI message={error} onRefresh={retry} />}
                        {!loading && !error && settings && (
                            <>
                                {tab === "profile" && <ProfileTab key={settings.profile.handle} initial={settings.profile} />}
                                {tab === "availability" && (
                                    <AvailabilityTab key="avail" initial={settings.availability} />
                                )}
                                {tab === "sessions" && (
                                    <SessionTypesTab key="sessions" initial={settings.sessionTypes} />
                                )}
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

function SettingsSkeleton() {
    return (
        <Card padding={24}>
            <div className="animate-pulse" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ height: 18, width: "30%", background: "var(--surface-2)", borderRadius: 4 }} />
                <div style={{ height: 12, width: "55%", background: "var(--surface-2)", borderRadius: 4 }} />
                <div style={{ height: 12, width: "45%", background: "var(--surface-2)", borderRadius: 4 }} />
                <div style={{ height: 12, width: "60%", background: "var(--surface-2)", borderRadius: 4 }} />
            </div>
        </Card>
    );
}

function Tabs({ value, onChange }: { value: Tab; onChange: (t: Tab) => void }) {
    const tabs: { id: Tab; label: string; icon: LucideIcon }[] = [
        { id: "profile", label: "Profile", icon: User },
        { id: "availability", label: "Availability", icon: CalendarClock },
        { id: "sessions", label: "Session types", icon: Sparkles },
    ];
    return (
        <div
            style={{
                display: "flex",
                gap: 4,
                borderBottom: "1px solid var(--color-border)",
                overflowX: "auto",
            }}
        >
            {tabs.map((t) => {
                const active = t.id === value;
                const Icon = t.icon;
                return (
                    <button
                        key={t.id}
                        onClick={() => onChange(t.id)}
                        style={{
                            padding: "10px 14px",
                            border: 0,
                            background: "transparent",
                            color: active ? "var(--color-primary)" : "var(--fg-2)",
                            borderBottom: `2px solid ${active ? "var(--color-primary)" : "transparent"}`,
                            marginBottom: -1,
                            fontWeight: 500,
                            fontSize: 14,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            whiteSpace: "nowrap",
                        }}
                    >
                        <Icon size={14} />
                        {t.label}
                    </button>
                );
            })}
        </div>
    );
}

function SectionHead({ title, sub }: { title: string; sub?: string }) {
    return (
        <div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "var(--fg-1)" }}>{title}</h3>
            {sub && <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "var(--fg-3)" }}>{sub}</p>}
        </div>
    );
}

/* ----- Profile ----- */

function ProfileTab({ initial }: { initial: SettingsResponse["profile"] }) {
    const [name, setName] = useState(initial.name);
    const [handle, setHandle] = useState(initial.handle);
    const [tagline, setTagline] = useState(initial.tagline);
    const [bio, setBio] = useState(initial.bio);
    const [tz, setTz] = useState(initial.timezone);
    const [language, setLanguage] = useState(initial.language);

    return (
        <div className="op-settings-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}>
                <Card padding={24}>
                    <SectionHead title="Public booking page" sub="What clients see at your link" />
                    <div
                        style={{
                            marginTop: 18,
                            display: "flex",
                            gap: 18,
                            alignItems: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        <Avatar name={name} size={80} />
                        <div style={{ flex: 1, minWidth: 200 }}>
                            <FButton variant="secondary" compact leadingIcon={Upload}>
                                Upload photo
                            </FButton>
                            <p style={{ margin: "8px 0 0", fontSize: 12, color: "var(--fg-3)" }}>
                                PNG or JPG · square · max 2 MB · the brand gradient initials are used as fallback.
                            </p>
                        </div>
                    </div>

                    <div style={{ marginTop: 22, display: "grid", gap: 14, gridTemplateColumns: "1fr" }}>
                        <FloatingInput label="Full name" value={name} onChange={setName} />
                        <FloatingInput label="Tagline" value={tagline} onChange={setTagline} />
                        <BioField value={bio} onChange={setBio} />
                    </div>

                    <div style={{ marginTop: 22 }}>
                        <p
                            style={{
                                margin: "0 0 8px",
                                fontSize: 12,
                                fontWeight: 600,
                                color: "var(--fg-2)",
                            }}
                        >
                            Booking link
                        </p>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "stretch",
                                border: "1px solid var(--color-border-strong)",
                                borderRadius: 12,
                                overflow: "hidden",
                                background: "var(--surface)",
                            }}
                        >
                            <span style={{ ...monoChip(), borderRight: "1px solid var(--color-border)" }}>https://</span>
                            <input
                                value={handle}
                                onChange={(e) =>
                                    setHandle(e.target.value.replace(/[^a-z0-9-]/gi, "").toLowerCase())
                                }
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                    padding: "12px 4px",
                                    border: 0,
                                    outline: "none",
                                    background: "transparent",
                                    color: "var(--fg-1)",
                                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                                    fontSize: 13,
                                }}
                            />
                            <span style={{ ...monoChip(), borderLeft: "1px solid var(--color-border)" }}>
                                .oneplanner.app
                            </span>
                        </div>
                        <p
                            style={{
                                margin: "8px 0 0",
                                fontSize: 12,
                                color: "var(--fg-3)",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                            }}
                        >
                            <Check size={12} color="#10b981" />
                            <strong style={{ color: "#059669", fontWeight: 600 }}>{handle}</strong> is available.
                        </p>
                    </div>
                </Card>

                <Card padding={24}>
                    <SectionHead title="Account" />
                    <div style={{ marginTop: 18, display: "grid", gap: 14 }}>
                        <FloatingInput label="Email" value={initial.email} onChange={() => {}} />
                        <SelectRow
                            label="Timezone"
                            value={tz}
                            onChange={setTz}
                            options={[
                                "America/Los_Angeles",
                                "America/New_York",
                                "Europe/London",
                                "Europe/Berlin",
                                "Asia/Kolkata",
                                "Asia/Tokyo",
                            ]}
                        />
                        <SelectRow label="Language" value={language} onChange={setLanguage} options={["en", "hi"]} />
                    </div>
                </Card>

                <Card padding={24} style={{ borderColor: "rgba(234,67,53,0.30)" }}>
                    <SectionHead title="Danger zone" />
                    <div
                        style={{
                            marginTop: 16,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 14,
                            flexWrap: "wrap",
                        }}
                    >
                        <p style={{ margin: 0, fontSize: 13, color: "var(--fg-2)" }}>
                            Permanently delete your One Planner account and all client data. This can&apos;t be undone.
                        </p>
                        <FButton variant="danger" compact leadingIcon={Trash2}>
                            Delete account
                        </FButton>
                    </div>
                </Card>
            </div>

            <aside style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                <Card padding={20}>
                    <SectionHead title="Live preview" sub="How clients see your link" />
                    <div
                        style={{
                            marginTop: 14,
                            borderRadius: 12,
                            border: "1px solid var(--color-border)",
                            background: "var(--surface-2)",
                            padding: 16,
                        }}
                    >
                        <Avatar name={name} size={56} />
                        <p style={{ margin: "12px 0 2px", fontSize: 16, fontWeight: 600 }}>{name}</p>
                        <p style={{ margin: 0, fontSize: 13, color: "var(--fg-3)" }}>{tagline}</p>
                        <p style={{ margin: "12px 0 0", fontSize: 12.5, color: "var(--fg-2)", lineHeight: 1.5 }}>{bio}</p>
                        <div
                            style={{
                                marginTop: 14,
                                paddingTop: 14,
                                borderTop: "1px solid var(--color-border)",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                fontSize: 11,
                                color: "var(--fg-3)",
                                fontFamily:
                                    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                            }}
                        >
                            <span>{handle}.oneplanner.app</span>
                            <button
                                style={{
                                    background: "transparent",
                                    border: 0,
                                    color: "var(--color-primary)",
                                    fontSize: 11,
                                    cursor: "pointer",
                                    fontFamily: "inherit",
                                }}
                            >
                                Preview ↗
                            </button>
                        </div>
                    </div>
                </Card>

                <Card padding={20}>
                    <SectionHead title="Shortcut" />
                    <p style={{ margin: "12px 0 14px", fontSize: 13, color: "var(--fg-3)", lineHeight: 1.5 }}>
                        Add the booking link to your email signature.
                    </p>
                    <FButton fullWidth variant="secondary" compact leadingIcon={Copy}>
                        Copy link
                    </FButton>
                </Card>
            </aside>
        </div>
    );
}

function monoChip(): React.CSSProperties {
    return {
        padding: "12px 14px",
        background: "var(--surface-2)",
        color: "var(--fg-3)",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        fontSize: 13,
        whiteSpace: "nowrap",
    };
}

function BioField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const [focused, setFocused] = useState(false);
    const isFloating = focused || value.length > 0;
    return (
        <div style={{ position: "relative" }}>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                rows={4}
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
                    transition: "all 0.2s",
                    color: isFloating ? "var(--color-primary)" : "var(--fg-3)",
                    fontSize: isFloating ? 11 : 14,
                    fontWeight: isFloating ? 500 : 400,
                    top: isFloating ? 0 : 16,
                    transform: isFloating ? "translateY(-50%)" : "none",
                }}
            >
                Bio
            </label>
        </div>
    );
}

function SelectRow({
    label,
    value,
    onChange,
    options,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: string[];
}) {
    return (
        <div>
            <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 600, color: "var(--fg-2)" }}>{label}</p>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: "1px solid var(--color-border-strong)",
                    background: "var(--surface)",
                    color: "var(--fg-1)",
                    fontFamily: "inherit",
                    fontSize: 14,
                    outline: "none",
                    appearance: "none",
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                    paddingRight: 36,
                }}
            >
                {options.map((o) => (
                    <option key={o} value={o}>
                        {o}
                    </option>
                ))}
            </select>
        </div>
    );
}

/* ----- Availability ----- */

function AvailabilityTab({ initial }: { initial: SettingsResponse["availability"] }) {
    const [days, setDays] = useState<DayConfig[]>(initial.days);
    const [bufferBefore, setBufferBefore] = useState(initial.bufferBefore);
    const [bufferAfter, setBufferAfter] = useState(initial.bufferAfter);
    const [maxPerDay, setMaxPerDay] = useState(initial.maxPerDay);
    const [horizon, setHorizon] = useState(initial.horizon);

    const setDay = (id: string, patch: Partial<DayConfig>) =>
        setDays((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));

    return (
        <div className="op-settings-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}>
                <Card padding={24}>
                    <SectionHead title="Weekly hours" sub="When your clients can book on the public page" />
                    <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 6 }}>
                        {days.map((d) => (
                            <DayRow
                                key={d.id}
                                day={d}
                                onToggle={() => setDay(d.id, { on: !d.on })}
                                onChangeStart={(v) => setDay(d.id, { start: v })}
                                onChangeEnd={(v) => setDay(d.id, { end: v })}
                            />
                        ))}
                    </div>
                    <div
                        style={{
                            marginTop: 14,
                            padding: "10px 14px",
                            borderRadius: 10,
                            background: "var(--surface-2)",
                            border: "1px dashed var(--color-border-strong)",
                            fontSize: 12.5,
                            color: "var(--fg-2)",
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                        }}
                    >
                        <Info size={14} color="var(--fg-3)" /> All times shown in{" "}
                        <strong style={{ color: "var(--fg-1)" }}>Pacific time</strong>. Clients see their local time on the
                        booking page.
                    </div>
                </Card>

                <Card padding={24}>
                    <SectionHead title="Buffers & limits" />
                    <div
                        style={{
                            marginTop: 16,
                            display: "grid",
                            gap: 18,
                            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        }}
                    >
                        <NumberStepper
                            label="Buffer before"
                            value={bufferBefore}
                            onChange={setBufferBefore}
                            step={5}
                            min={0}
                            max={60}
                            unit="min"
                        />
                        <NumberStepper
                            label="Buffer after"
                            value={bufferAfter}
                            onChange={setBufferAfter}
                            step={5}
                            min={0}
                            max={60}
                            unit="min"
                        />
                        <NumberStepper
                            label="Max sessions / day"
                            value={maxPerDay}
                            onChange={setMaxPerDay}
                            step={1}
                            min={1}
                            max={20}
                        />
                        <NumberStepper
                            label="Booking horizon"
                            value={horizon}
                            onChange={setHorizon}
                            step={1}
                            min={1}
                            max={26}
                            unit="weeks"
                        />
                    </div>
                </Card>

                <Card padding={24}>
                    <SectionHead title="Time off & blackouts" />
                    <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                        {initial.blackouts.map((b, i) => (
                            <BlackoutRow key={i} date={b.date} reason={b.reason} />
                        ))}
                    </div>
                    <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
                        <FButton variant="secondary" compact leadingIcon={Plus}>
                            Add time off
                        </FButton>
                    </div>
                </Card>
            </div>

            <aside style={{ minWidth: 0 }}>
                <Card padding={20}>
                    <SectionHead title="This week at a glance" />
                    <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                        {days.map((d) => (
                            <div
                                key={d.id}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "6px 10px",
                                    borderRadius: 8,
                                    background: d.on ? "var(--surface-2)" : "transparent",
                                    opacity: d.on ? 1 : 0.55,
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: 12.5,
                                        fontWeight: 500,
                                        color: "var(--fg-2)",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.04em",
                                    }}
                                >
                                    {d.label.slice(0, 3)}
                                </span>
                                <span
                                    style={{
                                        fontSize: 12.5,
                                        color: "var(--fg-1)",
                                        fontVariantNumeric: "tabular-nums",
                                    }}
                                >
                                    {d.on ? `${d.start} – ${d.end}` : "—"}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            </aside>
        </div>
    );
}

function DayRow({
    day,
    onToggle,
    onChangeStart,
    onChangeEnd,
}: {
    day: DayConfig;
    onToggle: () => void;
    onChangeStart: (v: string) => void;
    onChangeEnd: (v: string) => void;
}) {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "32px 1fr auto auto",
                gap: 12,
                alignItems: "center",
                padding: "8px 8px 8px 0",
                borderBottom: "1px solid var(--color-border)",
                opacity: day.on ? 1 : 0.5,
            }}
        >
            <Switch on={day.on} onChange={onToggle} />
            <span style={{ fontSize: 14, fontWeight: 500, color: "var(--fg-1)" }}>{day.label}</span>
            {day.on ? (
                <>
                    <TimePicker value={day.start} onChange={onChangeStart} />
                    <TimePicker value={day.end} onChange={onChangeEnd} />
                </>
            ) : (
                <span style={{ gridColumn: "3 / span 2", fontSize: 12.5, color: "var(--fg-3)" }}>Unavailable</span>
            )}
        </div>
    );
}

function Switch({ on, onChange }: { on: boolean; onChange: () => void }) {
    return (
        <button
            onClick={onChange}
            aria-pressed={on}
            style={{
                width: 32,
                height: 20,
                borderRadius: 9999,
                border: 0,
                background: on ? "var(--color-primary)" : "var(--color-border-strong)",
                position: "relative",
                cursor: "pointer",
                transition: "all 0.2s",
            }}
        >
            <span
                style={{
                    position: "absolute",
                    top: 2,
                    left: on ? 14 : 2,
                    width: 16,
                    height: 16,
                    borderRadius: 9999,
                    background: "#fff",
                    transition: "all 0.2s",
                }}
            />
        </button>
    );
}

function TimePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return (
        <input
            type="time"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid var(--color-border-strong)",
                background: "var(--surface)",
                color: "var(--fg-1)",
                fontFamily: "inherit",
                fontSize: 13,
                fontVariantNumeric: "tabular-nums",
                outline: "none",
                colorScheme: "light dark",
            }}
        />
    );
}

function NumberStepper({
    label,
    value,
    onChange,
    step,
    min,
    max,
    unit = "",
}: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    step: number;
    min: number;
    max: number;
    unit?: string;
}) {
    return (
        <div>
            <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 600, color: "var(--fg-2)" }}>{label}</p>
            <div
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    border: "1px solid var(--color-border-strong)",
                    borderRadius: 10,
                    background: "var(--surface)",
                    overflow: "hidden",
                }}
            >
                <StepperBtn icon={Minus} onClick={() => onChange(Math.max(min, value - step))} />
                <span
                    style={{
                        padding: "8px 14px",
                        fontSize: 14,
                        fontWeight: 500,
                        color: "var(--fg-1)",
                        fontVariantNumeric: "tabular-nums",
                        minWidth: 56,
                        textAlign: "center",
                    }}
                >
                    {value}
                    {unit && (
                        <span style={{ color: "var(--fg-3)", fontWeight: 400, marginLeft: 4 }}>{unit}</span>
                    )}
                </span>
                <StepperBtn icon={Plus} onClick={() => onChange(Math.min(max, value + step))} />
            </div>
        </div>
    );
}

function StepperBtn({ icon: Icon, onClick }: { icon: LucideIcon; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            style={{
                width: 32,
                height: 36,
                border: 0,
                background: "transparent",
                color: "var(--fg-2)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
            <Icon size={14} />
        </button>
    );
}

function BlackoutRow({ date, reason }: { date: string; reason: string }) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 14px",
                border: "1px solid var(--color-border)",
                borderRadius: 10,
                background: "var(--surface)",
            }}
        >
            <div style={{ minWidth: 0 }}>
                <p
                    style={{
                        margin: 0,
                        fontSize: 13.5,
                        fontWeight: 500,
                        color: "var(--fg-1)",
                        fontVariantNumeric: "tabular-nums",
                    }}
                >
                    {date}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--fg-3)" }}>{reason}</p>
            </div>
            <button
                aria-label="Remove time off"
                style={{
                    background: "transparent",
                    border: 0,
                    color: "var(--fg-3)",
                    cursor: "pointer",
                    padding: 6,
                    borderRadius: 6,
                    display: "inline-flex",
                }}
            >
                <X size={14} />
            </button>
        </div>
    );
}

/* ----- Session types ----- */

function SessionTypesTab({ initial }: { initial: SessionTypeRecord[] }) {
    const [items, setItems] = useState<SessionTypeRecord[]>(initial);
    const toggle = (id: string) =>
        setItems((prev) => prev.map((t) => (t.id === id ? { ...t, visible: !t.visible } : t)));
    const max = Math.max(...items.map((t) => t.booked), 1);

    return (
        <div className="op-settings-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                        flexWrap: "wrap",
                    }}
                >
                    <p style={{ margin: 0, fontSize: 14, color: "var(--fg-2)", maxWidth: 540, lineHeight: 1.5 }}>
                        Each session type appears as its own card on your public booking page. Clients pick one, then a time.
                    </p>
                    <FButton leadingIcon={Plus}>New session type</FButton>
                </div>

                {items.map((t) => (
                    <SessionTypeCard key={t.id} t={t} onToggle={() => toggle(t.id)} />
                ))}
            </div>

            <aside style={{ minWidth: 0 }}>
                <Card padding={20}>
                    <SectionHead title="This quarter" sub="Sessions booked, by type" />
                    <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 14 }}>
                        {items.map((t) => (
                            <BarRow key={t.id} label={t.title} value={t.booked} max={max} color={t.color} />
                        ))}
                    </div>
                </Card>

                <Card padding={20} style={{ marginTop: 16 }}>
                    <SectionHead title="Tip" />
                    <p style={{ margin: "12px 0 0", fontSize: 13, color: "var(--fg-3)", lineHeight: 1.55 }}>
                        Most coaches start with 2–3 types and add more as they learn what clients ask for.
                    </p>
                </Card>
            </aside>
        </div>
    );
}

function SessionTypeCard({ t, onToggle }: { t: SessionTypeRecord; onToggle: () => void }) {
    return (
        <Card padding={20}>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: t.color,
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <LucideByName name={t.icon} size={20} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                            gap: 12,
                            flexWrap: "wrap",
                        }}
                    >
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "var(--fg-1)" }}>{t.title}</h3>
                            {t.visible ? (
                                <Chip tone="success" size="sm" icon={Eye}>
                                    Visible
                                </Chip>
                            ) : (
                                <Chip tone="neutral" size="sm" icon={EyeOff}>
                                    Hidden
                                </Chip>
                            )}
                        </div>
                        <span
                            style={{
                                fontSize: 13,
                                color: "var(--fg-2)",
                                fontVariantNumeric: "tabular-nums",
                            }}
                        >
                            {t.duration} min · {t.price}
                        </span>
                    </div>
                    <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "var(--fg-3)", lineHeight: 1.5 }}>{t.blurb}</p>
                    <div
                        style={{
                            marginTop: 14,
                            paddingTop: 14,
                            borderTop: "1px solid var(--color-border)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 10,
                        }}
                    >
                        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                            <Chip size="sm" tone="neutral" icon={Users}>
                                {t.booked} booked
                            </Chip>
                            <Chip size="sm" tone="neutral" icon={LinkIcon}>
                                /{t.id}
                            </Chip>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                            <FButton variant="ghost" compact leadingIcon={t.visible ? EyeOff : Eye} onClick={onToggle}>
                                {t.visible ? "Hide" : "Unhide"}
                            </FButton>
                            <FButton variant="secondary" compact leadingIcon={Pencil}>
                                Edit
                            </FButton>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

function BarRow({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
    const pct = Math.round((value / max) * 100);
    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    color: "var(--fg-1)",
                    marginBottom: 6,
                }}
            >
                <span>{label}</span>
                <span style={{ color: "var(--fg-3)", fontVariantNumeric: "tabular-nums" }}>{value}</span>
            </div>
            <div style={{ height: 6, borderRadius: 9999, background: "var(--surface-2)", overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: color }} />
            </div>
        </div>
    );
}
