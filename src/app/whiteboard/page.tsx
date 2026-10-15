"use client";

import { Suspense } from "react";
import WhiteboardClient from "./WhiteboardClient";

export default function WhiteboardPage() {
    return (
        <Suspense fallback={<div style={{ width: "100vw", height: "100vh", background: "var(--background)" }} />}>
            <WhiteboardClient />
        </Suspense>
    );
}
