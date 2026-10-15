"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    ChevronRight,
    Check,
    Sparkles,
    CalendarPlus,
    Mail,
    Pencil,
    Video,
    Pin,
    FileText,
    File as FileIcon,
    FolderArchive,
    Download,
    Briefcase,
    Globe,
    Link as LinkIcon,
    Plus,
    Upload,
    Image as ImageIcon,
    CalendarClock,
    CirclePlay,
    type LucideIcon,
} from "lucide-react";
import { Avatar, Card, Chip, FButton } from "@/components/flows/Primitives";
import { ExpertTopBar, ExpertSidebar } from "@/components/flows/ExpertChrome";
import ErrorStateUI from "@/components/ui/ErrorStateUI";
import { useApiGet } from "@/lib/hooks/useApiGet";
import {
    type ClientResponse,
    type ClientFile,
    type ClientNote,
    type SessionHistoryItem,
} from "@/lib/api/api.types";

const FILE_ICON: Record<ClientFile["kind"], LucideIcon> = {
    doc: FileText,
    markdown: FileIcon,
    archive: FolderArchive,
    image: ImageIcon,
};

export default function ClientsClient() {
    const router = useRouter();
    const params = useSearchParams();
    const id = params.get("id") || "marcus";

    const { data: client, loading, error, retry } = useApiGet<ClientResponse>(`/clients/${id}`);

    return (
        <div style={{ background: "var(--background)", color: "var(--fg-1)", minHeight: "100vh" }}>
            <ExpertTopBar />
            <div style={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
                <ExpertSidebar active="Contacts" />
                <main style={{ flex: 1, minWidth: 0, padding: "20px 28px 40px" }}>
                    <Breadcrumb name={client?.name ?? "…"} onBack={() => router.push("/dashboard")} />
                    {loading && <ClientSkeleton />}
                    {!loading && error && <ErrorStateUI message={error} onRefresh={retry} />}
                    {!loading && !error && client && (
                        client.isNew ? <NewClientView client={client} /> : <PopulatedView client={client} />
                    )}
                </main>
            </div>
        </div>
    );
}

function Breadcrumb({ name, onBack }: { name: string; onBack: () => void }) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                color: "var(--fg-3)",
                marginBottom: 16,
            }}
        >
            <button
                onClick={onBack}
                style={{
                    background: "transparent",
                    border: 0,
                    padding: 0,
                    color: "var(--fg-3)",
                    cursor: "pointer",
                    fontFamily: "inherit",
                }}
            >
                Contacts
            </button>
            <ChevronRight size={14} color="var(--fg-4)" />
            <span style={{ color: "var(--fg-1)", fontWeight: 500 }}>{name}</span>
        </div>
    );
}

function ClientSkeleton() {
    return (
        <Card padding={24}>
            <div style={{ display: "flex", gap: 20, alignItems: "center" }} className="animate-pulse">
                <div style={{ width: 72, height: 72, borderRadius: 9999, background: "var(--surface-2)" }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ height: 18, width: "30%", background: "var(--surface-2)", borderRadius: 4 }} />
                    <div style={{ height: 12, width: "55%", background: "var(--surface-2)", borderRadius: 4 }} />
                    <div style={{ height: 10, width: "40%", background: "var(--surface-2)", borderRadius: 4 }} />
                </div>
            </div>
        </Card>
    );
}

function PopulatedView({ client }: { client: ClientResponse }) {
    const [tab, setTab] = useState<"overview" | "sessions" | "notes" | "files">("overview");
    const router = useRouter();

    return (
        <>
            <Card padding={24} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
                    <Avatar name={client.name} size={72} />
                    <div style={{ flex: 1, minWidth: 220 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em" }}>
                                {client.name}
                            </h1>
                            <Chip tone="success" icon={Check}>Active</Chip>
                        </div>
                        <p style={{ margin: "6px 0 0", color: "var(--fg-3)", fontSize: 14 }}>{client.blurb}</p>
                        <div style={{ display: "flex", gap: 20, marginTop: 16, flexWrap: "wrap" }}>
                            <Stat label="Sessions" value={String(client.sessions)} />
                            <Stat label="Hours" value={client.hours} />
                            <Stat label="Next session" value={client.nextSession} valueSize={15} numeric={false} />
                            <Stat label="Lifetime value" value={client.ltv} />
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "stretch" }}>
                        <FButton leadingIcon={CalendarPlus} onClick={() => router.push("/schedule")}>
                            Schedule session
                        </FButton>
                        <FButton variant="secondary" compact leadingIcon={Mail}>
                            Email {client.name.split(" ")[0]}
                        </FButton>
                    </div>
                </div>
            </Card>

            <Tabs
                value={tab}
                onChange={(t) => setTab(t as "overview" | "sessions" | "notes" | "files")}
                tabs={[
                    { id: "overview", label: "Overview" },
                    { id: "sessions", label: "Sessions", count: client.sessions },
                    { id: "notes", label: "Notes", count: client.notes.length },
                    { id: "files", label: "Files", count: client.files.length },
                ]}
            />

            <div style={{ marginTop: 18 }}>
                {tab === "overview" && <OverviewTab client={client} />}
                {tab === "sessions" && <RecentSessions history={client.history} />}
                {tab === "notes" && <NotesTab pinned={client.pinnedNotes} all={client.notes} />}
                {tab === "files" && <FilesTab files={client.files} />}
            </div>
        </>
    );
}

function Stat({
    label,
    value,
    valueSize = 22,
    numeric = true,
}: {
    label: string;
    value: string;
    valueSize?: number;
    numeric?: boolean;
}) {
    return (
        <div>
            <p
                style={{
                    margin: 0,
                    fontSize: valueSize,
                    fontWeight: 600,
                    color: "var(--fg-1)",
                    letterSpacing: "-0.01em",
                    fontVariantNumeric: numeric ? "tabular-nums" : "normal",
                }}
            >
                {value}
            </p>
            <p
                style={{
                    margin: "2px 0 0",
                    fontSize: 11,
                    color: "var(--fg-3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    fontWeight: 500,
                }}
            >
                {label}
            </p>
        </div>
    );
}

function Tabs({
    tabs,
    value,
    onChange,
}: {
    tabs: { id: string; label: string; count?: number }[];
    value: string;
    onChange: (v: string) => void;
}) {
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
                            transition: "all 0.15s",
                        }}
                    >
                        {t.label}
                        {t.count != null && (
                            <span
                                style={{
                                    fontSize: 11,
                                    padding: "1px 7px",
                                    borderRadius: 9999,
                                    background: active
                                        ? "var(--color-primary-soft)"
                                        : "var(--surface-2)",
                                    color: active ? "var(--color-primary)" : "var(--fg-3)",
                                    fontWeight: 600,
                                    fontVariantNumeric: "tabular-nums",
                                }}
                            >
                                {t.count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

function OverviewTab({ client }: { client: ClientResponse }) {
    return (
        <div className="op-client-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
                {client.nextSessionDetail && (
                    <NextSessionCard
                        eyebrow={client.nextSessionDetail.eyebrow}
                        title={client.nextSessionDetail.title}
                        when={client.nextSessionDetail.when}
                        clientName={client.name.split(" ")[0]}
                        clientNote={client.nextSessionDetail.clientNote}
                    />
                )}
                <RecentSessions history={client.history} />
                <PinnedNotes notes={client.pinnedNotes} totalNotes={client.notes.length} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
                <ContactCard contact={client.contact} />
                <GoalsCard goals={client.goals} />
                <FilesCardPreview files={client.files} />
            </div>
        </div>
    );
}

function NextSessionCard({
    eyebrow,
    title,
    when,
    clientName,
    clientNote,
}: {
    eyebrow: string;
    title: string;
    when: string;
    clientName: string;
    clientNote: string;
}) {
    return (
        <Card padding={22}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 16,
                    flexWrap: "wrap",
                }}
            >
                <div style={{ minWidth: 0 }}>
                    <p
                        style={{
                            margin: 0,
                            fontSize: 11,
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color: "var(--color-primary)",
                        }}
                    >
                        {eyebrow}
                    </p>
                    <h3
                        style={{
                            margin: "8px 0 6px",
                            fontSize: 18,
                            fontWeight: 600,
                            color: "var(--fg-1)",
                            letterSpacing: "-0.01em",
                        }}
                    >
                        {title}
                    </h3>
                    <p
                        style={{
                            margin: 0,
                            color: "var(--fg-3)",
                            fontSize: 13.5,
                            fontVariantNumeric: "tabular-nums",
                        }}
                    >
                        {when}
                    </p>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <FButton variant="secondary" compact leadingIcon={Pencil}>
                        Reschedule
                    </FButton>
                    <FButton compact leadingIcon={Video}>
                        Join
                    </FButton>
                </div>
            </div>
            <div
                style={{
                    marginTop: 16,
                    padding: 14,
                    borderRadius: 10,
                    background: "var(--surface-2)",
                    border: "1px solid var(--color-border)",
                    fontSize: 13,
                    color: "var(--fg-2)",
                    lineHeight: 1.5,
                }}
            >
                <strong style={{ color: "var(--fg-1)", fontWeight: 600 }}>{clientName}&apos;s note:</strong>{" "}
                {clientNote}
            </div>
        </Card>
    );
}

function RecentSessions({ history }: { history: SessionHistoryItem[] }) {
    if (history.length === 0) {
        return (
            <Card padding={36} style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: 14, color: "var(--fg-3)" }}>No sessions yet.</p>
            </Card>
        );
    }
    return (
        <Card padding={0}>
            <div
                style={{
                    padding: "18px 22px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid var(--color-border)",
                }}
            >
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Recent sessions</h3>
                <LinkButton>View all {history.length} →</LinkButton>
            </div>
            <div>
                {history.map((h, i) => (
                    <div
                        key={h.id}
                        style={{
                            padding: "14px 22px",
                            borderBottom: i === history.length - 1 ? 0 : "1px solid var(--color-border)",
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                            flexWrap: "wrap",
                        }}
                    >
                        <div style={{ minWidth: 0, flex: 1 }}>
                            <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "var(--fg-1)" }}>{h.title}</p>
                            <p
                                style={{
                                    margin: "2px 0 0",
                                    fontSize: 12.5,
                                    color: "var(--fg-3)",
                                    fontVariantNumeric: "tabular-nums",
                                }}
                            >
                                {h.date} · {h.duration} · {h.type}
                            </p>
                        </div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {h.hasNotes && (
                                <Chip size="sm" tone="neutral" icon={FileText}>
                                    Notes
                                </Chip>
                            )}
                            {h.hasRecording && (
                                <Chip size="sm" tone="primary" icon={CirclePlay}>
                                    Recording
                                </Chip>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

function PinnedNotes({ notes, totalNotes }: { notes: ClientNote[]; totalNotes: number }) {
    if (notes.length === 0) return null;
    return (
        <Card padding={22}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                }}
            >
                <h3
                    style={{
                        margin: 0,
                        fontSize: 15,
                        fontWeight: 600,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    <Pin size={14} color="var(--color-primary)" /> Pinned notes
                </h3>
                <LinkButton>All {totalNotes} notes →</LinkButton>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
                {notes.map((n, i) => (
                    <NoteBlock key={i} date={n.date} body={n.body} tags={n.tags} />
                ))}
            </div>
        </Card>
    );
}

function NoteBlock({ date, body, tags }: { date: string; body: string; tags: string[] }) {
    return (
        <div
            style={{
                padding: 14,
                borderRadius: 10,
                border: "1px solid var(--color-border)",
                background: "var(--surface-2)",
            }}
        >
            <p
                style={{
                    margin: 0,
                    fontSize: 11,
                    color: "var(--fg-3)",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                }}
            >
                {date}
            </p>
            <p style={{ margin: "6px 0 10px", fontSize: 13.5, lineHeight: 1.55, color: "var(--fg-1)" }}>{body}</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {tags.map((t) => (
                    <Chip key={t} size="sm">
                        #{t}
                    </Chip>
                ))}
            </div>
        </div>
    );
}

function ContactCard({ contact }: { contact: ClientResponse["contact"] }) {
    return (
        <Card padding={20}>
            <h3
                style={{
                    margin: "0 0 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--fg-3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                }}
            >
                Contact
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <ContactRow icon={Mail} label={contact.email} />
                <ContactRow icon={Briefcase} label={contact.role} />
                <ContactRow icon={Globe} label={contact.timezone} />
                <ContactRow icon={LinkIcon} label={contact.linkedin} linkish />
            </div>
        </Card>
    );
}

function ContactRow({ icon: Icon, label, linkish }: { icon: LucideIcon; label: string; linkish?: boolean }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, minWidth: 0 }}>
            <Icon size={14} color="var(--fg-3)" />
            <span
                style={{
                    color: linkish ? "var(--color-primary)" : "var(--fg-1)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                {label}
            </span>
        </div>
    );
}

function GoalsCard({ goals }: { goals: ClientResponse["goals"] }) {
    if (goals.length === 0) return null;
    return (
        <Card padding={20}>
            <h3
                style={{
                    margin: "0 0 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--fg-3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                }}
            >
                Goals (Q2)
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {goals.map((g, i) => (
                    <Goal key={i} label={g.label} pct={g.pct} />
                ))}
            </div>
        </Card>
    );
}

function Goal({ label, pct }: { label: string; pct: number }) {
    const done = pct === 100;
    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 8,
                    fontSize: 13,
                    color: done ? "var(--fg-3)" : "var(--fg-1)",
                    textDecoration: done ? "line-through" : "none",
                    marginBottom: 6,
                    lineHeight: 1.35,
                }}
            >
                <span style={{ minWidth: 0 }}>{label}</span>
                <span
                    style={{
                        flexShrink: 0,
                        fontVariantNumeric: "tabular-nums",
                        color: "var(--fg-3)",
                        fontSize: 11,
                    }}
                >
                    {pct}%
                </span>
            </div>
            <div style={{ height: 4, borderRadius: 9999, background: "var(--surface-2)", overflow: "hidden" }}>
                <div
                    style={{
                        width: `${pct}%`,
                        height: "100%",
                        background: done ? "#10b981" : "var(--color-primary)",
                    }}
                />
            </div>
        </div>
    );
}

function FilesCardPreview({ files }: { files: ClientFile[] }) {
    if (files.length === 0) return null;
    return (
        <Card padding={20}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                }}
            >
                <h3
                    style={{
                        margin: 0,
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--fg-3)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                    }}
                >
                    Files
                </h3>
                <LinkButton>All {files.length} →</LinkButton>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {files.slice(0, 3).map((f) => (
                    <FileRow key={f.name} name={f.name} meta={f.meta} icon={FILE_ICON[f.kind]} />
                ))}
            </div>
        </Card>
    );
}

function FileRow({ name, meta, icon: Icon }: { name: string; meta: string; icon: LucideIcon }) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                borderRadius: 8,
                cursor: "pointer",
                transition: "all 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
            <div
                style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
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
            <div style={{ minWidth: 0, flex: 1 }}>
                <p
                    style={{
                        margin: 0,
                        fontSize: 13,
                        fontWeight: 500,
                        color: "var(--fg-1)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {name}
                </p>
                <p
                    style={{
                        margin: "1px 0 0",
                        fontSize: 11.5,
                        color: "var(--fg-3)",
                        fontVariantNumeric: "tabular-nums",
                    }}
                >
                    {meta}
                </p>
            </div>
            <Download size={14} color="var(--fg-3)" />
        </div>
    );
}

function NotesTab({ pinned, all }: { pinned: ClientNote[]; all: ClientNote[] }) {
    return (
        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "1fr" }}>
            <PinnedNotes notes={pinned} totalNotes={all.length} />
            <Card padding={22}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 14,
                    }}
                >
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>All notes</h3>
                    <FButton compact leadingIcon={Plus}>
                        Add note
                    </FButton>
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                    {all.map((n, i) => (
                        <NoteBlock key={i} date={n.date} body={n.body} tags={n.tags} />
                    ))}
                </div>
            </Card>
        </div>
    );
}

function FilesTab({ files }: { files: ClientFile[] }) {
    return (
        <Card padding={22}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 14,
                }}
            >
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>All files</h3>
                <FButton compact leadingIcon={Upload}>
                    Upload
                </FButton>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {files.map((f) => (
                    <FileRow key={f.name} name={f.name} meta={f.meta} icon={FILE_ICON[f.kind]} />
                ))}
            </div>
        </Card>
    );
}

function NewClientView({ client }: { client: ClientResponse }) {
    const router = useRouter();
    return (
        <>
            <Card padding={24} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                    <Avatar name={client.name} size={72} />
                    <div style={{ flex: 1, minWidth: 220 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em" }}>
                                {client.name}
                            </h1>
                            <Chip tone="primary" icon={Sparkles}>
                                New
                            </Chip>
                        </div>
                        <p style={{ margin: "6px 0 0", color: "var(--fg-3)", fontSize: 14 }}>{client.blurb}</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <FButton leadingIcon={CalendarPlus} onClick={() => router.push("/schedule")}>
                            Schedule first session
                        </FButton>
                        <FButton variant="secondary" compact leadingIcon={Mail}>
                            Send intro email
                        </FButton>
                    </div>
                </div>
            </Card>

            <Card padding={48} style={{ textAlign: "center" }}>
                <div
                    style={{
                        width: 56,
                        height: 56,
                        borderRadius: 9999,
                        margin: "0 auto 18px",
                        background: "var(--color-primary-soft)",
                        color: "var(--color-primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <CalendarClock size={24} />
                </div>
                <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 600, letterSpacing: "-0.01em" }}>
                    No sessions yet 🎉
                </h2>
                <p
                    style={{
                        margin: "0 auto",
                        maxWidth: 420,
                        fontSize: 14,
                        color: "var(--fg-3)",
                        lineHeight: 1.5,
                    }}
                >
                    Once you and {client.name.split(" ")[0]} have a session, history, notes and files will collect here
                    automatically.
                </p>
                <div
                    style={{
                        marginTop: 22,
                        display: "flex",
                        justifyContent: "center",
                        gap: 10,
                        flexWrap: "wrap",
                    }}
                >
                    <FButton leadingIcon={CalendarPlus} onClick={() => router.push("/schedule")}>
                        Schedule a session
                    </FButton>
                    <FButton variant="secondary" leadingIcon={LinkIcon}>
                        Copy booking link
                    </FButton>
                </div>
            </Card>
        </>
    );
}

function LinkButton({ children }: { children: React.ReactNode }) {
    return (
        <button
            style={{
                background: "transparent",
                border: 0,
                color: "var(--color-primary)",
                fontSize: 12.5,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
            }}
        >
            {children}
        </button>
    );
}
