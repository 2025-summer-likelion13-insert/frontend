import React, { useState } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import colors from '../../styles/colors';

// 정확한 360~600 선형 보간 유틸
const fluid = (min, max) =>
  `clamp(${min}px, calc(${min}px + (${max} - ${min}) * ((100vw - 360px) / 240)), ${max}px)`;

export default function ReviewWritePage() {
  const [rating, setRating] = useState(4);

  return (
    <Container>
      <TopBar>
        <LeftGroup>
          <Icon className="close-ic" icon="material-symbols:close" />
          <Title>연경 본점</Title>
        </LeftGroup>
        <DoneBtn>완료</DoneBtn>
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

        {/* 불릿 리스트 */}
        <GuideList>
          <GuideItem>
            <Dot icon="tabler:point-filled" />
            <span>직접 경험한 솔직한 리뷰를 남겨주세요</span>
          </GuideItem>
          <GuideItem>
            <Dot icon="tabler:point-filled" />
            <span>사진과 함께 글을 작성할 수 있어요. (최대 20자)</span>
          </GuideItem>
          <GuideItem>
            <Dot icon="tabler:point-filled" />
            <span>단, 사진은 1개만 첨부 가능합니다.</span>
          </GuideItem>
        </GuideList>

        <ImageUpload>
          <PlusBox>
            <Icon className="plus-ic" icon="pixel:plus" />
          </PlusBox>
        </ImageUpload>
      </Content>
    </Container>
  );
}

/* ---------- styles (responsive with fluid()) ---------- */

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

/* 불릿 리스트 */
const GuideList = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${fluid(8, 10)} 0 0;
  display: grid;
  gap: ${fluid(6, 8)};
`;

const GuideItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${fluid(8, 10)};
  color: #cbcbcb;
  font-size: ${fluid(13, 14)};
  line-height: 1.4;
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

  .plus-ic {
    width: ${fluid(20, 22)};
    height: ${fluid(20, 22)};
    color: #d9d9d9;
  }
`;
