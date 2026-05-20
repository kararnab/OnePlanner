"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const MONTH_YEAR_FMT = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

function startOfMonth(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
}

function daysInMonth(d: Date) {
    return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

function addMonths(d: Date, n: number) {
    return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

function isSameDay(a: Date, b: Date) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

export default function CalendarCard() {
    const [currentMonth, setCurrentMonth] = useState<Date>(() => new Date());

    const today = new Date();
    const monthStart = startOfMonth(currentMonth);
    // Mon-first layout: 0=Mon ... 6=Sun
    const jsDay = monthStart.getDay(); // 0=Sun ... 6=Sat
    const startDay = (jsDay + 6) % 7;
    const total = daysInMonth(currentMonth);

    const days: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= total; i++) days.push(i);

    return (
        <div className="op-card p-6">
            <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                <h3 className="op-card-title">Calendar</h3>

                <div className="flex items-center gap-1">
                    <ChevBtn onClick={() => setCurrentMonth((d) => addMonths(d, -1))} dir="left" />
                    <ChevBtn onClick={() => setCurrentMonth((d) => addMonths(d, 1))} dir="right" />
                </div>
            </div>

            <p style={{ fontSize: 13, color: "var(--fg-3)", margin: "0 0 12px" }}>
                {MONTH_YEAR_FMT.format(currentMonth)}
            </p>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    fontSize: 11,
                    color: "var(--fg-4)",
                    marginBottom: 4,
                }}
            >
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <div key={i} style={{ textAlign: "center", fontWeight: 500 }}>
                        {d}
                    </div>
                ))}
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    fontSize: 13,
                }}
            >
                {days.map((day, i) => {
                    const isToday =
                        day != null &&
                        isSameDay(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day), today);

                    return (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "6px 0",
                            }}
                        >
                            {day ? (
                                <div
                                    style={{
                                        width: 28,
                                        height: 28,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: 9999,
                                        background: isToday ? "var(--color-primary)" : "transparent",
                                        color: isToday
                                            ? "var(--color-primary-foreground)"
                                            : "var(--fg-1)",
                                        fontWeight: isToday ? 600 : 400,
                                        cursor: "pointer",
                                        transition: "background 0.15s",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isToday) e.currentTarget.style.background = "var(--color-primary-soft)";
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isToday) e.currentTarget.style.background = "transparent";
                                    }}
                                >
                                    {day}
                                </div>
                            ) : (
                                <div style={{ width: 28, height: 28 }} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function ChevBtn({ dir, onClick }: { dir: "left" | "right"; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            aria-label={dir === "left" ? "Previous month" : "Next month"}
            style={{
                width: 28,
                height: 28,
                border: 0,
                background: "transparent",
                cursor: "pointer",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--fg-3)",
                transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
            {dir === "left" ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
    );
}
