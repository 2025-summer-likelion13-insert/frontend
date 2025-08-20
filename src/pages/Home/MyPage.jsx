import React from 'react';
import styled from 'styled-components';

export default function MyPage() {
  return (
    <Container>
      <h3>마이페이지</h3>
      <ul>
        <li>쿠폰함</li>
        <li>포인트</li>
        <li>공지사항</li>
      </ul>
    </Container>
  );
}

const Container = styled.div`
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
  font-family: 'Pretendard';
`;
