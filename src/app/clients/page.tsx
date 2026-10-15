"use client";

import { Suspense } from "react";
import ClientsClient from "./ClientsClient";

export default function ClientsPage() {
    return (
        <Suspense fallback={<div style={{ width: "100vw", height: "100vh", background: "var(--background)" }} />}>
            <ClientsClient />
        </Suspense>
    );
}
