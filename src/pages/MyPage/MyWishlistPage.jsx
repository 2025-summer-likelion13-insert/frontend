// src/pages/MyPage/MyWishlistPage.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import cardImage1 from '../../assets/cardImage1.png';
import { useNavigate } from 'react-router-dom';

const fluid = (min, max) =>
  `clamp(${min}px, calc(${min}px + (${max} - ${min}) * ((100vw - 360px) / 240)), ${max}px)`;

// ---- Portal ----
const Portal = ({ children }) =>
  typeof document !== 'undefined' ? createPortal(children, document.body) : null;

export default function MyWishlistPage() {
  const [list, setList] = useState([]);
  const [memoOpen, setMemoOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [memoText, setMemoText] = useState('');
  const navigate = useNavigate();

  // --- 서버에서 찜 리스트 불러오기 ---
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:8080/api/likes/perform/me?page=0&size=20', {
          headers: { 'x-user-id': 1 },
        });
        if (!res.ok) throw new Error('조회 실패');
        const data = await res.json();

        // 서버 응답: { content: [{externalId, likedAt}], ... }
        const mapped = data.content.map((it) => ({
          id: it.externalId,
          title: `공연 ${it.externalId}`,
          desc: `찜한 날짜: ${it.likedAt}`,
          memo: '',
        }));
        setList(mapped);
      } catch (err) {
        console.error('찜 리스트 불러오기 실패:', err);
      }
    })();
  }, []);

  // --- 하트(빨간색) 클릭 → 서버 삭제 → 화면에서 제거 ---
  const deleteLike = async (externalId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/likes/perform/${externalId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': 1 },
      });
      if (!res.ok) throw new Error('삭제 실패');
      setList((prev) => prev.filter((it) => it.id !== externalId));
    } catch (e) {
      console.error(e);
    }
  };

  const openMemo = (id) => {
    const t = list.find((it) => it.id === id);
    setActiveId(id);
    setMemoText(t?.memo || '');
    setMemoOpen(true);
  };
  const closeMemo = () => { setMemoOpen(false); setActiveId(null); setMemoText(''); };
  const saveMemo = () => {
    setList((p) => p.map((it) => (it.id === activeId ? { ...it, memo: memoText } : it)));
    closeMemo();
  };

  return (
    <Container>
      <Header>
        <Icon
          className="back"
          icon="fluent:ios-arrow-24-regular"
          onClick={() => navigate(-1)} 
          role="button"
          aria-label="뒤로가기"
        />
        <Title>나의 찜 리스트</Title>
      </Header>

      <HeaderDivider />

      <List>
        {list.map((item, idx) => (
          <React.Fragment key={item.id}>
            <Row>
              <Info>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemDesc>{item.desc}</ItemDesc>
                <MemoBtn type="button" onClick={() => openMemo(item.id)}>
                  <Icon className="memo-ic" icon="material-symbols:edit-note" />
                  메모 남기기
                </MemoBtn>
              </Info>

              <ThumbWrap>
                <Thumb src={cardImage1} alt="썸네일" />
                <Badge>{item.title}</Badge>
                <Heart
                  icon="material-symbols:favorite"
                  role="button"
                  aria-label="찜 해제"
                  title="찜 해제"
                  onClick={() => deleteLike(item.id)}  // ← 삭제 API 연결
                />
              </ThumbWrap>
            </Row>

            {idx !== list.length - 1 && <ItemDivider />}
          </React.Fragment>
        ))}
      </List>

      {memoOpen && (
        <Portal>
          <Backdrop onClick={closeMemo}>
            <Modal onClick={(e) => e.stopPropagation()}>
              <ModalHeader>메모</ModalHeader>
              <Textarea
                placeholder="메모를 입력하세요"
                value={memoText}
                onChange={(e) => setMemoText(e.target.value)}
              />
              <ModalFooter>
                <CancelBtn onClick={closeMemo}>취소</CancelBtn>
                <ConfirmBtn onClick={saveMemo}>확인</ConfirmBtn>
              </ModalFooter>
            </Modal>
          </Backdrop>
        </Portal>
      )}
    </Container>
  );
}

/* ---------- styles ---------- */
const Container = styled.div`
  font-family: 'Pretendard', sans-serif;
  background: #fff;
  max-width: 600px;
  margin: 0 auto;
  padding: ${fluid(16, 20)};
`;
const Header = styled.header`
  display: flex; align-items: center; gap: ${fluid(6, 8)};
  .back { width: ${fluid(20, 24)}; height: ${fluid(20, 24)}; }
`;
const Title = styled.h2`margin:0; font-size:${fluid(17,18.5)}; font-weight:400;`;
const HeaderDivider = styled.hr`
  border:0; height:4px; background:#f1f1f1; transform:scaleY(0.5);
  margin:${fluid(12,14)} 0;
`;
const ItemDivider = styled.hr`
  border:0; height:8px; background:#f1f1f1; margin:${fluid(16,20)} 0; border-radius:4px;
`;
const List = styled.div``;
const Row = styled.article`
  display:grid; grid-template-columns:1fr auto; align-items:start;
  gap:${fluid(12,14)}; padding:${fluid(10,12)} 0;
`;
const Info = styled.div`min-width:0;`;
const ItemTitle = styled.h3`
  margin:0 0 ${fluid(6,8)}; font-size:${fluid(14,16)}; font-weight:400; color:#111;
`;
const ItemDesc = styled.p`
  margin:0; color:#555; font-size:${fluid(12,14)}; line-height:1.45;
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
`;
const MemoBtn = styled.button`
  &&{
    margin-top:clamp(10px, calc(10px + (100vw - 360px)/240), 12px);
    display:inline-flex; align-items:center;
    gap:clamp(4px, calc(4px + (100vw - 360px)/240), 6px);
    border:0; background:none; color: #2f88ff; cursor:pointer;
    .memo-ic{ width:${fluid(16,18)}; height:${fluid(16,18)}; }
  }
`;
const ThumbWrap = styled.div`
  position:relative; width:${fluid(104,173)}; height:${fluid(148,247)};
  border-radius:${fluid(5,8)}; overflow:hidden; flex-shrink:0;
`;
const Thumb = styled.img`width:100%; height:100%; object-fit:cover; display:block;`;
const Heart = styled(Icon)`
  position:absolute; top:${fluid(6,8)}; right:${fluid(6,8)};
  width:${fluid(18,20)}; height:${fluid(18,20)}; color:#ff3b30; cursor:pointer;
  filter:drop-shadow(0 1px 2px rgba(0,0,0,0.15));
`;
const Badge = styled.span`
  position:absolute; left:${fluid(8,10)}; bottom:${fluid(7,9)};
  background:rgba(0,0,0,0.7); color:#fff; font-size:${fluid(10,13)};
  padding:${fluid(2,3)} ${fluid(6,8)}; border-radius:${fluid(6,8)}; text-align:left;
`;

/* ---- Modal ---- */
const Backdrop = styled.div`
  position:fixed; inset:0; background:rgba(0,0,0,0.25);
  display:flex; justify-content:center; align-items:center; z-index:10000;
`;
const Modal = styled.div`
  width: min(80vw, ${fluid(320, 560)});
  max-height: 86vh;
  background: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 5px;
`;
const ModalHeader = styled.div`
  padding: ${fluid(16, 18)} 0 0 ${fluid(16, 20)};
  font-size: ${fluid(20, 22)};
  font-weight: 400;
`;
const Textarea = styled.textarea`
  margin-top: ${fluid(8, 10)};
  padding: ${fluid(12, 14)};
  padding-left: ${fluid(16, 20)};
  padding-right: ${fluid(16, 20)};
  height: ${fluid(220, 360)};
  resize: none;
  border: 1px solid #fff;
  font-size: ${fluid(11, 13)};
  outline: none;
  background: #fff;
  ::placeholder { color: #cbcbcb; }
`;
const ModalFooter = styled.div`
  display: flex;
  justify-content: center; 
  align-items: center;
  gap: ${fluid(113, 123)};
  padding: ${fluid(14, 16)} ${fluid(16, 20)};
  border-top: 1px solid #fff;
`;
const CancelBtn = styled.button`
  background:none; border:0; color:#8d95a1; font-size:${fluid(14,16)}; cursor:pointer;
`;
const ConfirmBtn = styled.button`
  background:none; border:0; color:#ff3b30; font-weight:400; font-size:${fluid(14,16)}; cursor:pointer;
`;
