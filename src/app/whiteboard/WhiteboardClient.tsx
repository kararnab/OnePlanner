"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import BrandLogo from "@/components/ui/BrandLogo";
import {
    ArrowLeft,
    Layers,
    Share2,
    MousePointer2,
    Hand,
    Square,
    Circle,
    MoveRight,
    Pencil,
    Type,
    StickyNote,
    Eraser,
    Plus,
    Minus,
    Maximize,
    Cloud,
    PencilRuler,
    type LucideIcon,
} from "lucide-react";
import { Avatar, Chip, FButton, ThemeToggle } from "@/components/flows/Primitives";

const PAGES = [
    { title: "Mind-map" },
    { title: "Goals · Q2" },
    { title: "Tradeoffs" },
    { title: "Action items" },
];

type ToolId =
    | "select"
    | "hand"
    | "rectangle"
    | "ellipse"
    | "arrow"
    | "draw"
    | "text"
    | "sticky"
    | "eraser";

const TOOLS: { id: ToolId; icon: LucideIcon; label: string }[] = [
    { id: "select", icon: MousePointer2, label: "Select" },
    { id: "hand", icon: Hand, label: "Pan" },
    { id: "rectangle", icon: Square, label: "Rectangle" },
    { id: "ellipse", icon: Circle, label: "Ellipse" },
    { id: "arrow", icon: MoveRight, label: "Arrow" },
    { id: "draw", icon: Pencil, label: "Draw" },
    { id: "text", icon: Type, label: "Text" },
    { id: "sticky", icon: StickyNote, label: "Sticky" },
    { id: "eraser", icon: Eraser, label: "Eraser" },
];

export default function WhiteboardClient() {
    const router = useRouter();
    const params = useSearchParams();
    const isEmpty = params.get("state") === "empty";

    const [activePage, setActivePage] = useState(0);
    const [tool, setTool] = useState<ToolId>("select");

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
            <TopBar onBack={() => router.push("/dashboard")} />

            <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
                <Filmstrip active={activePage} onSelect={setActivePage} />
                <div style={{ flex: 1, minWidth: 0, position: "relative", overflow: "hidden" }}>
                    <Toolbar tool={tool} onToolChange={setTool} />
                    {isEmpty ? <EmptyCanvas /> : <Canvas page={activePage} />}
                    <PresenceBar />
                    <ZoomControls />
                    <StatusPill />
                </div>
            </div>
        </div>
    );
}

function TopBar({ onBack }: { onBack: () => void }) {
    return (
        <header
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 16px",
                borderBottom: "1px solid var(--color-border)",
                background: "var(--surface)",
                flexShrink: 0,
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <button
                    onClick={onBack}
                    aria-label="Back"
                    style={{
                        background: "transparent",
                        border: 0,
                        padding: 8,
                        borderRadius: 8,
                        cursor: "pointer",
                        color: "var(--fg-2)",
                        display: "inline-flex",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                    <ArrowLeft size={18} />
                </button>
                <Link href="/dashboard" style={{ display: "inline-flex" }}>
                    <BrandLogo width={56} priority />
                </Link>
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <Layers size={14} color="var(--fg-3)" />
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "var(--fg-1)" }}>
                        Marcus · career mind-map
                    </p>
                    <Chip tone="success" size="sm">
                        Synced
                    </Chip>
                </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <FButton variant="secondary" compact leadingIcon={Share2}>
                    Share
                </FButton>
                <ThemeToggle />
            </div>
        </header>
    );
}

function Filmstrip({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
    return (
        <aside
            style={{
                width: 110,
                borderRight: "1px solid var(--color-border)",
                background: "var(--surface)",
                padding: 10,
                overflowY: "auto",
                flexShrink: 0,
            }}
            className="hidden sm:block"
        >
            <p
                style={{
                    margin: "4px 6px 10px",
                    fontSize: 10,
                    fontWeight: 600,
                    color: "var(--fg-3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                }}
            >
                Pages
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {PAGES.map((p, i) => (
                    <PageThumb
                        key={i}
                        index={i}
                        title={p.title}
                        active={i === active}
                        onClick={() => onSelect(i)}
                    />
                ))}
                <button
                    style={{
                        border: "1px dashed var(--color-border-strong)",
                        background: "transparent",
                        borderRadius: 8,
                        padding: "10px 6px",
                        color: "var(--fg-3)",
                        fontFamily: "inherit",
                        fontSize: 11,
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 4,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                    <Plus size={14} />
                    Add page
                </button>
            </div>
        </aside>
    );
}

function PageThumb({
    index,
    title,
    active,
    onClick,
}: {
    index: number;
    title: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            style={{
                width: "100%",
                border: `1px solid ${active ? "var(--color-primary)" : "var(--color-border)"}`,
                borderRadius: 8,
                background: "var(--surface)",
                padding: 0,
                cursor: "pointer",
                boxShadow: active ? "0 0 0 3px var(--color-primary-ring)" : "none",
                fontFamily: "inherit",
                transition: "all 0.15s",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    height: 64,
                    background: "var(--surface-2)",
                    borderBottom: "1px solid var(--color-border)",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <MiniSketch index={index} />
            </div>
            <div style={{ padding: "5px 6px", textAlign: "left" }}>
                <p
                    style={{
                        margin: 0,
                        fontSize: 11,
                        fontWeight: 500,
                        color: active ? "var(--color-primary)" : "var(--fg-1)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {index + 1}. {title}
                </p>
            </div>
        </button>
    );
}

function MiniSketch({ index }: { index: number }) {
    if (index === 0) {
        return (
            <svg viewBox="0 0 100 64" style={{ width: "100%", height: "100%" }}>
                <circle cx="50" cy="32" r="9" fill="rgba(96,165,250,0.30)" stroke="var(--color-primary)" strokeWidth="1.5" />
                <rect x="10" y="12" width="20" height="12" rx="3" fill="var(--surface)" stroke="var(--color-border-strong)" strokeWidth="1" />
                <rect x="72" y="14" width="20" height="12" rx="3" fill="var(--surface)" stroke="var(--color-border-strong)" strokeWidth="1" />
                <rect x="22" y="46" width="20" height="12" rx="3" fill="var(--surface)" stroke="var(--color-border-strong)" strokeWidth="1" />
                <rect x="62" y="46" width="20" height="12" rx="3" fill="var(--surface)" stroke="var(--color-border-strong)" strokeWidth="1" />
                <line x1="30" y1="22" x2="42" y2="28" stroke="var(--fg-3)" strokeWidth="1" />
                <line x1="58" y1="28" x2="72" y2="22" stroke="var(--fg-3)" strokeWidth="1" />
                <line x1="32" y1="46" x2="44" y2="38" stroke="var(--fg-3)" strokeWidth="1" />
                <line x1="56" y1="38" x2="68" y2="46" stroke="var(--fg-3)" strokeWidth="1" />
            </svg>
        );
    }
    if (index === 1) {
        return (
            <svg viewBox="0 0 100 64" style={{ width: "100%", height: "100%" }}>
                {[12, 24, 36, 48].map((y, i) => (
                    <g key={i}>
                        <rect
                            x="8"
                            y={y - 2}
                            width="3"
                            height="3"
                            rx="0.5"
                            fill={i < 2 ? "var(--color-primary)" : "var(--color-border-strong)"}
                        />
                        <rect x="16" y={y - 2} width={50 + i * 8} height="3" rx="1" fill="var(--color-border-strong)" />
                    </g>
                ))}
            </svg>
        );
    }
    if (index === 2) {
        return (
            <svg viewBox="0 0 100 64" style={{ width: "100%", height: "100%" }}>
                <rect x="10" y="8" width="36" height="48" rx="3" fill="rgba(245,158,11,0.18)" stroke="#f59e0b" strokeWidth="1" />
                <rect x="54" y="8" width="36" height="48" rx="3" fill="rgba(16,185,129,0.16)" stroke="#10b981" strokeWidth="1" />
                <line x1="12" y1="16" x2="44" y2="16" stroke="#b45309" strokeWidth="1" opacity="0.4" />
                <line x1="12" y1="22" x2="40" y2="22" stroke="#b45309" strokeWidth="1" opacity="0.4" />
                <line x1="56" y1="16" x2="88" y2="16" stroke="#059669" strokeWidth="1" opacity="0.4" />
                <line x1="56" y1="22" x2="84" y2="22" stroke="#059669" strokeWidth="1" opacity="0.4" />
            </svg>
        );
    }
    return (
        <svg viewBox="0 0 100 64" style={{ width: "100%", height: "100%" }}>
            {[10, 22, 34, 46].map((y, i) => (
                <g key={i}>
                    <circle
                        cx="14"
                        cy={y + 2}
                        r="2.5"
                        fill={i === 1 ? "var(--color-primary)" : "var(--surface)"}
                        stroke="var(--fg-3)"
                        strokeWidth="1"
                    />
                    <rect x="22" y={y} width={48 + i * 4} height="3" rx="1" fill="var(--color-border-strong)" />
                </g>
            ))}
        </svg>
    );
}

function Toolbar({ tool, onToolChange }: { tool: ToolId; onToolChange: (t: ToolId) => void }) {
    return (
        <div
            style={{
                position: "absolute",
                top: 16,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10,
                display: "flex",
                gap: 2,
                padding: 6,
                background: "var(--surface)",
                border: "1px solid var(--color-border)",
                borderRadius: 12,
                boxShadow: "var(--shadow-sm)",
            }}
        >
            {TOOLS.map((t) => {
                const active = t.id === tool;
                const Icon = t.icon;
                return (
                    <button
                        key={t.id}
                        onClick={() => onToolChange(t.id)}
                        title={t.label}
                        style={{
                            width: 34,
                            height: 34,
                            border: 0,
                            borderRadius: 8,
                            background: active ? "var(--color-primary-soft)" : "transparent",
                            color: active ? "var(--color-primary)" : "var(--fg-2)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                            if (!active) e.currentTarget.style.background = "var(--surface-2)";
                        }}
                        onMouseLeave={(e) => {
                            if (!active) e.currentTarget.style.background = "transparent";
                        }}
                    >
                        <Icon size={17} />
                    </button>
                );
            })}
        </div>
    );
}

function Canvas({ page }: { page: number }) {
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                background: "var(--background)",
                position: "absolute",
                inset: 0,
                backgroundImage: `
                    radial-gradient(circle, var(--color-border) 1px, transparent 1px),
                    radial-gradient(circle, var(--color-border) 1px, transparent 1px)
                `,
                backgroundSize: "32px 32px, 32px 32px",
                backgroundPosition: "0 0, 16px 16px",
                overflow: "hidden",
            }}
        >
            <svg
                viewBox="0 0 1200 720"
                preserveAspectRatio="xMidYMid meet"
                style={{ width: "100%", height: "100%", display: "block" }}
            >
                {page === 0 && <PageMindMap />}
                {page === 1 && <PageGoals />}
                {page === 2 && <PageTradeoffs />}
                {page === 3 && <PageActions />}
            </svg>
        </div>
    );
}

const HAND_STROKE: React.SVGProps<SVGGElement> = {
    strokeLinejoin: "round",
    strokeLinecap: "round",
};

function PageMindMap() {
    return (
        <g {...HAND_STROKE}>
            <rect
                x="500"
                y="320"
                width="200"
                height="80"
                rx="14"
                fill="var(--color-primary-soft)"
                stroke="var(--color-primary)"
                strokeWidth="2.5"
            />
            <text x="600" y="365" textAnchor="middle" fontSize="20" fontWeight="600" fill="var(--color-primary)">
                IC ↔ Manager
            </text>

            <line x1="500" y1="345" x2="320" y2="180" stroke="var(--fg-3)" strokeWidth="2" />
            <Sticky x={160} y={120} w={220} h={120} fill="rgba(96,165,250,0.16)" stroke="var(--color-primary)" title="Stay IC" body={["Ship the planning loop.", "Push for staff scope.", "Less reactive work."]} />

            <line x1="500" y1="380" x2="320" y2="560" stroke="var(--fg-3)" strokeWidth="2" />
            <Sticky x={160} y={500} w={220} h={140} fill="rgba(245,158,11,0.18)" stroke="#b45309" title="Risks" body={["No staff role for 6mo.", "Backlog of mentoring.", "Boss leaves restructure."]} />

            <line x1="700" y1="345" x2="880" y2="180" stroke="var(--fg-3)" strokeWidth="2" />
            <Sticky x={840} y={120} w={220} h={140} fill="rgba(16,185,129,0.16)" stroke="#059669" title="Take manager role" body={["Hire senior IC.", "Build planning rhythm.", "Bigger team next year."]} />

            <line x1="700" y1="380" x2="880" y2="560" stroke="var(--fg-3)" strokeWidth="2" />
            <Sticky x={840} y={500} w={220} h={120} fill="rgba(234,67,53,0.14)" stroke="var(--color-danger)" title="Risks" body={["Lose coding time.", "Performance reviews.", "Less control over output."]} />

            <Annotation x={460} y={250} w={140} text="3 quarter commit" rotate={-3} />
            <Annotation x={620} y={250} w={140} text="2 weeks to decide" rotate={3} fill="rgba(245,158,11,0.16)" stroke="#b45309" />
        </g>
    );
}

function Sticky({
    x,
    y,
    w,
    h,
    fill,
    stroke,
    title,
    body,
}: {
    x: number;
    y: number;
    w: number;
    h: number;
    fill: string;
    stroke: string;
    title: string;
    body: string[];
}) {
    return (
        <g>
            <rect x={x} y={y} width={w} height={h} rx={10} fill={fill} stroke={stroke} strokeWidth="2" />
            <text x={x + 16} y={y + 28} fontSize="16" fontWeight="600" fill="var(--fg-1)">
                {title}
            </text>
            {body.map((line, i) => (
                <text key={i} x={x + 16} y={y + 50 + i * 22} fontSize="13" fill="var(--fg-2)">
                    • {line}
                </text>
            ))}
        </g>
    );
}

function Annotation({
    x,
    y,
    w,
    text,
    rotate = 0,
    fill = "rgba(96,165,250,0.18)",
    stroke = "var(--color-primary)",
}: {
    x: number;
    y: number;
    w: number;
    text: string;
    rotate?: number;
    fill?: string;
    stroke?: string;
}) {
    return (
        <g transform={`rotate(${rotate}, ${x + w / 2}, ${y})`}>
            <rect
                x={x}
                y={y - 18}
                width={w}
                height={26}
                rx={13}
                fill={fill}
                stroke={stroke}
                strokeDasharray="4 3"
                strokeWidth="1.5"
            />
            <text x={x + w / 2} y={y} textAnchor="middle" fontSize="12" fill={stroke}>
                {text}
            </text>
        </g>
    );
}

function PageGoals() {
    const goals = [
        { txt: "Ship planning loop revamp", done: false },
        { txt: "Hire 1 senior IC", done: false },
        { txt: "Run planning retro w/ leads", done: true },
        { txt: "Lock career direction by end of June", done: false },
    ];
    return (
        <g {...HAND_STROKE}>
            <text x="100" y="100" fontSize="28" fontWeight="700" fill="var(--fg-1)">
                Q2 Goals
            </text>
            <line x1="100" y1="118" x2="260" y2="118" stroke="var(--color-primary)" strokeWidth="3" />
            {goals.map((g, i) => (
                <g key={i} transform={`translate(100, ${180 + i * 84})`}>
                    <rect
                        x="0"
                        y="0"
                        width="36"
                        height="36"
                        rx="6"
                        fill={g.done ? "rgba(16,185,129,0.18)" : "transparent"}
                        stroke={g.done ? "#059669" : "var(--fg-3)"}
                        strokeWidth="2"
                    />
                    {g.done && <path d="M 8 18 L 16 26 L 28 12" fill="none" stroke="#059669" strokeWidth="3" />}
                    <text
                        x="56"
                        y="26"
                        fontSize="20"
                        fill={g.done ? "var(--fg-3)" : "var(--fg-1)"}
                        textDecoration={g.done ? "line-through" : "none"}
                    >
                        {g.txt}
                    </text>
                </g>
            ))}
        </g>
    );
}

function PageTradeoffs() {
    return (
        <g {...HAND_STROKE}>
            <text x="600" y="80" textAnchor="middle" fontSize="24" fontWeight="700" fill="var(--fg-1)">
                Stay IC vs. take manager role
            </text>
            <rect x="120" y="140" width="430" height="450" rx="14" fill="rgba(96,165,250,0.10)" stroke="var(--color-primary)" strokeWidth="2" />
            <rect x="650" y="140" width="430" height="450" rx="14" fill="rgba(16,185,129,0.10)" stroke="#059669" strokeWidth="2" />
            <text x="335" y="180" textAnchor="middle" fontSize="20" fontWeight="600" fill="var(--color-primary)">
                Stay IC
            </text>
            <text x="865" y="180" textAnchor="middle" fontSize="20" fontWeight="600" fill="#059669">
                Take manager role
            </text>
            {[
                "Deep technical work",
                "Smaller surface area",
                "Optimised flow state",
                "Slower comp curve",
                "No team growth lever",
            ].map((t, i) => (
                <text key={i} x="160" y={230 + i * 56} fontSize="15" fill="var(--fg-1)">
                    • {t}
                </text>
            ))}
            {[
                "Multiply via team",
                "New skill: 1:1 + hiring",
                "Comp ladder bigger",
                "Less hands-on coding",
                "Performance reviews 😅",
            ].map((t, i) => (
                <text key={i} x="690" y={230 + i * 56} fontSize="15" fill="var(--fg-1)">
                    • {t}
                </text>
            ))}
        </g>
    );
}

function PageActions() {
    const items = [
        { who: "Marcus", what: "Write up the staff-IC scoping doc", when: "by 28 May" },
        { who: "Amelia", what: "Send role-clarity worksheet PDF", when: "today" },
        { who: "Marcus", what: "Talk to 2 staff ICs at peer companies", when: "by 14 Jun" },
        { who: "Marcus", what: "Decision call — IC or manager", when: "30 Jun" },
    ];
    return (
        <g {...HAND_STROKE}>
            <text x="100" y="100" fontSize="28" fontWeight="700" fill="var(--fg-1)">
                Action items
            </text>
            <line x1="100" y1="118" x2="320" y2="118" stroke="var(--color-primary)" strokeWidth="3" />
            {items.map((a, i) => (
                <g key={i} transform={`translate(100, ${160 + i * 96})`}>
                    <rect x="0" y="0" width="1000" height="72" rx="12" fill="var(--surface-2)" stroke="var(--color-border)" strokeWidth="1.5" />
                    <rect
                        x="0"
                        y="0"
                        width="6"
                        height="72"
                        fill={a.who === "Amelia" ? "#8b5cf6" : "var(--color-primary)"}
                    />
                    <text
                        x="28"
                        y="32"
                        fontSize="11"
                        fontWeight="600"
                        fill={a.who === "Amelia" ? "#8b5cf6" : "var(--color-primary)"}
                    >
                        {a.who.toUpperCase()}
                    </text>
                    <text x="28" y="56" fontSize="17" fontWeight="500" fill="var(--fg-1)">
                        {a.what}
                    </text>
                    <text x="980" y="44" textAnchor="end" fontSize="13" fill="var(--fg-3)">
                        {a.when}
                    </text>
                </g>
            ))}
        </g>
    );
}

function EmptyCanvas() {
    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
                background: "var(--background)",
                backgroundImage: `radial-gradient(circle, var(--color-border) 1px, transparent 1px)`,
                backgroundSize: "32px 32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div style={{ textAlign: "center", maxWidth: 360, padding: 24 }}>
                <div
                    style={{
                        width: 56,
                        height: 56,
                        borderRadius: 9999,
                        margin: "0 auto 16px",
                        background: "var(--color-primary-soft)",
                        color: "var(--color-primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <PencilRuler size={24} />
                </div>
                <h2 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 600 }}>Empty canvas 🎉</h2>
                <p style={{ margin: 0, fontSize: 14, color: "var(--fg-3)", lineHeight: 1.5 }}>
                    Pick a tool from the top, or paste an image. Everything is auto-saved and shared live with whoever&apos;s
                    in this whiteboard.
                </p>
            </div>
        </div>
    );
}

function PresenceBar() {
    return (
        <div
            style={{
                position: "absolute",
                top: 16,
                right: 16,
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 6px 6px 12px",
                background: "var(--surface)",
                border: "1px solid var(--color-border)",
                borderRadius: 9999,
                boxShadow: "var(--shadow-sm)",
                zIndex: 10,
            }}
        >
            <span style={{ fontSize: 12, color: "var(--fg-3)", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span
                    style={{
                        width: 8,
                        height: 8,
                        borderRadius: 9999,
                        background: "#10b981",
                        boxShadow: "0 0 0 3px rgba(16,185,129,0.20)",
                    }}
                />
                2 here
            </span>
            <div style={{ display: "flex" }}>
                <span style={{ marginLeft: -8 }}>
                    <Avatar name="Amelia Chen" size={28} />
                </span>
                <span style={{ marginLeft: -8 }}>
                    <Avatar name="Marcus Park" size={28} />
                </span>
            </div>
        </div>
    );
}

function ZoomControls() {
    return (
        <div
            style={{
                position: "absolute",
                bottom: 16,
                right: 16,
                display: "flex",
                gap: 4,
                padding: 4,
                background: "var(--surface)",
                border: "1px solid var(--color-border)",
                borderRadius: 12,
                boxShadow: "var(--shadow-sm)",
                zIndex: 10,
                alignItems: "center",
            }}
        >
            <ZBtn icon={Minus} />
            <span
                style={{
                    fontSize: 12,
                    color: "var(--fg-2)",
                    padding: "0 8px",
                    fontVariantNumeric: "tabular-nums",
                    fontWeight: 500,
                }}
            >
                100%
            </span>
            <ZBtn icon={Plus} />
            <span style={{ width: 1, alignSelf: "stretch", background: "var(--color-border)", margin: "0 2px" }} />
            <ZBtn icon={Maximize} />
        </div>
    );
}

function ZBtn({ icon: Icon }: { icon: LucideIcon }) {
    return (
        <button
            style={{
                width: 28,
                height: 28,
                borderRadius: 8,
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

function StatusPill() {
    return (
        <div
            style={{
                position: "absolute",
                bottom: 16,
                left: 16,
                padding: "6px 12px",
                background: "var(--surface)",
                border: "1px solid var(--color-border)",
                borderRadius: 9999,
                fontSize: 11,
                color: "var(--fg-3)",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                boxShadow: "var(--shadow-sm)",
                zIndex: 10,
            }}
        >
            <Cloud size={12} />
            Last edit · 4s ago
        </div>
    );
}
