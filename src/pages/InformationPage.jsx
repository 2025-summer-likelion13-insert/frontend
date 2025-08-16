import { styled } from "styled-components";
import Button from "../components/Button";
import { ReactComponent as StarIcon } from "../assets/icons/star.svg"; // SVG import
import { ReactComponent as FavariteIcon } from "../assets/icons/favorite.svg";
import { ReactComponent as ShareIcon } from "../assets/icons/share.svg";


const Container = styled.div`
max-width: 600px; min-width: 360px; margin: 0 auto; 
`;

const ConcertImage = styled.div`
width: 100%;
padding-bottom: 112%; 
background-image: url(${props => props.$bg});
background-size: cover;
background-position: center;
background-repeat: no-repeat;
`
const ConcertInformation = styled.div`
flex-shrink: 0;
background: #fff;
border-radius: 32px 32px 0px 0px;
font-family: Pretendard;
padding: 40px 16px;
margin-top: -40px;
`
const ConcertTitle = styled.div`
color: #000;
text-align: left;
font-size: clamp(20px, 5.56vw, 24px); 
font-style: normal;
font-weight: 600;
line-height: normal;
letter-spacing: -0.1px;
`
const ConcertSchedule = styled.div`
color: #555;
font-size: clamp(12px, 3.33vw, 14px); 
font-style: normal;
font-weight: 500;
line-height: normal;
padding-top: 4px;
letter-spacing: -0.06px;`

const ConcertContents = styled.div`
display: flex;
flex-direction: column;
flex-shrink: 0;
color: #000;
font-size: clamp(10px, 2.78vw, 12px); 
font-style: normal;
font-weight: 300;
line-height: 130%; /* 13px */
letter-spacing: -0.05px;
margin: 13px 0px 22px;

`
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
line-height: 100%; /* 8px */
letter-spacing: -0.04px;
`

const MenuList = styled.div`
display:flex;
justify-content: space-around;  /* 아이콘 기준으로 균등 분배 */
align-items:center;
padding: 18px 60px 38px;
`

const InsertReview = styled.div`
color: #000;
font-family: Pretendard;
font-size: clamp(16px, 4.44vw, 18px);
font-style: normal;
font-weight: 500;
line-height: normal;
letter-spacing: -0.08px;`

const Review = styled.div`
border-radius: 16px;
border: 0.5px solid #CBCBCB;
padding: 16px 30px;
margin-top: 8px;
`

const ReviewTitle = styled.div`
color: #000;
font-family: Pretendard;
font-size: clamp(14px, 3.89vw, 16px);
font-style: normal;
font-weight: 500;
line-height: normal;
letter-spacing: -0.07px;
`

const ReviewContents = styled.div`
margin-top:8px;
color: #555;
font-family: Pretendard;
font-size: clamp(12px, 3.33vw, 14px);
font-style: normal;
font-weight: 400;
line-height: normal;
letter-spacing: -0.06px;
`
const ReviewPhotoWrapper = styled.div`
display: flex;
gap: 8px;
overflow-x: auto; /* 여러 장일 때 가로 스크롤 */
margin-top: 12px;

img {
max-width: 100px;
max-height: 100px;
object-fit: cover;
border-radius: 8px;
}
`;

const ReviewPhoto = ({ photos = [] }) => {
    if (!photos.length) return null; // 사진 없으면 아무것도 렌더 안 함

    return (
        <ReviewPhotoWrapper>
            {photos.map((src, index) => (
                <img key={index} src={src} alt={`review-${index}`} />
            ))}
        </ReviewPhotoWrapper>
    );
};

function InformationPage({ concert }) {
    return (
        <Container>
            <ConcertImage $bg={concert.imageUrl}>
            </ConcertImage>
            <ConcertInformation>
                <ConcertTitle>{concert.title}</ConcertTitle>
                <ConcertSchedule>{concert.schedule}</ConcertSchedule>
                <ConcertContents>{concert.descripition}</ConcertContents>
                <Button variant="filled" size="small" style={{ width: "70px"}}>Go</Button>
                <MenuList>
                    <Menu>
                        <StarIcon></StarIcon>
                        내가 찜한 리스트
                    </Menu>
                    <Menu>
                        <FavariteIcon></FavariteIcon>
                        평가
                    </Menu>
                    <Menu>
                        <ShareIcon></ShareIcon>
                        공유
                    </Menu>
                </MenuList>
            <InsertReview>인서트 리뷰</InsertReview>
            {concert.reviews.map((review, idx) => (
                    <Review key={idx}>
                        <ReviewTitle>{review.title}</ReviewTitle>
                        <ReviewContents>{review.contents}</ReviewContents>
                        <ReviewPhoto photos={review.photos} />
                    </Review>
                ))}
            </ConcertInformation>
        </Container>
    )
}

export default InformationPage;