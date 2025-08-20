import React from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import colors from '../styles/colors'; // 주 색상 정의된 파일

export default function ReviewPopup({ onClose, onReview }) {
  return (
    <PopupWrapper>
      <PopupCard>
        <Emoji>😃</Emoji>
        <TextWrap>
          <Highlight>InSert</Highlight>가 추천한 장소는 어땠나요?
          <br />
          지금 평가해 보세요!
        </TextWrap>

        <ButtonRow>
          <PrimaryButton onClick={onReview}>
            <Icon icon="material-symbols:edit" width="20" />
            리뷰 작성하기
          </PrimaryButton>
          <SecondaryButton onClick={onClose}>
            <Icon icon="material-symbols:close" width="20" />
            닫기
          </SecondaryButton>
        </ButtonRow>
      </PopupCard>
    </PopupWrapper>
  );
}
const PopupWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
  width: 90%;
  max-width: 400px;
`;

const PopupCard = styled.div`
  background: white;
  border-radius: 26px;
  padding: 32px 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  text-align: center;
`;

const Emoji = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const TextWrap = styled.p`
  font-size: 16px;
  color: ${colors.black};
  line-height: 1.5;
`;

const Highlight = styled.span`
  color: ${colors.main}; // Insert 주 색상
  font-weight: bold;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  background: ${colors.main};
  color: white;
  border: none;
  border-radius: 100px;
  padding: 10px 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const SecondaryButton = styled(PrimaryButton)`
  background: transparent;
  color: ${colors.main};
  border: 2px solid ${colors.main};
`;
