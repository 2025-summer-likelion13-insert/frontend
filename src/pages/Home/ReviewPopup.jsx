import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Icon } from '@iconify/react';
import characterImage from '../../assets/characterImage.png';

export default function ReviewPopupComponent({ onClose = () => {} }) {
  const popupRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();

  // 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 250); // 애니메이션 끝난 뒤 닫기
  };

  const handleWriteClick = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      navigate('/review/write');           // ✅ 실제 라우트 경로에 맞춰주세요
    }, 250);
  };

  return (
    <Overlay>
      <PopupContainer ref={popupRef} className={isClosing ? 'closing' : ''}>
        <CharacterImage src={characterImage} alt="character" />
        <TextHighlight>
          <span className="highlight">InSert</span>가 추천한 장소는 어땠나요?<br />
          지금 평가해 보세요!
        </TextHighlight>
        <ButtonRow>
          <FilledButton onClick={handleWriteClick}>
            <Icon icon="mdi:pencil" width="18" /> 리뷰 작성하기
          </FilledButton>
          <OutlinedButton onClick={handleClose}>
            <Icon icon="mdi:close-circle-outline" width="18" /> 닫기
          </OutlinedButton>
        </ButtonRow>
      </PopupContainer>
    </Overlay>
  );
}
const fadeOut = keyframes`
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.95); }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  font-family: 'Pretendard', sans-serif;
`;

const PopupContainer = styled.div`
  background: white;
  border-radius: 24px;
  padding: 32px 20px;
  max-width: 320px;
  width: 90%;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.25s ease;

  &.closing {
    animation: ${fadeOut} 0.25s forwards;
  }

  @media (max-width: 360px) {
    padding: 28px 16px;
    max-width: 300px;
  }
`;

const CharacterImage = styled.img`
  width: 120px;
  height: auto;
  margin-bottom: 0px;

  @media (max-width: 546px) {
    width: 328px;
  }
`;

const TextHighlight = styled.p`
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 24px;
  margin-top: 0px;
  font-weight: 500;
  .highlight {
    color: #DF3B1E;
    font-weight: 700;
  }

  @media (max-width: 360px) {
    font-size: 14px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
`;

const FilledButton = styled.button`
  background: #DF3B1E;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Pretendard', sans-serif;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;

  @media (max-width: 360px) {
    font-size: 13px;
    padding: 10px 16px;
  }
`;

const OutlinedButton = styled(FilledButton)`
  background: white;
  color: #DF3B1E;
  border: 2px solid #DF3B1E;
`;
