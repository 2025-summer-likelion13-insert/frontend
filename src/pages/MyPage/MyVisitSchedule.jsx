// src/pages/MyPage/MyVisitPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Icon } from "@iconify/react";
import colors from "../../styles/colors";
import profileImg from "../../assets/profile.png";

const API_BASE = process.env.REACT_APP_API_BASE;

export default function MyVisitSchedule() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    // ✅ 일정 목록 불러오기 (userId는 예시)
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/schedules?userId=1`);
        const json = await res.json();
        setItems(json?.data ?? []);
      } catch (e) {
        console.error(e);
        setItems([]); // 실패 시 빈 배열
      }
    };
    load();
  }, []);

  // 날짜를 YYYY.MM.DD 로 보이게 포맷
  const fmtDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}.${m}.${day}`;
  };

  return (
    <Container>
      {/* 상단 헤더 */}
      <Header>
        <BackButton icon="mingcute:arrow-left-line" onClick={() => window.history.back()} />
        <span>내 일정 화면</span>
      </Header>

      {/* 프로필 섹션 */}
      <ProfileSection>
        <ProfileImage src={profileImg} alt="profile" />
        <ProfileName>크리스티아누 호날두</ProfileName>
      </ProfileSection>

      {/* 탭바: 내 일정(활성), 리뷰 */}
      <TabBar>
        <Tab active onClick={() => navigate("/myvisit")}>내 일정</Tab>
        <Tab onClick={() => navigate("/myreview")}>리뷰</Tab>
      </TabBar>

      {/* 지난 일정 타이틀 */}
      <SectionTitle>지난 일정</SectionTitle>

      {/* 일정 리스트 */}
      <List>
        {items.length === 0 && (
          <Empty>
            <Icon icon="mdi:calendar-blank-outline" />
            <p>등록된 지난 일정이 없어요</p>
          </Empty>
        )}

        {items.map((it) => (
          <Row key={it.id}>
            {/* 아바타(프로필) */}
            <Avatar src={profileImg} alt="avatar" />

            {/* 본문 */}
            <Col>
              <Title>{it.title ?? "일정 제목"}</Title>
              <Meta>
                {/* 날짜 */}
                {it.date && <span>{fmtDate(it.date)}</span>}
                {/* 구분점 */}
                {it.date && (it.location || it.region) && <Dot />}
                {/* 장소(지역) */}
                {(it.location || it.region) && (
                  <span>{it.location ?? it.region}</span>
                )}
              </Meta>
            </Col>

            {/* 우측 더보기 아이콘 */}
            <MoreBtn aria-label="more">
              <Icon icon="mdi:dots-horizontal" />
            </MoreBtn>
          </Row>
        ))}
      </List>
    </Container>
  );
}

/* ===== styled-components ===== */

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
  gap: 8px;
  padding: 16px;
  border-bottom: 1px solid #eee;
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
  color: ${(p) => (p.active ? (colors?.main || "#ff5b00") : "#666")};
  border-bottom: ${(p) => (p.active ? `2px solid ${colors?.main || "#ff5b00"}` : "none")};
`;

const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #222;
  padding: 16px;
`;

const List = styled.div`
  padding-bottom: 24px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr 32px;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
`;

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

const Col = styled.div`
  min-width: 0;
`;

const Title = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #111;
  margin-bottom: 4px;
  overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #999;
  font-size: 12px;
`;

const Dot = styled.span`
  width: 3px; height: 3px; border-radius: 50%; background: #ccc; display: inline-block;
`;

const MoreBtn = styled.button`
  width: 32px; height: 32px;
  border: none; background: transparent; padding: 0; cursor: pointer;
  display: grid; place-items: center;
  svg { font-size: 20px; color: #666; }
`;

const Empty = styled.div`
  padding: 40px 16px;
  text-align: center;
  color: #999;
  svg { font-size: 28px; margin-bottom: 8px; }
  p { font-size: 14px; }
`;
