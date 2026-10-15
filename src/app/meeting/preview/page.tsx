"use client";

import { Suspense } from "react";
import PreviewClient from "./PreviewClient";

export default function MeetingPreviewPage() {
    return (
        <Suspense fallback={<div style={{ width: "100vw", height: "100vh", background: "var(--background)" }} />}>
            <PreviewClient />
        </Suspense>
    );
}
