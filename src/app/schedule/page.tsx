"use client";

import { Suspense } from "react";
import ScheduleClient from "./ScheduleClient";

export default function SchedulePage() {
    return (
        <Suspense fallback={<div style={{ width: "100vw", height: "100vh", background: "var(--background)" }} />}>
            <ScheduleClient />
        </Suspense>
    );
}
