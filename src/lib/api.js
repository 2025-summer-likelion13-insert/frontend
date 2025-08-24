// src/lib/api.js
const guessBase =
  (typeof window !== "undefined" && window.location.hostname !== "localhost")
    ? "https://insert-back.duckdns.org"
    : "http://localhost:8080";

const rawBase =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE) ||
  process.env.REACT_APP_API_BASE ||
  guessBase;

// 🔒 배포 환경에서 rawBase가 실수로 localhost면 강제로 교체
export const API_BASE =
  (typeof window !== "undefined" && window.location.hostname !== "localhost" && /localhost|127\.0\.0\.1/.test(rawBase))
    ? "https://insert-back.duckdns.org"
    : rawBase;

export async function api(path, opts = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(opts.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(url, { ...opts, headers, credentials: "include" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`[${res.status}] ${url} :: ${text}`);
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

if (typeof window !== "undefined") console.log("[API_BASE]", API_BASE);
