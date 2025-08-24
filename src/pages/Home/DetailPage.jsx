// src/pages/DetailPage.jsx
import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { Icon } from '@iconify/react';
import colors from '../../styles/colors';
import Button from '../../components/Button';

// 드래그 한계
const DRAG_MIN = -140; // 위로 최대 140px
const DRAG_MAX = 0;    // 기본 위치

const DetailPage = () => {
  // ★ InformationPage와 동일하게 externalId 사용
  const { externalId } = useParams(); // 라우트: /detail/:externalId 등의 형태
  const navigate = useNavigate();

  // ★ InformationPage와 동일한 API 상태 관리
  const [data, setData] = useState(null);     // 상세 데이터
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // 드래그 상태
  const [offset, setOffset] = useState(0); // translateY 값(px)
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const startOffsetRef = useRef(0);

  // ★ InformationPage와 동일한 API_BASE
  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8080';

  // ★ InformationPage와 동일한 fetch 로직
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // 상세 API 호출: GET /api/performs/by-external/{externalId}
        const res = await fetch(`${API_BASE}/api/performs/by-external/${externalId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
        setErr('상세 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    if (externalId) load();
  }, [externalId, API_BASE]);

  // 날짜 표시 포맷 (InformationPage 동일)
  const dateRange =
    data?.startDate && data?.endDate
      ? `${data.startDate} · ${data.endDate}`
      : data?.startDate || '';

  // 드래그 유틸
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  const onPointerDown = (e) => {
    const y = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    startYRef.current = y;
    startOffsetRef.current = offset;
    setIsDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    const y = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    const dy = y - startYRef.current; // 위로 드래그 시 음수
    const next = clamp(startOffsetRef.current + dy, DRAG_MIN, DRAG_MAX);
    setOffset(next);
  };

  const onPointerUp = () => {
    setIsDragging(false);
    // 필요시 스냅 동작 추가 가능
    // if (offset < DRAG_MIN / 2) setOffset(DRAG_MIN); else setOffset(0);
  };

  // ★ 로딩/에러/빈 데이터 처리 (InformationPage 동일 UX)
  if (loading) return <Center>불러오는 중…</Center>;
  if (err) return <Center>{err}</Center>;
  if (!data) return <Center>데이터가 없습니다.</Center>;

  return (
    <Container>
      <GlobalStyle />

      {/* 상단 히어로 영역: 포스터 이미지 사용 */}
      <HeaderWrap>
        <HeaderImage
          src={data.posterUrl || 'https://via.placeholder.com/1200x800?text=No+Image'}
          alt="poster"
        />
        <BackButton onClick={() => navigate(-1)}>
          <Icon icon="fluent:ios-arrow-24-regular" width="24" height="24" style={{ color: '#FFFFFF' }} />
        </BackButton>
      </HeaderWrap>

      {/* 드래그 가능한 카드 */}
      <ContentCard
        style={{ transform: `translateY(${offset}px)` }}
        $isDragging={isDragging}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <DragHandle aria-hidden />

        {/* ★ API 데이터 바인딩 */}
        <Title>{data.title}</Title>
        <SubInfo>
          {/* 날짜 · 공연장 */}
          {dateRange}
          {data.venueName ? ` · ${data.venueName}` : ''}
        </SubInfo>

        <Description>
          {data.synopsis || '소개 정보가 없습니다.'}
        </Description>

        <ActionRow>
          <Button variant="filled" size="medium" onClick={() => navigate(-1)}>
            Go
          </Button>
        </ActionRow>

        <ActionRow>
          <IconGroup>
            <IconButton onClick={() => {/* TODO: 찜 리스트 이동 */}}>
              <Icon icon="material-symbols:star-outline" width="24" height="24" style={{ color: '#000' }} />
              <Label>내가 찜한 리스트</Label>
            </IconButton>
            <IconButton onClick={() => {/* TODO: 평가 이동 */}}>
              <Icon icon="mdi:heart-outline" width="24" height="24" style={{ color: '#000' }} />
              <Label>평가</Label>
            </IconButton>
            <IconButton onClick={() => {/* TODO: 공유 */}}>
              <Icon icon="material-symbols:share-outline" width="24" height="24" style={{ color: '#000' }} />
              <Label>공유</Label>
            </IconButton>
          </IconGroup>
        </ActionRow>

        {/* 리뷰 섹션 (데이터 연동 시 리스트 매핑) */}
        <ReviewSection>
          <ReviewTitle>인서트 리뷰</ReviewTitle>
          {/* 데이터 연동 전 임시 카드 */}
          <ReviewCard>
            <ReviewText>
              <strong>공연장이 넓고 쾌적했어요</strong><br />
              후기 예시입니다. 실제 리뷰 데이터 연결 후 교체하세요.
            </ReviewText>
            <ReviewImages>
              <ReviewImg src="https://images.unsplash.com/photo-1589927986089-35812386d1d3?q=80&w=400&auto=format&fit=crop" />
              <ReviewImg src="https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=400&auto=format&fit=crop" />
            </ReviewImages>
          </ReviewCard>
        </ReviewSection>
      </ContentCard>
    </Container>
  );
};

export default DetailPage;

/* ---------------- Styled Components ---------------- */
// 전역 스타일
const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
    background: ${colors.lightGray};
    color: ${colors.black};
  }
`;

const Container = styled.div`
  max-width: 600px;
  min-width: 360px;
  margin: 0 auto;
`;

const Center = styled.div`
  max-width: 600px;
  min-width: 360px;
  margin: 120px auto;
  text-align: center;
  color: ${colors.gray};
`;

const HeaderWrap = styled.div`
  position: relative;
  width: 100%;
  height: 360px;
  background: #000;
  overflow: hidden;

  @media (min-width: 480px) {
    height: 420px;
  }
`;

const HeaderImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const BackButton = styled.button`
  position: absolute;
  top: 16px;
  left: 12px;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: none;
  outline: none;
  background: rgba(0,0,0,0.35);
  display: grid;
  place-items: center;
  cursor: pointer;
`;

const ContentCard = styled.div`
  position: relative;
  margin-top: -24px;
  background: #fff;
  border-radius: 32px 32px 0 0;
  padding: 20px 16px 40px;
  transition: transform 120ms ease-out;
  touch-action: none;
  box-shadow: 0 -8px 24px rgba(0,0,0,0.06);
  user-select: ${(p) => (p.$isDragging ? 'none' : 'auto')};
`;

const DragHandle = styled.div`
  width: 44px;
  height: 5px;
  border-radius: 999px;
  background: #e5e5e5;
  margin: 8px auto 12px;
`;

const Title = styled.h1`
  font-size: clamp(20px, 5.56vw, 24px);
  margin: 6px 0 8px;
`;

const SubInfo = styled.div`
  color: ${colors.gray};
  font-size: 14px;
  margin-bottom: 16px;
`;

const Description = styled.p`
  white-space: pre-line;
  line-height: 1.6;
  margin: 0 0 16px;
`;

const ActionRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 12px;
  margin: 12px 0 8px;
`;

const IconGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  width: 100%;
  aign-items: flex-start;
`;

const IconButton = styled.button`
  background: #f7f7f7;
  border: 1px solid #eee;
  border-radius: 16px;
  padding: 14px 10px;
  display: grid;
  place-items: center;
  gap: 6px;
  cursor: pointer;
`;

const Label = styled.span`
  font-size: 12px;
  color: #000;
`;

const ReviewSection = styled.section`
  margin-top: 20px;
`;

const ReviewTitle = styled.h2`
  font-size: 18px;
  margin: 0 0 10px;
`;

const ReviewCard = styled.div`
  border: 1px solid #eee;
  border-radius: 16px;
  padding: 12px;
`;

const ReviewText = styled.p`
  margin: 0 0 10px;
  line-height: 1.5;
`;

const ReviewImages = styled.div`
  display: flex;
  gap: 8px;
`;

const ReviewImg = styled.img`
  width: calc(50% - 4px);
  height: 96px;
  object-fit: cover;
  border-radius: 8px;
`;
