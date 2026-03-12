const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getHeaders(): Record<string, string> {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("ciq-jwt");
        if (token) headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
}

const api = {
    get: (url: string) => fetch(`${API_BASE}${url}`, { headers: getHeaders() }),
    post: (url: string, data?: unknown) => fetch(`${API_BASE}${url}`, { method: "POST", headers: getHeaders(), body: JSON.stringify(data) }),
    put: (url: string, data?: unknown) => fetch(`${API_BASE}${url}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(data) }),
    delete: (url: string) => fetch(`${API_BASE}${url}`, { method: "DELETE", headers: getHeaders() }),
};

export default api;
