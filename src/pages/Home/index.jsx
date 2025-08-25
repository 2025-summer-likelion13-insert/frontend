import { api, API_BASE } from "../../lib/api";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';

import TabNavigation from '../../components/TabNavigation';
import ReviewPopup from '../../pages/Home/ReviewPopup';
import MyReviewPage from "../MyPage/MyReviewPage";

import styled, { createGlobalStyle } from "styled-components";
import colors from '../../styles/colors';
import homeMainImage from '../../assets/homemain.png';
import cardImage1 from '../../assets/cardImage1.png';
import cardImage2 from '../../assets/cardImage2.png';
import cardImage3 from '../../assets/cardImage3.png';
import cardImage4 from '../../assets/cardImage4.png';
import { Icon } from '@iconify/react';
import Button from '../../components/Button';

const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; }
  html, body, #root { height: 100%; }
  body {
    margin: 0;
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans KR", "Apple SD Gothic Neo", Arial, sans-serif;
    background: #ffffff;
    color: #111;
  }
`;

const imgUrl = (src) => {
  if (!src) return "";
  if (/^https?:\/\//i.test(src)) return src;
  // 앞에 슬래시가 없어도 안전하게 붙여줌
  const path = src.startsWith("/") ? src : `/${src}`;
  return `${API_BASE}${path}`;
};

export default function Home() {
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const [showMyPage, setShowMyPage] = useState(false);  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
/*API데이터*/
  const [top10, setTop10] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState({ top10: false, upcoming: false });
  const [error, setError] = useState(null);

  const [likes, setLikes] = useState({});

const normalize = (arr=[]) => arr.map((it,i)=>({
  id: it.mt20id ?? it.id ?? `tmp-${i}`,
  externalId: it.mt20id ?? it.externalId ?? '',   // ← 홈에서도 꼭 설정
  title: it.prfnm ?? it.title ?? '',
  image: imgUrl(it.poster ?? it.posterUrl ?? it.image ?? ''),
}));

  const getJson = async (path, signal) => {
    // api는 내부에서 `${API_BASE}${path}`를 처리합니다.
    return await api(path, { signal });
  };

  const fetchTop10 = async (signal) => {
    try {
      setLoading((p) => ({ ...p, top10: true }));
      const data = await getJson('/api/performs/fixed/top10', signal);
      setTop10(normalize(Array.isArray(data) ? data : []));
    } catch (e) {
      setError('TOP10 불러오기 실패');
      setTop10([]);
      console.error(e);
    } finally {
      setLoading((p) => ({ ...p, top10: false }));
    }
  };

  const fetchUpcoming = async (signal) => {
    try {
      setLoading((p) => ({ ...p, upcoming: true }));
        const data = await getJson('/api/performs/fixed/upcoming', signal);
        setUpcoming(normalize(Array.isArray(data) ? data : []));
    } catch (e) {
      setError('여름축제 불러오기 실패');
      setUpcoming([]);
      console.error(e);
    } finally {
      setLoading((p) => ({ ...p, upcoming: false }));
    }
  };

  const goHeroDetail = () => {
  // heroItem에서 externalId(우선) → id 순으로 사용
  const id = heroItem?.externalId || heroItem?.id;
  if (!id) { alert('상세 정보를 찾을 수 없어요.'); return; }
  navigate(`/information/${id}`);
};

// 2) 찜 토글
/*
const toggleLike = async (externalId) => {
  if (!externalId) { alert('이 항목은 외부 ID가 없어 찜하기를 지원하지 않습니다.'); return; }
  try {
    const res = await fetch(`/api/likes/perform/${externalId}`, { method: 'PUT' });
    if (!res.ok) throw new Error(`PUT 실패: ${res.status}`);
    const data = await res.json();
    setLikes(prev => ({ ...prev, [externalId]: { liked: data.liked, likeCount: data.likeCount }}));
  } catch (e) { console.error(e); alert('찜하기 실패'); }
};
*/
const toggleLike = async (externalId) => {
  if (!externalId) return alert("외부 ID가 없어 찜하기를 지원하지 않습니다.");
  try {
      console.log("API_BASE:", API_BASE);

    const data = await api(`/api/likes/perform/${encodeURIComponent(externalId)}`, {
      method: "PUT",
      body: JSON.stringify({}),  // ← 일부 서버에서 필수
    });
    setLikes((prev) => ({
      ...prev,
      [externalId]: {
        liked: !!data?.liked,
        likeCount:
          typeof data?.likeCount === "number"
            ? data.likeCount
            : prev[externalId]?.likeCount ?? 0,
      },
    }));
  } catch (e) {
    console.error("찜하기 실패:", e);
    alert(`찜하기 실패: ${e.message || e}`);
  }
};


/** 최초 1회 조회 */
useEffect(() => {
  const ac = new AbortController();
  fetchTop10(ac.signal);
  fetchUpcoming(ac.signal);
  return () => ac.abort();
}, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 50000000000); // 5초 후 팝업 표시
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY.current;
      setHidden(goingDown && y > 80);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const heroItem = (top10[0]) ?? (upcoming[0]) ?? null;
  const heroTitle = heroItem?.title ? String(heroItem.title) : '';
  const [h1, h2] = heroTitle ? heroTitle.split(/\s+/).slice(0,2) : ['',''];

  return (
    <AppWrap>
      <GlobalStyle />

    <TopBar>
      <Brand>
        In<span>Sert</span>
      </Brand>

      <IconButton
        aria-label="search"
        onClick={() => navigate('/search')} 
      >
        <Icon
          icon="mingcute:search-line"
          style={{
            color: '#DF3B1E',
            width: 'clamp(24px, 6.66vw, 40px)',
            height: 'clamp(24px, 6.66vw, 40px)',
          }}
        />
      </IconButton>
    </TopBar>

      <HeroCard>
        <HeroInner>
          <HeroImage src={heroItem?.image || homeMainImage} alt={heroTitle || 'hero'} />
          <HeroShade />
          <HeroContent>
            <HeroTitle>{h1}{h2 && <><br />{h2}</>}</HeroTitle>
            <HeroActions>
              <Button variant="filled" size="medium" onClick={goHeroDetail}>
                <Icon icon="mdi-light:check" width="24" height="24" style={{ color: '#FFFFFF' }} />
                선택하기
              </Button>
              <WhiteButton variant="filled" onClick={()=>navigate('/myreview')}>
                <Icon icon="mdi-light:plus" width="24" height="24" style={{ color: '#000' }} />
                내가 찜한 리스트
              </WhiteButton>
            </HeroActions>
          </HeroContent>
        </HeroInner>
      </HeroCard>

      <SectionTitle>이번 달 Top 10 공연</SectionTitle>
{/* Top10 */}
<CardScrollRow>
  {(top10.length ? top10 : MOCK_EVENTS).slice(0,10).map((ev, index) => {
    const parts = Array.isArray(ev.title) ? ev.title : String(ev.title||'').split(/\s+/).slice(0,2);
    const canLike = Boolean(ev.externalId);            // ← map 내부로 이동
    return (
      <EventCard
        key={ev.id || `${index}`}
        $isFirst={index===0}
        onClick={() => navigate(`/information/${ev.externalId ?? ev.id}`)}
      >
        <Thumb src={ev.image} alt={parts.join('')} />
        <CardShade />
        <CardMeta>
          {parts.length===2 && <TitleTop>{parts[0]}</TitleTop>}
          <BottomRow>
            <TitleBottom>{parts[parts.length===2 ? 1 : 0]}</TitleBottom>
            <IconGroup>
              <LikeIcon
                icon={likes[ev.externalId]?.liked ? "material-symbols:thumb-up-rounded" : "material-symbols:thumb-up-outline"}
                style={{
                  width:'clamp(11px,3.05vw,18px)', height:'clamp(11px,3.05vw,18px)',
                  opacity: canLike ? 1 : 0.35, cursor: canLike ? 'pointer':'not-allowed',
                  pointerEvents: canLike ? 'auto':'none'
                }}
                aria-disabled={!canLike}
                onClick={(e)=>{ e.stopPropagation(); if (canLike) toggleLike(ev.externalId); }}
              />
              <Icon icon="mdi:information-outline" style={{ width:'clamp(11px,3.05vw,18px)', height:'clamp(11px,3.05vw,18px)' }} />
            </IconGroup>
          </BottomRow>
        </CardMeta>
      </EventCard>
    );
  })}
</CardScrollRow>


      <SectionTitle>무더위를 날릴 여름 축제</SectionTitle>
      <CardScrollRow>
        {(upcoming.length ? upcoming : MOCK_EVENTS).slice(0, 10).map((ev, index) => {
          const parts = Array.isArray(ev.title)
          ? ev.title
          : String(ev.title || '').split(/\s+/).slice(0, 2);
          return (
          <EventCard
            key={ev.id || `s-${index}`}
            $isFirst={index === 0}
            /* $isLast={index === MOCK_EVENTS.length - 1}*/
            onClick={() => navigate(`/information/${ev.externalId || ev.id || 0}`)}
          >
            <Thumb src={ev.image} alt={parts.join('')} />
            <CardShade />
            <CardMeta>
              {parts.length === 2 && <TitleTop>{parts[0]}</TitleTop>}
              <BottomRow>
                <TitleBottom>{parts[parts.length === 2 ? 1 : 0]}</TitleBottom>
                <IconGroup>
                   <LikeIcon
                      icon={likes[ev.externalId]?.liked ? "material-symbols:thumb-up-rounded" : "material-symbols:thumb-up-outline"}
                      style={{ width:'clamp(11px,3.05vw,18px)', height:'clamp(11px,3.05vw,18px)', opacity: ev.externalId ? 1 : 0.35, cursor: ev.externalId ? 'pointer':'not-allowed', pointerEvents: ev.externalId ? 'auto':'none' }}
                      aria-disabled={!ev.externalId}
                      onClick={(e)=>{ e.stopPropagation(); if (ev.externalId) toggleLike(ev.externalId); }}
                    />
                  <Icon icon="mdi:information-outline" style={{ color: '#FFFFFF', width: 'clamp(11px, 3.05vw, 18px)', height: 'clamp(11px, 3.05vw, 18px)' }} />
                </IconGroup>
              </BottomRow>
            </CardMeta>
          </EventCard>
        );
      })}
      </CardScrollRow>      

      {showPopup && (
        <ReviewPopup
          onClose={() => setShowPopup(false)}
          onWrite={() => {
            console.log("작성하기 클릭!");
            setShowPopup(false);
          }}
        />
      )}      

      <TabNavigation/>
  
      <BottomSafe />
      <BottomMask/>
    </AppWrap>
  );
}
/*
const AppWrap = styled.main`
  width: 100%;
  max-width: 600px;
  min-height: 100vh;
  margin: 0 auto;
  position: relative;
  background: #fff;
  box-shadow: 0 10px 30px rgba(30, 35, 90, 0.08);
  border-radius: 26px;
  overflow-x: visible;
  overflow-y: hidden;

  @media (max-width: 600px) {
    border-radius: 0;
    box-shadow: none;
  }
`;
*/
const WhiteButton = styled(Button)`
  background-color: #ffffff !important;
  color: #000 !important;
  border: 1px solid #fff;
  gap: clamp(4px, 1.11vw, 6.66px);

  &:hover {
    background-color: #fff !important;
  }
`;


const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px clamp(16px, 4.44vw, 26.66px) 8px;
`;

const Brand = styled.h1`
  margin: 0;
  font-size: 25px;
  letter-spacing: 0.4px;
  color: #df3b1e;
  font-weight: 800;
`;

const IconButton = styled.button`
  border: 0; 
  background: transparent; 
  padding: 6px; 
  cursor: pointer; 
  border-radius: 10px;
  &:active { transform: scale(0.97); }
`;

const HeroCard = styled.section`
  position: relative;
  width: 100%;
  max-width: 600px;
  height: clamp(357px, 99.1vw, 595px);
  margin: 0 auto;
  padding: 0 clamp(16px, 4.44vw, 26.66px); /* 360=16px, 600≈26.66px */
  background: transparent;
`;

 const HeroInner = styled.div`
   position: relative;
   height: 100%;
   border-radius: 16px;
   overflow: hidden;
   background: #fff;
 `;

const HeroImage = styled.img`
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
`;

const HeroShade = styled.div`
  position: absolute; inset: 0; background: linear-gradient(180deg, rgba(5,5,10,0.1) 0%, rgba(5,5,10,0.6) 65%, rgba(5,5,10,0.85) 100%);
`;

const HeroContent = styled.div`
  position: absolute; left: 30px; right: 30px; bottom: 30px; color: #fff;
`;

const HeroTitle = styled.h2`
  margin: 0 0 10px; line-height: 1.22; font-weight: 500; font-size: clamp(24px, 6.66vw, 40px);
`;

const HeroActions = styled.div`
  display: flex; gap: 8px;
`;

const SectionTitle = styled.h3`
  margin: clamp(15px, 4.166vw, 25px) clamp(16px, 4.44vw, 26.66px) clamp(11px, 3.055vw, 18.33px); 
  font-size: clamp(12px, 3.33vw, 20px); color: #000; font-weight: 500;
`;

const TitleTop = styled.div`
  font-size: clamp(10px, 2.77vw, 16px);
  font-weight: 500;
  line-height: 1.2;
  margin-bottom: 0.5%

`;

const TitleBottom = styled.div`
  font-size: clamp(10px, 2.77vw, 16px);
  font-weight: 500;
  line-height: 1.2;
  display: flex;
  align-items: center;
`;

const CardScrollRow = styled.div`
  display: flex;
  overflow-x: auto;
  gap: clamp(6px, 1.66vw, 10px);
  margin-left: clamp(16px, 4.44vw, 26.66px); 
  scroll-snap-type: x mandatory;
  &::-webkit-scrollbar {
  display: none;
  }
`;

const EventCard = styled.article`
  position: relative;
  flex: 0 0 auto;
  width: clamp(104px, 28vw, 160px);
  aspect-ratio: 104 / 148;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  scroll-snap-align: start;
 
`;

const Thumb = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;  /* 가운데 채우기 */
`;

const CardShade = styled.div`
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 80%);
`;

const CardMeta = styled.div`
  position: absolute;
  left: clamp(6px, 1.66vw, 10px); 
  right: clamp(6px, 1.66vw, 10px);
  bottom: clamp(6px, 1.66vw, 10px);
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(6px, 1.66vw, 10px);
  margin-left: clamp(6px, 1.66vw, 10px);
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: clamp(6px, 1.66vw, 10px);
`;

const BottomMask = styled.div`
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 100%;
  max-width: 600px;

  height: 50px;                 
  background: #fff;             
  border-radius: 26px 26px 0 0; 
  z-index: 9;                  
  pointer-events: none;         
`;

const BottomSafe = styled.div`
  height: 82px; /* 탭바 공간 확보 */
`;

const Overlay = styled.button`
  position: fixed;
  inset: 0;
  background: transparent; /* 살짝 어둡게 하려면 rgba(0,0,0,0.08) */
  border: 0;
  z-index: 998;
`;

const AppWrap = styled.main`
  width: 100%;
  max-width: 600px;
  min-height: 100vh;
  margin: 0 auto;
  position: relative;
  background: #fff;
  box-shadow: 0 10px 30px rgba(30, 35, 90, 0.08);
  border-radius: 26px;
  overflow-x: visible;
  overflow-y: hidden;

  @media (max-width: 600px) {
    border-radius: 0;
    box-shadow: none;
  }
`;

const LikeIcon = styled(Icon)`
  transition: transform 0.2s ease;
  cursor: pointer;

  &:active {
    transform: scale(1.3);  /* 클릭 시 살짝 커졌다가 원래대로 */
  }
`;



const MOCK_EVENTS = [
  { id: 1, title: ["칸예", "내한 공연"], image: cardImage1 },
  { id: 2, title: ["펜타포트", "페스티벌"], image: cardImage2 },
  { id: 3, title: ["DEADLINE"], image: cardImage3 },
  { id: 4, title: ["INTO", "THE WISH"], image: cardImage4 },
];
