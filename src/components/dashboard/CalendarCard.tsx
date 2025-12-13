"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import dayjs from "dayjs";

export default function CalendarCard() {
    const [currentMonth, setCurrentMonth] = useState(dayjs());

    function prevMonth() {
        setCurrentMonth(currentMonth.subtract(1, "month"));
    }

    function nextMonth() {
        setCurrentMonth(currentMonth.add(1, "month"));
    }

    const monthStart = currentMonth.startOf("month");
    const startDay = monthStart.day();
    const daysInMonth = currentMonth.daysInMonth();

    // Build calendar grid
    const days: (number | null)[] = [];

    // Add empty slots for alignment
    for (let i = 0; i < startDay; i++) days.push(null);

    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    return (
        <div
            className="rounded-2xl shadow-sm p-6 border"
            style={{
                background: "var(--color-background)",
                color: "var(--color-foreground)",
                borderColor: "var(--color-border)",
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Calendar</h3>

                <div className="flex items-center gap-2">
                    <button
                        onClick={prevMonth}
                        className="p-1 rounded-md hover:bg-black/5 transition"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <button
                        onClick={nextMonth}
                        className="p-1 rounded-md hover:bg-black/5 transition"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* Month Name */}
            <p className="text-sm mb-3 opacity-70">
                {currentMonth.format("MMMM YYYY")}
            </p>

            {/* Week Row */}
            <div className="grid grid-cols-7 text-xs mb-2 opacity-60">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <div key={i} className="text-center font-medium">
                        {d}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 text-sm">
                {days.map((day, i) => {
                    const isToday =
                        day && currentMonth.date(day).isSame(dayjs(), "day");

                    return (
                        <div
                            key={i}
                            className="flex justify-center items-center py-2"
                        >
                            {day ? (
                                <div
                                    className={`
                    w-7 h-7 flex items-center justify-center rounded-full
                    ${
                                        isToday
                                            ? "bg-blue-600 text-white font-semibold"
                                            : "opacity-90 hover:bg-blue-500/10"
                                    }
                  `}
                                >
                                    {day}
                                </div>
                            ) : (
                                <div className="w-7 h-7" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
