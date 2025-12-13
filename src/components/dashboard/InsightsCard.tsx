"use client";

export default function InsightsCard() {
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
            <h3 className="font-semibold mb-6">
                Insights
            </h3>

            <div className="space-y-6">
                {/* Hosted */}
                <div className="flex items-center justify-between">
                    <div className="text-sm opacity-80">
                        Number of meetings<br />you hosted this week
                    </div>
                    <div className="text-blue-600 text-3xl font-bold">
                        8
                    </div>
                </div>

                {/* Joined */}
                <div className="flex items-center justify-between">
                    <div className="text-sm opacity-80">
                        Number of meetings<br />you joined this week
                    </div>
                    <div className="text-blue-600 text-3xl font-bold">
                        16
                    </div>
                </div>
            </div>
        </div>
    );
}
