import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api, API_BASE } from '../../lib/api'; 

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);

  // 검색 API 호출
  /*
  const API_BASE = process.env.REACT_APP_API_BASE;
  const fetchSearchResults = async () => {
    try {
      const params = new URLSearchParams({ q: query, limit: '50' });
      const res = await fetch(`${API_BASE}/api/performs/fixed/search?${params.toString()}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error('검색 실패:', error);
      setResults([]);
    }
  };
*/
const fetchSearchResults = async (q) => {
  try {
    if (!q?.trim()) return setResults([]);
    const qs = new URLSearchParams({ q: q.trim(), limit: '50' });
    const url = `${API_BASE}/api/performs/fixed/search?${qs}`; // ← 절대 URL
    //const data = await api(url);
    const data = await api(`${API_BASE}/api/performs/fixed/search?${qs}`);
    setResults(Array.isArray(data) ? data : []);
    console.log('[SearchPage] API_BASE =', API_BASE);

  } catch (e) {
    console.error('검색 실패:', e);
    setResults([]);
  }
};

  useEffect(() => {
    const q = (searchParams.get('q') || '').trim();
    if (q) { fetchSearchResults(q); }
    else { setResults([]); }
  }, [searchParams]); // URL ?q= 변경될 때마다 검색 실행

/*
  const handleSearch = () => {
  if (query.trim()) {
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  }
};
*/

const handleKeyDown = (e) => {
  if (e.key === 'Enter') {
    const q = query.trim();
    setSearchParams(q ? { q } : {}); // URL 갱신 → useEffect에서 fetch 실행
  }
};

  return (
    <Container>
      <TopBar>
        <BackIcon
          icon="fluent:ios-arrow-24-regular"
          onClick={() => navigate(-1)}
          role="button"
          aria-label="뒤로가기"
        />

        <InputWrap>
          <SearchInput
            placeholder="검색창"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <InputIcon icon="mingcute:search-line" />
        </InputWrap>
      </TopBar>

      {/* 검색 결과 출력 */}
      <ResultList>
        {results.map((item) => (
          <ResultItem key={item.externalId}>
             <Poster
                src={imgUrl(item.posterUrl)}
                alt={item.title}
                onError={(e)=>{ e.currentTarget.src = '/default.jpg'; }}
            />
            <Title>{item.title}</Title>
          </ResultItem>
        ))}
      </ResultList>
    </Container>
  );
}

const imgUrl = (src) => {
  if (!src) return "";
  if (/^https?:\/\//i.test(src)) return src;
  // 앞에 슬래시가 없어도 안전하게 붙여줌
  const path = src.startsWith("/") ? src : `/${src}`;
  return `${API_BASE}${path}`;
};

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 0 16px;
  background: #fff;
  height: 100vh;
  font-family: 'Pretendard', sans-serif;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  margin-top: 40px;
  gap: 8px;
`;

const BackIcon = styled(Icon)`
  font-size: 24px;
  cursor: pointer;
`;

const InputWrap = styled.div`
  position: relative;
  flex: 1;
`;

const SearchInput = styled.input`
  width: 85%;
  height: 36px;
  border: none;
  border-radius: 6px;
  padding: 0 12px 0 36px;
  background: #f1f1f1;
  font-size: 14px;
  color: #000;
  outline: none;
`;

const InputIcon = styled(Icon)`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  font-size: 18px;
  color: #000;
`;

// 결과 리스트
const ResultList = styled.ul`
  margin-top: 24px;
  padding: 0;
  list-style: none;
`;

const ResultItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const Poster = styled.img`
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
`;

const Title = styled.span`
  font-size: 15px;
  color: #111;
`;
