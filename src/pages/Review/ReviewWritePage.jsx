import React, { useState } from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import colors from '../../styles/colors';

export default function ReviewWritePage() {
  const [rating, setRating] = useState(4);

  return (
    <Container>
      <TopBar>
        <Icon icon="material-symbols:close" width="24" />
        <Title>연경 본점</Title>
        <DoneBtn>완료</DoneBtn>
      </TopBar>

      <Content>
        <Stars>
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              selected={i <= rating}
              onClick={() => setRating(i)}
            >
              <Icon icon="material-symbols:star" width="32" />
            </Star>
          ))}
        </Stars>
        <StarLabel>별점을 선택해주세요</StarLabel>

        <DateText>📅 2025년 8월 16일 방문</DateText>

        <CheckboxRow>
          <input type="checkbox" id="public" />
          <label htmlFor="public">
            직접 경험한 솔직한 리뷰를 남겨주세요.
          </label>
        </CheckboxRow>

        <TextArea placeholder="사진과 함께 글을 작성할 수 있어요. (최대 20자)" maxLength={20} />

        <ImageUpload>
          <PlusBox>
            <Icon icon="material-symbols:add" width="32" />
          </PlusBox>
          <UploadLabel>단, 사진은 1개만 첨부 가능합니다.</UploadLabel>
        </ImageUpload>
      </Content>
    </Container>
  );
}
const Container = styled.div`
  font-family: 'Pretendard', sans-serif;
  padding: 16px;
  max-width: 600px;
  margin: 0 auto;
  background: white;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
`;

const DoneBtn = styled.button`
  background: none;
  border: none;
  color: ${colors.main};
  font-weight: 600;
  font-size: 16px;
`;

const Content = styled.div`
  margin-top: 24px;
`;

const Stars = styled.div`
  display: flex;
  justify-content: center;
  gap: 4px;
`;

const Star = styled.div`
  color: ${(props) => (props.selected ? '#FFD700' : '#ddd')};
  cursor: pointer;
`;

const StarLabel = styled.p`
  text-align: center;
  margin-top: 8px;
  font-size: 14px;
  color: #888;
`;

const DateText = styled.p`
  font-size: 14px;
  margin: 20px 0 8px;
`;

const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  gap: 6px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 80px;
  margin-top: 16px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  resize: none;
`;

const ImageUpload = styled.div`
  margin-top: 16px;
`;

const PlusBox = styled.div`
  width: 64px;
  height: 64px;
  background: #f1f1f1;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const UploadLabel = styled.p`
  font-size: 12px;
  color: #999;
  margin-top: 8px;
`;
