// src/lib/api.js
// 공용 API 설정과 도우미 함수
export const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080";

/**
 * 공용 fetch 함수
 * - path: "/api/xxx" 같은 상대경로를 넣으면 자동으로 API_BASE를 붙입니다.
 * - options: method, headers, body 등 fetch 옵션
 */
export async function api(path, options = {}) {
  // path가 "http"로 시작하면 그대로, 아니면 API_BASE를 붙임
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;

  const res = await fetch(url, {
    // JSON 보낼 때를 대비해 기본 헤더 설정(필요 시 페이지에서 덮어쓰기 가능)
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  // 응답이 200대가 아니면 에러로 취급
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API Error ${res.status}: ${text || res.statusText}`);
  }

  // JSON 응답이 아닐 수도 있으니 안전하게 처리
  try {
    return await res.json();
  } catch {
    return {};
  }
}
