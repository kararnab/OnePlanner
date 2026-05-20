"use client";

import { Suspense } from "react";
import EndedClient from "./EndedClient";

export default function MeetingEndedPage() {
    return (
        <Suspense fallback={<div style={{ width: "100vw", height: "100vh", background: "var(--background)" }} />}>
            <EndedClient />
        </Suspense>
    );
}
