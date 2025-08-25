// src/lib/api.js
export const API_BASE =
  process.env.REACT_APP_API_BASE || "https://insert-back.duckdns.org";

// 단순 쿠키 파서
function getCookie(name) {
  return document.cookie
    .split("; ")
    .find((r) => r.startsWith(name + "="))
    ?.split("=")[1] || "";
}

// 여러 저장소에서 토큰을 탐색
function pickToken() {
  const fromStorage =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("jwt") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("accessToken") ||
    sessionStorage.getItem("jwt") ||
    "";
  const fromCookie =
    getCookie("access_token") || getCookie("access_token_dev") || "";
  const raw = fromStorage || fromCookie;         // 우선순위: storage → cookie
  return raw ? (raw.startsWith("Bearer ") ? raw : `Bearer ${raw}`) : "";
}

export async function api(path, opts = {}) {
  const url = /^https?:\/\//.test(path)
    ? path
    : `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;

  const bearer = pickToken();
  const headers = {
    "Content-Type": "application/json",
    ...(opts.headers || {}),
    ...(bearer ? { Authorization: bearer } : {}),  // ← 여기서 항상 헤더 부착
  };

  const res = await fetch(url, { credentials: "include", ...opts, headers });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

export const api = async (path, opts = {}) => {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};
