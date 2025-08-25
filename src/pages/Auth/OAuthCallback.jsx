// src/pages/Auth/OAuthCallback.jsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE } from "../../lib/api";

export default function OAuthCallback() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      // 1) URL 쿼리에 토큰이 실려 왔으면 저장
      let token = sp.get("token") || sp.get("accessToken") || "";

      // 2) 없으면, 쿠키 인증으로 백엔드에서 토큰 한 번 받아오기(있을 때만)
      if (!token) {
        try {
          const r = await fetch(`${API_BASE}/api/auth/token`, {
            credentials: "include",
          });
          if (r.ok) {
            const d = await r.json().catch(() => ({}));
            token = d.accessToken || d.token || d.jwt || "";
          }
        } catch {}
      }

      // 3) 토큰 저장 (api()가 Authorization 헤더로 자동 부착)
      if (token) localStorage.setItem("token", token);

      navigate("/home", { replace: true });
    })();
  }, [navigate, sp]);

  return null;
}
