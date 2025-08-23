// src/pages/MyPage/MyReviewPage.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Icon } from "@iconify/react";
import colors from "../../styles/colors";

const API_BASE = process.env.REACT_APP_API_BASE;

const Container = styled.div`
  max-width: 600px;
  min-width: 360px;
  margin: 0 auto;
  background: #fff;
  font-family: Pretendard;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
  gap: 8px;
  span { font-size: 16px; }
`;

const BackButton = styled(Icon)`
  font-size: 24px;
  cursor: pointer;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
`;

const ProfileImage = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  margin-bottom: 12px;
  object-fit: cover;
`;

const ProfileName = styled.div`
  font-size: 18px;
  font-weight: 600;
`;

const TabBar = styled.div`
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #eee;
  margin-top: 16px;
`;

const Tab = styled.div`
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-size: 15px;
  cursor: pointer;
  color: ${(props) => (props.active ? (colors?.main || "#ff5b00") : "#666")};
  border-bottom: ${(props) => (props.active ? `2px solid ${colors?.main || "#ff5b00"}` : "none")};
`;

const ReviewCard = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
`;

const ReviewHeader = styled.div`
  display:flex; justify-content:space-between; align-items:center; gap:12px;
`;

const ReviewTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
`;

const Rating = styled.div`
  font-size: 14px; color: #ffa800; display:flex; align-items:center; gap:6px;
  span { color:#999; font-size:12px; }
`;

const ReviewImage = styled.img`
  width: 100%;
  border-radius: 12px;
  margin: 12px 0;
  object-fit: cover;
`;

const ReviewContent = styled.div`
  font-size: 14px;
  color: #333;
  margin-bottom: 12px;
`;

const Meta = styled.div`
  color:#999; font-size:12px; display:flex; align-items:center; gap:6px; flex-wrap:wrap;
`;

const Dot = styled.span`
  width:3px; height:3px; background:#ccc; border-radius:50%; display:inline-block;
`;

const ReviewFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #666;
`;

export default function MyReviewPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/reviews?userId=1`);
        const json = await res.json();
        setItems(json?.data ?? []);
      } catch (e) {
        console.error(e);
        setItems([]);
      }
    };
    load();
  }, []);

  return (
    <Container>
      <Header>
        <BackButton icon="mingcute:arrow-left-line" onClick={() => window.history.back()} />
        <span>내 리뷰 화면</span>
      </Header>

      <ProfileSection>
        <ProfileImage src="/uploads/profile.png" alt="프로필" />
        <ProfileName>크리스티아누 호날두</ProfileName>
      </ProfileSection>

      <TabBar>
        <Tab>내 일정</Tab>
        <Tab active>리뷰</Tab>
      </TabBar>

      {items.map((review) => (
        <ReviewCard key={review.id}>
          <ReviewHeader>
            <ReviewTitle>{review.placeName || "리뷰"}</ReviewTitle>
            <Rating>
              {"★★★★★☆☆☆☆☆".slice(5 - Math.min(5, review.rating || 0), 10 - Math.min(5, review.rating || 0))}
              <span>{review.rating ?? 0}.0</span>
            </Rating>
          </ReviewHeader>

          {review.mediaUrls?.[0] && (
            <ReviewImage src={review.mediaUrls[0]} alt="리뷰 이미지" />
          )}

          <ReviewContent>{review.content}</ReviewContent>

          <Meta>
            {review.placeCategory && <span>{review.placeCategory}</span>}
            {(review.placeCategory && review.placeAddress) && <Dot />}
            {review.placeAddress && <span>{review.placeAddress}</span>}
            {(review.placeAddress || review.placeCategory) && <Dot />}
            <span>{(review.createdAt || "").slice(0, 10)}</span>
          </Meta>

          <ReviewFooter>
            <Icon icon="mdi:thumb-up-outline" /> {review.likes ?? 0}
            <Icon icon="mdi:comment-outline" /> {review.comments ?? 0}
          </ReviewFooter>
        </ReviewCard>
      ))}
    </Container>
  );
}
