// src/pages/InformationPage.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../components/Button";
import { ReactComponent as StarIcon } from "../assets/icons/star.svg";
import { ReactComponent as FavariteIcon } from "../assets/icons/favorite.svg";
import { ReactComponent as ShareIcon } from "../assets/icons/share.svg";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../lib/api";

// 상세 페이지(사진 포함) 조회 컴포넌트
export default function InformationPage() {
  const navigate = useNavigate();
  const { externalId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!externalId) {
      setErr("유효하지 않은 공연 ID입니다.");
      setLoading(false);
      return;
    }


    const load = async () => {
      try {
        setLoading(true);
        const data = await api(`/api/performs/by-external/${externalId}`);
        setData(data);
      } catch (e) {
        console.error(e);
        setErr("상세 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [externalId]);

  if (loading) return <Center>불러오는 중…</Center>;
  if (err) return <Center>{err}</Center>;
  if (!data) return <Center>데이터가 없습니다.</Center>;

  const dateRange =
    data.startDate && data.endDate
      ? `${data.startDate} ~ ${data.endDate}`
      : data.startDate || "";

  return (
    <Container>
      <ConcertImage $bg={data.posterUrl} />
      <ConcertInformation>
        {/* <ConcertTitle>{data.title}</ConcertTitle> */}
                <ConcertTitle>{data.externalId}</ConcertTitle>

        <ConcertSchedule>{dateRange}</ConcertSchedule>
        <ConcertVenue>{data.venueName}</ConcertVenue>
        <ConcertContents>{data.synopsis}</ConcertContents>

        <Button
          variant="filled"
          size="small"
          style={{ width: "70px" }}
          onClick={() => {
            console.log("externalId:", data.externalId);
            navigate(`/insertplace/${data.externalId}`, { state: { concertData: data } });
          }}>
          Go
        </Button>

        <MenuList>
          <Menu>
            <StarIcon />
            내가 찜한 리스트
          </Menu>
          <Menu>
            <FavariteIcon />
            평가
          </Menu>
          <Menu>
            <ShareIcon />
            공유
          </Menu>
        </MenuList>

        {/* 두번째 디자인의 섹션 타이틀 유지 (항상 보이게) */}
        <InsertReview>인서트 리뷰</InsertReview>

        {/* 리뷰가 있으면 카드 스타일로 노출 */}
        {Array.isArray(data.reviews) &&
          data.reviews.map((review, idx) => (
            <Review key={idx}>
              <ReviewTitle>{review.title}</ReviewTitle>
              <ReviewContents>{review.contents}</ReviewContents>
              <ReviewPhoto photos={review.photos} />
            </Review>
          ))}
      </ConcertInformation>
    </Container>
  );
}

/* ───────── 스타일 (두번째 디자인과 동일) ───────── */
const Container = styled.div`
  max-width: 600px;
  min-width: 360px;
  margin: 0 auto;
`;

const ConcertImage = styled.div`
  width: 100%;
  padding-bottom: 112%;
  background-image: ${p => (p.$bg ? 'url("' + p.$bg + '")' : "none")};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const ConcertInformation = styled.div`
  flex-shrink: 0;
  background: #fff;
  border-radius: 32px 32px 0px 0px;
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, sans-serif;
  padding: 40px 16px;
  margin-top: -40px;
`;

const ConcertTitle = styled.div`
  color: #000;
  text-align: left;
  font-size: clamp(20px, 5.56vw, 24px);
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.1px;
`;

const ConcertSchedule = styled.div`
  color: #555;
  font-size: clamp(12px, 3.33vw, 14px);
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  padding-top: 4px;
  letter-spacing: -0.06px;
`;

const ConcertVenue = styled.div`
  color: #555;
  font-size: clamp(12px, 3.33vw, 14px);
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  padding-top: 4px;
  letter-spacing: -0.06px;
`;

const ConcertContents = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  color: #000;
  font-size: clamp(10px, 2.78vw, 12px);
  font-style: normal;
  font-weight: 300;
  line-height: 130%;
  letter-spacing: -0.05px;
  margin: 13px 0px 22px;
`;

/* 아이콘 크기: 두번째 디자인처럼 별도 크기 미지정(원본 SVG 크기 사용) */
const Menu = styled.div`
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2px;
  color: #000;
  text-align: center;
  font-family: Pretendard;
  font-size: clamp(8px, 2.22vw, 10px);
  font-style: normal;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: -0.04px;
`;

const MenuList = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 18px 60px 38px;
`;

const InsertReview = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: clamp(16px, 4.44vw, 18px);
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.08px;
`;

const Review = styled.div`
  border-radius: 16px;
  border: 0.5px solid #cbcbcb;
  padding: 16px 30px;
  margin-top: 8px;
`;

const ReviewTitle = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: clamp(14px, 3.89vw, 16px);
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.07px;
`;

const ReviewContents = styled.div`
  margin-top: 8px;
  color: #555;
  font-family: Pretendard;
  font-size: clamp(12px, 3.33vw, 14px);
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.06px;
`;

const ReviewPhotoWrapper = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  margin-top: 12px;

  img {
    max-width: 100px;
    max-height: 100px;
    object-fit: cover;
    border-radius: 8px;
  }
`;

const ReviewPhoto = ({ photos = [] }) => {
  if (!photos?.length) return null;
  return (
    <ReviewPhotoWrapper>
      {photos.map((src, index) => (
        <img key={index} src={src} alt={`review-${index}`} />
      ))}
    </ReviewPhotoWrapper>
  );
};

const Center = styled.div`
  max-width: 600px;
  min-width: 360px;
  margin: 80px auto;
  text-align: center;
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, sans-serif;
`;
