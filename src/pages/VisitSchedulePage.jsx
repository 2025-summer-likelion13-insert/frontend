import { styled } from "styled-components";
import Button from "../components/Button";
import { ReactComponent as Calender } from "../assets/icons/calender.svg";
import { ReactComponent as Location } from "../assets/icons/location.svg";
import { ReactComponent as Share } from "../assets/icons/share.svg";
import { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";

const Container = styled.div`
max-width: 600px; min-width: 360px; margin: 0 auto; 
padding: 18px 18px 0px 18px;
`;

const Header = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
position: relative;
margin-bottom:12px;
`
const PageTitle = styled.div`
color: #000;
font-family: Pretendard;
font-size: 14px;
font-style: normal;
font-weight: 500;
line-height: 130%; /* 18.2px */
letter-spacing: 0.014px;`

const Highlight = styled.span`
color: #DF3B1E;
font: inherit; /* 부모 폰트 속성 그대로 상속 */
font-weight: 600;
`;

const InfoBoxWrapper = styled.div`
z-index: 2;
position: relative; 
background: linear-gradient(180deg, #FFF 0%, #FFF 90%, rgba(236, 238, 237, 0.50) 100%);
    padding-bottom: 36px;
margin-bottom: -50px;
`

const InfoBox = styled.div`
border-radius: 16px;
border: 0.5px solid #DF3B1E;
padding: 18px;
margin: 0 auto;
width: 100%;
height: 176px;
box-sizing: border-box;
gap: 16px; /* 이미지와 텍스트 사이 간격 */
display: flex;
`;

const InfoImage = styled.img`
width: 98px;  // 원하는 크기
height: 142px;
object-fit: cover;
`;

const InfoText = styled.div`
flex: 1; // 남은 공간 채움
font-family: Pretendard;
`;

const InfoRow = styled.div`
display: flex;
align-items: center;
gap: 8px; /* 아이콘과 텍스트 사이 간격 */
margin-bottom: 5px;
`;

const InfoRowText = styled.div`
color: #9B9B9B;
font-family: Pretendard;
font-size: clamp(10px, 3.33vw, 14px); // 360px 기준 12px
font-style: normal;
font-weight: 500;
line-height: normal;
letter-spacing: 0.012px;
`;

const ConcertTitle = styled.div`
color: #000;
font-family: Pretendard;
font-size: clamp(16px, 5vw, 24px); // 360px 기준 16px
font-style: normal;
font-weight: 700;
line-height: normal;
letter-spacing: 0.016px;
margin-bottom:16px;`

const ConcertContents = styled.div`
color: #9B9B9B;
font-family: Pretendard;
font-size: clamp(10px, 2.5vw, 15px); // 360px 기준 10px
font-style: normal;
font-weight: 300;
line-height: 130%; /* 13px */
letter-spacing: -0.05px;
margin-top:13px;`

const MapWrapper = styled.div`
position: relative; /* PlaceSlider를 절대 위치로 띄우기 위해 필요 */
width: 100%;
height: calc(100vh - 230px);`

const PlaceSlider = styled.div`
display: flex;
flex-direction: row;  
gap: 12px;
overflow-x: auto;    
scroll-snap-type: x mandatory; 
position: absolute;  
bottom: 16px;  
left: 0;
right: 0;
padding: 0 16px;
z-index: 10;      
&::-webkit-scrollbar {
display: none; /* 스크롤바 안 보이게 */
}
`

const PlaceWrapper = styled.div`
flex: 0 0 70%;  /* 부모 너비의 70%만큼 차지하면서 고정 */
display: flex;
flex-direction: column; /* 세로 배치 */
padding: 16px;
border-radius: 20px;
border: 0.5px solid #DF3B1E;
background: #FFF;
margin-bottom:12px;
scroll-snap-align: start; /* 스냅 위치 맞춤 */
`;

const PlaceHeader = styled.div`
display: flex;
align-items: center;
`;

const PlaceImage = styled.img`
width: 36px;
height: 36px;
border-radius: 10px;
object-fit: cover;
`;

const PlaceTextWrapper = styled.div`
display: flex;
flex-direction: column; /* 세로 정렬 */
margin-left: 12px; /* 이미지와 텍스트 사이 간격 */
`;

const PlaceTitle = styled.div`
color: #000;
font-family: Pretendard;
font-size: 12px;
font-style: normal;
font-weight: 500;
line-height: 100%; /* 12px */
letter-spacing: 0.012px;
margin-bottom: 4px;
`;

const PlaceSubTitle = styled.div`
color: #9B9B9B;
font-family: Pretendard;
font-size: 8px;
font-style: normal;
font-weight: 500;
line-height: 100%; /* 8px */
letter-spacing: 0.008px;
`;

const PlaceContents = styled.div`
color: #9B9B9B;
font-family: Pretendard;
font-size: 10px;
font-style: normal;
font-weight: 400;
line-height: 100%; /* 10px */
letter-spacing: 0.01px;
margin-top: 8px;
`

function VisitSchedulePage() {

    const [places, setPlaces] = useState([]);
    const userId = 1; // 저장한 user_id
    const user = localStorage.getItem("user_name");
    const eventId = 1; // 현재 이벤트 ID

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const res = await fetch(`/api/schedules/users/${userId}/events/${eventId}`);
                if (!res.ok) throw new Error("서버 에러");
                const data = await res.json();
                setPlaces(data.data);
            } catch (err) {
                console.error(err);
                alert("일정 조회 실패");
            }
        };

        fetchSchedule();
    }, [userId, eventId]);

    return (
        <Container>
            <Header>
                <PageTitle>{user} 님을 위한<br></br> <Highlight>오늘의 방문 일정</Highlight>입니다.</PageTitle>
                <Share></Share>
            </Header>
            <InfoBoxWrapper>
                {places.map(p => (
                    <InfoBox key={p.id}>
                        <InfoImage src={p.imageUrl} alt={p.name} />
                        <InfoText>
                            <ConcertTitle>{p.name}</ConcertTitle>
                            <InfoRow>
                                <Location />
                                <InfoRowText>{p.address}</InfoRowText>
                            </InfoRow>
                            <InfoRow>
                                <Calender />
                                <InfoRowText>{p.openingHours}</InfoRowText>
                            </InfoRow>
                            <ConcertContents>{p.aiReason}</ConcertContents>
                        </InfoText>
                    </InfoBox>
                ))}
            </InfoBoxWrapper>
            <MapWrapper>
                <Map
                    center={{ lat: 37.4563, lng: 126.7052 }}
                    style={{ width: '100%', height: '100%' }}
                    level={6}
                />
                <PlaceSlider>

                    {places.map((p) => (
                        <PlaceWrapper key={p.id}>
                            <PlaceHeader>
                                <PlaceImage src={p.imageUrl} alt={p.name} />
                                <PlaceTextWrapper>
                                    <PlaceTitle>{p.name}</PlaceTitle>
                                    <PlaceSubTitle>{p.address} · ⭐ {p.rating}</PlaceSubTitle>
                                </PlaceTextWrapper>
                            </PlaceHeader>
                            <PlaceContents>{p.aiReason}</PlaceContents>
                        </PlaceWrapper>
                    ))}
                </PlaceSlider>
            </MapWrapper>
        </Container>
    )
}

export default VisitSchedulePage;