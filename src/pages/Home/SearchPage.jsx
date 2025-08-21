import React from 'react';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

export default function SearchPage() {

const navigate = useNavigate();

  return (
    <Container>
      <TopBar>
        <BackIcon   
          icon="fluent:ios-arrow-24-regular"
          onClick={() => navigate(-1)}
          role="button"
          aria-label="뒤로가기"
        />

        <InputWrap>

        <SearchInput placeholder="검색창" />
        <InputIcon icon="mingcute:search-line" />
        </InputWrap>
      </TopBar>
    </Container>
  );
}
const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 0 16px;
  background: #fff;
  height: 100vh;
  font-family: 'Pretendard', sans-serif;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  margin-top: 40px;
  gap: 8px;
`;

const BackIcon = styled(Icon)`
  font-size: 24px;
  cursor: pointer;
`;

const InputWrap = styled.div`
  position: relative;
  flex: 1;
`;

const SearchInput = styled.input`
  width: 85%;
  height: 36px;
  border: none;
  border-radius: 6px;
  padding: 0 12px 0 36px; /* 왼쪽에 아이콘 공간 확보 */
  background: #f1f1f1;
  font-size: 14px;
  color: #000;
  outline: none;
`;

const InputIcon = styled(Icon)`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  font-size: 18px;
  color: #000;
`;
