"use client";

export default function InsightsCard() {
    return (
        <div className="op-card p-6">
            <h3 className="op-card-title" style={{ marginBottom: 22 }}>
                Insights
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                <Stat label={<>Number of meetings<br />you hosted this week</>} value={8} />
                <Stat label={<>Number of meetings<br />you joined this week</>} value={16} />
            </div>
        </div>
    );
}

function Stat({ label, value }: { label: React.ReactNode; value: number }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="op-fg-2" style={{ fontSize: 13.5, lineHeight: 1.4 }}>{label}</div>
            <div
                className="numeric"
                style={{
                    color: "var(--color-primary)",
                    fontSize: 30,
                    fontWeight: 700,
                    lineHeight: 1,
                }}
            >
                {value}
            </div>
        </div>
    );
}
