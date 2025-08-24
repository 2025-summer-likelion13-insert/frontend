// src/lib/api.js
const guessBase =
  (typeof window !== "undefined" && window.location.hostname !== "localhost")
    ? "https://insert-back.duckdns.org"
    : "http://localhost:8080";

const rawBase =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE) ||
  process.env.REACT_APP_API_BASE ||
  guessBase;

  // lib/api.js 안 또는 Home.jsx 상단에 함께
const asArray = (d) => {
  if (Array.isArray(d)) return d;
  if (!d || typeof d !== 'object') return [];
  // 서버가 {data:[…]}, {list:[…]}, {items:[…]}, {content:[…]} 등으로 줄 때 대비
  return d.data || d.list || d.items || d.content || [];
};

export const API_BASE =
  process.env.REACT_APP_API_BASE || "https://insert-back.duckdns.org";

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
