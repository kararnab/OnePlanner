import { mockDashboard, mockLogin, mockRefresh } from "../mock/authMock";
import createRoomJson from "./meeting-create.json";
import type { HttpResponse } from "../api.types";
import type { ApiError } from "../api.types";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const mockAdapter = {
    async get<T = unknown>(url: string): Promise<HttpResponse<T>> {
        const randomDelay = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
        await delay(randomDelay);

        if (url === "/meeting/create") {
            return {
                data: createRoomJson as T,
                status: 200,
            };
        }

        if (url === "/dashboard") {
            const data = await mockDashboard();
            return {
                data: data as T,
                status: 200,
            };
        }

        throw new Error(`Mock GET not implemented: ${url}`);
    },

    async post<T = unknown>(url: string, body?: unknown): Promise<HttpResponse<T>> {
        await delay(400);

        // ✅ REAL LOGIN LOGIC (200 / 401)
        if (url === "/auth/login") {
            const { email, password } = body as {
                email?: string;
                password?: string;
            };

            if (email === "test@example.com" && password === "123456") {
                const data = await mockLogin();

                return {
                    data: data as T,
                    status: 200,
                };
            }

            // ❌ INVALID CREDENTIALS → THROW 401 (AXIOS STYLE)
            const error: ApiError = {
                status: 401,
                message: "Invalid email or password",
            };

            throw error;
        }

        // ✅ REFRESH TOKEN
        if (url === "/auth/refresh") {
            const data = await mockRefresh(
                body as { refreshToken: string }
            );

            return {
                data: data as T,
                status: 200,
            };
        }

        throw new Error(`Mock POST not implemented: ${url}`);
    },
};

export default mockAdapter;
