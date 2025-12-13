const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

const fetchAdapter = {
    async get(url: string): Promise<unknown> {
        const res = await fetch(API_BASE + url);

        if (!res.ok) {
            throw new Error(`GET ${url} failed with status ${res.status}`);
        }

        return await res.json();
    },

    async post(url: string, body?: unknown): Promise<unknown> {
        const res = await fetch(API_BASE + url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            throw new Error(`POST ${url} failed with status ${res.status}`);
        }

        const data = await res.json();
        return data;
    },
};

export default fetchAdapter;
