import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import colors from '../../styles/colors';

const fluid = (min, max) =>
  `clamp(${min}px, calc(${min}px + (${max} - ${min}) * ((100vw - 360px) / 240)), ${max}px)`;

const API_BASE = process.env.REACT_APP_API_BASE;

export default function ReviewWritePage() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [toastVisible, setToastVisible] = useState(false);
  const [image, setImage] = useState(null); // 이미지 한 장
  const [content, setContent] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const textareaRef = useRef(null)

  const handleSubmit = async () => {
    if (rating === 0) {
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
      return;
    }
   if (!API_BASE) {
      alert('API_BASE가 설정되지 않았습니다. .env.local을 확인하세요.');
      return;
    }

    const reviewData = {
      userId: 1,
      placeId: 1,
      scheduleId: 1,
      rating,
      content,
      mediaUrls: image ? [image] : [],
      isVisited: true,
    };

    try {
      const res = await fetch(`${API_BASE}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (!data?.id) throw new Error('생성 결과에 id가 없습니다.');

    navigate('/myreview');
  } catch (err) {
    console.error(err);
    alert('리뷰 작성에 실패했습니다.');
  }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file); // 실제 업로드는 API에서 구현해야 함
    setImage(url); // 임시로 미리보기용 URL
  };

  return (
    <Container>
      <TopBar>
        <LeftGroup>
          <Icon className="close-ic" icon="material-symbols:close" onClick={() => navigate('/')} />
          <Title>연경 본점</Title>
        </LeftGroup>
        <DoneBtn onClick={handleSubmit}>완료</DoneBtn>
      </TopBar>

      <Content>
        <Stars>
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} selected={i <= rating} onClick={() => setRating(i)}>
              <Icon className="star-ic" icon="material-symbols:star" />
            </Star>
          ))}
        </Stars>
        <StarLabel>별점을 선택해주세요!</StarLabel>

        <DateText>
          <Icon className="cal-ic" icon="mynaui:calendar" />
          <span>2025년 8월 16일 방문</span>
        </DateText>

<TextAreaWrap onClick={() => textareaRef.current?.focus()}>
  {/* 가이드 오버레이: 내용이 없고 포커스도 없을 때만 보임 */}
  <GuideOverlay $hidden={!!content.trim() || isWriting}>
    <GuideRow>
      <Dot icon="tabler:point-filled" />
      <span>직접 경험한 솔직한 리뷰를 남겨주세요</span>
    </GuideRow>
    <GuideRow>
      <Dot icon="tabler:point-filled" />
      <span>사진과 함께 글을 작성할 수 있어요. (최대 20자)</span>
    </GuideRow>
    <GuideRow>
      <Dot icon="tabler:point-filled" />
      <span>단, 사진은 1개만 첨부 가능합니다.</span>
    </GuideRow>
  </GuideOverlay>

  {/* 실제 입력창은 항상 렌더링 */}
  <ReviewTextarea
    ref={textareaRef}
    value={content}
    onChange={(e) => setContent(e.target.value.slice(0, 20))} // 20자 제한
    onFocus={() => setIsWriting(true)}
    onBlur={() => { if (!content.trim()) setIsWriting(false); }}
    maxLength={20}
  />
  <CharCount>{content.length}/20</CharCount>
</TextAreaWrap>

        <ImageUpload>
          <label htmlFor="imageInput">
            <PlusBox>
              {image ? (
                <Preview src={image} alt="uploaded" />
              ) : (
                <Icon className="plus-ic" icon="pixel:plus" />
              )}
            </PlusBox>
          </label>
          <input id="imageInput" type="file" accept="image/*" onChange={handleImageUpload} hidden />
        </ImageUpload>
      </Content>

      {toastVisible && <Toast>별점을 입력해주세요!</Toast>}
    </Container>
  );
}

/* styles 동일 (아래에 Preview 추가됨) */

const Container = styled.div`
  font-family: 'Pretendard', sans-serif;
  padding: ${fluid(16, 20)};
  max-width: 600px;
  margin: 0 auto;
  background: #fff;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${fluid(32, 46)};
  .close-ic {
    width: ${fluid(20, 24)};
    height: ${fluid(20, 24)};
    cursor: pointer;
  }
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${fluid(12, 20)};
`;

const Title = styled.h2`
  font-size: ${fluid(18, 20)};
  font-weight: 500;
  margin: 0;
`;

const DoneBtn = styled.button`
  background: none;
  border: none;
  color: ${colors.main};
  font-weight: 500;
  font-size: ${fluid(16, 18)};
  cursor: pointer;
`;

const Content = styled.div`
  margin-top: ${fluid(16, 24)};
`;

const Stars = styled.div`
  display: flex;
  justify-content: center;
  gap: ${fluid(4, 6)};
`;

const Star = styled.div`
  color: ${(props) => (props.selected ? '#FFD700' : '#ddd')};
  cursor: pointer;

  .star-ic {
    width: ${fluid(32, 36)};
    height: ${fluid(32, 36)};
  }
`;

const StarLabel = styled.p`
  text-align: center;
  margin-top: ${fluid(20, 24)};
  font-size: ${fluid(14, 16)};
  color: #cbcbcb;
`;

const DateText = styled.p`
  display: flex;
  align-items: center;
  gap: ${fluid(6, 8)};
  font-size: ${fluid(14, 16)};
  margin: ${fluid(40, 50)} 0 ${fluid(8, 10)};
  color: #cbcbcb;

  .cal-ic {
    width: ${fluid(20, 22)};
    height: ${fluid(20, 22)};
  }

  & > span {
    line-height: 1;
  }
`;

const Dot = styled(Icon)`
  flex: none;
  color: #cbcbcb;
  width: ${fluid(8, 9)};
  height: ${fluid(8, 9)};
  margin-top: ${fluid(3, 4)};
`;

const ImageUpload = styled.div`
  margin-top: ${fluid(16, 20)};
`;

const PlusBox = styled.div`
  width: ${fluid(64, 72)};
  height: ${fluid(64, 72)};
  background: #f1f1f1;
  border-radius: ${fluid(8, 10)};
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  .plus-ic {
    width: ${fluid(20, 22)};
    height: ${fluid(20, 22)};
    color: #d9d9d9;
  }
`;

const Preview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Toast = styled.div`
  position: fixed;
  bottom: ${fluid(80, 100)};
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  padding: ${fluid(10, 12)} ${fluid(16, 20)};
  border-radius: ${fluid(8, 12)};
  font-size: ${fluid(13, 15)};
  z-index: 999;
  animation: fadeInOut 2s ease;

  @keyframes fadeInOut {
    0% { opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { opacity: 0; }
  }
`;

const TextAreaWrap = styled.div`
  position: relative;
  margin-top: ${fluid(8, 10)};
`;

const GuideOverlay = styled.div`
  position: absolute;
  inset: ${fluid(12, 14)} ${fluid(16, 20)};
  color: #cbcbcb;
  font-size: ${fluid(13, 14)};
  line-height: 1.45;
  pointer-events: none;         /* 클릭은 아래 textarea로 전달 */
  transition: opacity .15s ease;
  opacity: ${(p) => (p.$hidden ? 0 : 1)};
`;

const GuideRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${fluid(8, 10)};
  margin-bottom: ${fluid(6, 8)};
`;

const ReviewTextarea = styled.textarea`
  width: 100%;
  min-height: ${fluid(90, 110)};
  padding: ${fluid(12, 14)};
  padding-left: ${fluid(16, 20)};
  padding-right: ${fluid(16, 20)};
  border: 1px solid #eee;
  border-radius: ${fluid(10, 12)};
  font-size: ${fluid(14, 16)};
  line-height: 1.5;
  resize: none;
  outline: none;
  background: #fff;
`;

const CharCount = styled.div`
  text-align: right;
  font-size: ${fluid(12, 13)};
  color: #bbb;
  margin-top: ${fluid(6, 8)};
`;
