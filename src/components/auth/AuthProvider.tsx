"use client";

import { useAuthRestore } from "@/lib/hooks/useAuthRestore";
import React from "react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    useAuthRestore();
    return <>{children}</>;
}
