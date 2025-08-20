// src/pages/DetailPage.jsx
import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { Icon } from '@iconify/react';
import colors from '../../styles/colors';
import Button from '../../components/Button';
import detailMainImage from '../../assets/detailmain.png';

const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
    background: ${colors.lightGray};
    color: ${colors.black};
  }
`;

const DRAG_MIN = -140; // 위로 최대 140px
const DRAG_MAX = 0;    // 기본 위치

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 드래그 상태
  const [offset, setOffset] = useState(0); // translateY 값(px)
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const startOffsetRef = useRef(0);

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  const onPointerDown = (e) => {
    // 터치/마우스 통합
    const y = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    startYRef.current = y;
    startOffsetRef.current = offset;
    setIsDragging(true);
    // 포인터 캡처로 드래그 유실 방지
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    const y = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    const dy = y - startYRef.current; // 위로 드래그 시 음수
    const next = clamp(startOffsetRef.current + dy, DRAG_MIN, DRAG_MAX);
    setOffset(next);
  };

  const onPointerUp = (e) => {
    setIsDragging(false);
    // 살짝 스냅(원하는 경우 주석 해제)
    // if (offset < DRAG_MIN / 2) setOffset(DRAG_MIN); else setOffset(0);
  };

  return (
    <Container>
      <GlobalStyle />

      <HeaderWrap>
        <HeaderImage src={detailMainImage} alt="concert hero" />
        <BackButton onClick={() => navigate(-1)}>
        <Icon icon="fluent:ios-arrow-24-regular" width="24" height="24" style={{ color: '#FFFFFF' }} />
        </BackButton>
      </HeaderWrap>

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
        <Title>Concert Title</Title>
        <SubInfo>2025.08.16. 토요일 · 인스파이어 아레나</SubInfo>
        <Description>
        Ipsa atque ipsa quisquam sit veniam. Aperiam esse aut impedit{"\n"} 
        voluptatem aut commodi. Non ipsum rem rerum suscipit possimus{"\n"} 
        distinctio eaque. Aperiam eveniet inventore in modi itaque et nihil{"\n"} 
        similique eligendi.{"\n"}
        Nam deleniti ducimus ratione quis vitae laborum 
        </Description>

      <ActionRow>
        <Button variant="filled" size="medium"> Go</Button>
      </ActionRow>

        <ActionRow>
          <IconGroup>
            <IconButton onClick={() => {/* TODO: 찜 리스트 이동 */}}>
              <Icon icon="material-symbols:star-outline" width="24" height="24" style={{ color: '#000' }} />
              <Label>내가 찜한 리스트</Label>
            </IconButton>
            <IconButton onClick={() => {/* TODO: 찜 리스트 이동 */}}>
              <Icon icon="mdi:heart-outline" width="24" height="24" style={{ color: '#000' }} />
              <Label>평가</Label>
            </IconButton>
            <IconButton onClick={() => {/* TODO: 찜 리스트 이동 */}}>
              <Icon icon="material-symbols:share-outline" width="24" height="24" style={{ color: '#000' }} />
              <Label>공유</Label>
            </IconButton>            
          </IconGroup>
        </ActionRow>

        <ReviewSection>
          <ReviewTitle>인서트 리뷰</ReviewTitle>
          <ReviewCard>
            <ReviewText>
              <strong>공연장이 넓고 쾌적했어요</strong><br />
              Sint ea quod, illo molestias expedita expedita{"\n"} 
              perferendis dolore tenetur sed ut voluptatem. Et{"\n"}  
              quibusdam mollitia cupiditate.
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

/* ===== styled-components ===== */
const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  background: ${colors.lightGray};
  border-radius: 26px;
`;

const HeaderWrap = styled.div`
  position: relative;
`;

const HeaderImage = styled.img`
  width: 100%;
  height: 500px;
  object-fit: cover;
  border-radius: 26px;
`;

const BackButton = styled.button`
  position: absolute;
  top: 12px;
  left: 12px;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  background: none;
  }
`;

const ContentCard = styled.div`
  background: ${colors.white};
  border-radius: 24px 24px 0 0;
  margin-top: -30px; /* 기본 겹침 */
  padding: 12px 20px 40px;
  position: relative;
  z-index: 1;
  /* 드래그 아닐 땐 부드럽게 */
  transition: ${({ $isDragging }) => ($isDragging ? 'none' : 'transform 0.2s ease')};
  touch-action: none; /* 모바일에서 수직 드래그 인식 향상 */
  user-select: none;
`;

const DragHandle = styled.div`
  width: 44px;
  height: 5px;
  border-radius: 999px;
  background: ${colors.lightGray};
  margin: 8px auto 12px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const SubInfo = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: ${colors.gray};
  margin-bottom: 12px;
`;

const Description = styled.p`
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 20px;
  white-space: pre-line;
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const GoButton = styled.button`
  background: ${colors.primary};
  color: ${colors.white};
  border: none;
  padding: 10px 24px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
`;

const IconGroup = styled.div`
  display: flex;
  gap: 100px;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  text-align: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 80px;
  
`;

const Label = styled.div`
  font-size: 10px;
  color: ${colors.black};
  margin-top: 4px;
`;

const ReviewSection = styled.section``;

const ReviewTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
`;

const ReviewCard = styled.div`
  background-color: white;
  border: 1px solid #ddd;  // 연한 회색 테두리
  border-radius: 12px;
  padding: 16px;
  margin-top: 12px;
  box-shadow: none;  // 그림자 제거
`;

const ReviewText = styled.p`
  font-size: 14px;
  margin-bottom: 10px;
`;

const ReviewImages = styled.div`
  display: flex;
  gap: 8px;
`;

const ReviewImg = styled.img`
  height: 68px;
  object-fit: cover;
  border-radius: 8px;
`;
