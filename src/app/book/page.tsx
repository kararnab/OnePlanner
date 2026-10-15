"use client";

import { Suspense } from "react";
import BookClient from "./BookClient";

export default function BookPage() {
    return (
        <Suspense fallback={<div style={{ width: "100vw", height: "100vh", background: "var(--background)" }} />}>
            <BookClient />
        </Suspense>
    );
}
