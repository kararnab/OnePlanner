"use client";

import { Suspense } from "react";
import SettingsClient from "./SettingsClient";

export default function SettingsPage() {
    return (
        <Suspense fallback={<div style={{ width: "100vw", height: "100vh", background: "var(--background)" }} />}>
            <SettingsClient />
        </Suspense>
    );
}
