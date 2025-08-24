// src/pages/MyPage/index.jsx (경로는 네 프로젝트 구조에 맞게)
// ✅ 변경점
// - 로컬 profile.png → `${API_BASE}/uploads/profile.png` 로 전환
// - 안 쓰는 import 제거(colors, profileImg, MyReview, MyVisit)
// - 하단에 API_BASE 디버그 라벨 추가(연결 확인용)

import { API_BASE } from "../../lib/api";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import colors from '../../styles/colors';
import { Icon } from '@iconify/react';
import TabNavigation from '../../components/TabNavigation';

export default function MyPage() {
  const navigate = useNavigate();

  return (
    <AppWrap>
      <Container>
        <TopBar>
          <Icon icon="hugeicons:cancel-01" width="28" />
        </TopBar>

        <ProfileBox>
          <ProfileTextBox>
            <Nickname>크리스티아누 호날두</Nickname>
            <EditProfile>
              프로필 편집 <Icon icon="ep:arrow-right" width="12" />
            </EditProfile>
          </ProfileTextBox>
          {/* ✅ 서버 업로드 이미지를 절대경로로 */}
          <ProfileImage src={`${API_BASE}/uploads/profile.png`} alt="profile" />
        </ProfileBox>

        <IconRow>
          <IconColumn onClick={() => navigate('/myvisit')}>
            <Icon icon="mynaui:heart" width="28" />
            <IconLabel>내 일정</IconLabel>
          </IconColumn>
          <IconColumn onClick={() => navigate('/myreview')}>
            <Icon icon="mynaui:star" width="28" />
            <IconLabel>내 리뷰</IconLabel>
          </IconColumn>
        </IconRow>

        <SectionDivider />

        <LevelBox>
          <LevelTop>
            <Icon icon="noto:2nd-place-medal" color="#4880ee" />
            <LevelText>
              내 등급 : <strong>Silver</strong>
            </LevelText>
          </LevelTop>
          <NextLevel>: 다음 등급까지 <strong>1200P</strong></NextLevel>
        </LevelBox>

        <MenuItem>쿠폰함 <Arrow icon="ep:arrow-right" /></MenuItem>
        <Divider />
        <MenuItem>포인트 <Arrow icon="ep:arrow-right" /></MenuItem>
        <Divider />
        <MenuItem>나의 찜리스트 <Arrow icon="ep:arrow-right" /></MenuItem>

        <SectionDivider />

        <BottomRow>
          <Notice>
            공지사항 <RedDot />
          </Notice>
          <div>고객센터</div>
        </BottomRow>

        <BottomSafe />
        <TabNavigation />

        {/* 🔎 연결 확인용: 지금 어떤 서버에 붙었는지 표시 */}
        <DebugBar>
          <strong>API_BASE</strong>: {API_BASE}
        </DebugBar>
      </Container>
    </AppWrap>
  );
}

const AppWrap = styled.main`
  
  max-width: 600px;
  min-width: 360px;

  margin: 0 auto;
  position: fix;
  background: #fff;
  box-shadow: 0 10px 30px rgba(30, 35, 90, 0.08);
  border-radius: 26px;


  @media (max-width: 600px) {
    border-radius: 0;
    box-shadow: none;
  }
`;

const Container = styled.div`

  max-width: 600px;
  min-width: 360px;  // ✅ 안정적인 최소 너비
  margin: 0 auto;
  padding: 20px 20px 100px; // ✅ 너무 큰 vw 대신 px 사용
  background: #fff;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans KR", Arial, sans-serif;  
`;


const TopBar = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 24px;
`;

const ProfileBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: clamp(12px, 4vw, 32px);
  margin-bottom: 24px;
`;

const ProfileTextBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const Nickname = styled.div`
  font-size: clamp(18px, 5vw, 22px);
  font-weight: 600;
  margin-bottom: 4px;
`;

const EditProfile = styled.div`
  font-size: clamp(10px, 3vw, 13px);
  color: ${colors.gray};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ProfileImage = styled.img`
  width: clamp(48px, 14vw, 60px);
  height: clamp(48px, 14vw, 60px);
  border-radius: 100%;
  object-fit: cover;
  margin-left:0;
`;


const IconRow = styled.div`
  display: flex;
  justify-content: center;
  gap: clamp(32px, 12vw, 64px);
  margin-bottom: 24px;
`;

const IconColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IconLabel = styled.div`
  margin-top: clamp(4px, 2vw, 8px);
  font-size: clamp(11px, 3.5vw, 14px);
`;
const LevelBox = styled.div`
  background: #f1f1f1;
  padding: 14px;
  border-radius: 12px;
  margin-bottom: 24px;
`;

const LevelTop = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const LevelText = styled.div`
  font-size: 14px;
`;

const NextLevel = styled.div`
  font-size: clamp(10px, 3vw, 13px);
  color: #000;
`;

const MenuItem = styled.div`
  padding: clamp(12px, 4vw, 18px) 0;
  font-size: clamp(13px, 4vw, 16px);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Arrow = styled(Icon)`
  color: ${colors.gray};
`;

const Divider = styled.div`
  height: 1px;
  background: #eee;
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: center;  
  gap: 48px;                    
  padding: clamp(20px, 5vw, 28px) 0 clamp(6px, 2vw, 12px);
  font-size: clamp(12px, 4vw, 15px);
`;

const Notice = styled.div`
  position: relative;
`;

const RedDot = styled.span`
  position: absolute;
  top: -4px;
  right: -10px;
  width: 6px;
  height: 6px;
  background: red;
  border-radius: 50%;
`;

const SectionDivider = styled.div`
  height: 8px;
  background: #f1f1f1;
  width: 100%;
  margin: 24px 0;
`;

const BottomSafe = styled.div`
  height: 82px;
`;

const DebugBar = styled.div`
  margin-top: 8px;
  padding: 8px 0;
  font-size: 12px;
  color: #666;
`;
