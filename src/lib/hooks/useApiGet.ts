"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api/api";
import { isApiError } from "@/lib/api/api.types";

export type FetchState<T> = {
    loading: boolean;
    data: T | null;
    error: string;
    errorStatus: number | null;
    retry: () => void;
};

type Resolved<T> = {
    sourceUrl: string;
    sourceTrigger: number;
    data: T | null;
    error: string;
    errorStatus: number | null;
};

const INITIAL: Resolved<unknown> = {
    sourceUrl: "",
    sourceTrigger: -1,
    data: null,
    error: "",
    errorStatus: null,
};

/**
 * Fetch JSON via the app-wide api adapter and expose { loading, data, error, retry }.
 *
 * The "loading" flag is derived from comparing the live (url, trigger) against
 * the most recently resolved fetch — so we never call setState synchronously
 * in the effect body. All setState calls happen inside the promise callback,
 * which the react-hooks/set-state-in-effect rule explicitly allows ("calling
 * setState in a callback function when external state changes").
 */
export function useApiGet<T>(url: string): FetchState<T> {
    const [trigger, setTrigger] = useState(0);
    const [resolved, setResolved] = useState<Resolved<T>>(INITIAL as Resolved<T>);

    useEffect(() => {
        let cancelled = false;
        api
            .get<T>(url)
            .then((res) => {
                if (cancelled) return;
                setResolved({
                    sourceUrl: url,
                    sourceTrigger: trigger,
                    data: res.data,
                    error: "",
                    errorStatus: null,
                });
            })
            .catch((err: unknown) => {
                if (cancelled) return;
                const isApi = isApiError(err);
                setResolved({
                    sourceUrl: url,
                    sourceTrigger: trigger,
                    data: null,
                    error: isApi ? err.message : "Unexpected error",
                    errorStatus: isApi ? err.status : null,
                });
            });
        return () => {
            cancelled = true;
        };
    }, [url, trigger]);

    const loading = resolved.sourceUrl !== url || resolved.sourceTrigger !== trigger;
    const retry = useCallback(() => setTrigger((t) => t + 1), []);

    return {
        loading,
        data: loading ? null : resolved.data,
        error: loading ? "" : resolved.error,
        errorStatus: loading ? null : resolved.errorStatus,
        retry,
    };
}
