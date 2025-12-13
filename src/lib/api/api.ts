import mockAdapter from "./mock/mockAdapter";
import fetchAdapter from "./fetchAdapter";
import type { HttpResponse } from "./api.types";

const useMock = process.env.NEXT_PUBLIC_USE_MOCK === "true";

type Adapter = {
    get<T = unknown>(url: string): Promise<HttpResponse<T>>;
    post<T = unknown>(url: string, body?: unknown): Promise<HttpResponse<T>>;
};

const adapter: Adapter = (useMock ? mockAdapter : fetchAdapter) as Adapter;

/**
 * Public API wrapper.
 * - Request body is always `unknown` (NOT validated here)
 * - Response is generic and fully typed
 */
export const api = {
    get<T = unknown>(url: string): Promise<HttpResponse<T>> {
        return adapter.get<T>(url);
    },

    post<T = unknown>(url: string, body?: unknown): Promise<HttpResponse<T>> {
        return adapter.post<T>(url, body);
    },
};

export default api;
