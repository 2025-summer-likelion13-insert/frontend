import { styled } from "styled-components";
import Button from "../components/Button";
import { ReactComponent as GroupIcon } from "../assets/icons/gmail_groups.svg";
import { ReactComponent as CoupleIcon } from "../assets/icons/favorite.svg";
import { ReactComponent as PersonIcon } from "../assets/icons/person.svg";
import { ReactComponent as PreIcon } from "../assets/icons/previous.svg";
import { ReactComponent as Calender } from "../assets/icons/calender.svg";
import { ReactComponent as Location } from "../assets/icons/location.svg";
import { ReactComponent as Bus } from "../assets/icons/bus.svg";
import { ReactComponent as Car } from "../assets/icons/car.svg";
import { ReactComponent as Subway } from "../assets/icons/subway.svg";
import { ReactComponent as Walk } from "../assets/icons/walk.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {api} from "../lib/api"

import MenuItem from "../components/MenuToggle";
import { useState } from "react";
import { PrefetchPageLinks } from "react-router-dom";

const Container = styled.div`
max-width: 600px; min-width: 360px; margin: 0 auto; 
padding: 18px;
`;

const PageTitle = styled.div`
color: #000;
text-align: center;
font-family: Pretendard;
font-size: 20px;
font-style: normal;
font-weight: 500;
line-height: normal;
letter-spacing: 0.02px;`


const Header = styled.div`
display: flex;
justify-content: center;
align-items: center;
position: relative;
margin-bottom:18px;

`;

const PreIconWrapper = styled.div`
position: absolute;
left: 0;
`;

const InfoBox = styled.div`
border-radius: 16px;
border: 0.5px solid #DF3B1E;
padding: 18px;
margin: 0 auto;
width: 100%;
box-sizing: border-box;
background-image: #fff;
margin-bottom: 36px;
gap: 16px; /* 이미지와 텍스트 사이 간격 */
display: flex;

  /* input이면 내부 스타일 변경 */
textarea {
    width: 100%;
    height: 100%;
    border: none;
    resize: none;
    outline: none;
    font-family: Pretendard;
    font-size: 16px;
}
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

const MenuTitle = styled.div`
color: #000;
font-family: Pretendard;
font-size: 16px;
font-style: normal;
font-weight: 500;
line-height: normal;
letter-spacing: 0.016px;
margin-bottom: 10px;

`

const MenuItemList = styled.div`
display: flex;
// justify-content: space-between;
// align-items: flex-start;
// flex-shrink: 0;
// margin: 0;
margin-bottom: 20px;
width: 100%;
gap: 13px;        // 아이템 사이 간격 고정

`

function InsertPlacePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { externalId } = useParams();

    const [concertData, setConcertData] = useState(location.state?.concertData || null);
    const [loading, setLoading] = useState(!concertData);
    const [error, setError] = useState("");


    const Profileitems = [
        { id: 1, text: "가족", icon: <GroupIcon /> },
        { id: 2, text: "혼자", icon: <PersonIcon /> },
        { id: 3, text: "커플", icon: <CoupleIcon /> },
    ];

    const Vehicleitems = [
        { id: "a", text: "도보", icon: <Walk /> },
        { id: "b", text: "자동차", icon: <Car /> },
        { id: "c", text: "지하철", icon: <Subway /> },
        { id: 4, text: "버스", icon: <Bus /> },
    ];

    const [activeId1, setActiveId1] = useState(Profileitems[0].id);
    const [activeId2, setActiveId2] = useState(Vehicleitems[0].id);
    const [customConditions, setCustomConditions] = useState(""); // textarea

    useEffect(() => {
        if (!concertData && externalId) {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const data = await api(`/api/performs/by-external/${externalId}`);
                    setConcertData(data);
                } catch (e) {
                    console.error(e);
                    setError("공연 데이터를 불러오지 못했습니다.");
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [concertData, externalId]);

    async function handleSubmit() {
        const selected1 = Profileitems.find((i) => i.id === activeId1);
        const selected2 = Vehicleitems.find((i) => i.id === activeId2);
        const profileMap = {
            "가족": "FAMILY",
            "혼자": "ALONE",
            "커플": "COUPLE",
        };
        const
            vehicleMap = {
                "도보": "WALK",
                "자동차": "CAR",
                "지하철": "SUBWAY",
                "버스": "BUS"
            };
        const profileTypeValue = profileMap[selected1.text];
        const vehicleTypeValue = vehicleMap[selected2.text];

        try {
            const data = await api("/api/place-recommendations/recommendations", {
                method: "POST",
                body: JSON.stringify({
                    venueName: concertData.venueName,
                    profileType: profileTypeValue,
                    transportationMethod: vehicleTypeValue,
                    customConditions: customConditions,
                }),
            });

            navigate("/RecommendPage", { state: { recommendations: data } });
        } catch (err) {
            console.error(err);
        }
    }

    if (loading) return <Container>불러오는 중…</Container>;
    if (error) return <Container>{error}</Container>;
    if (!concertData) return <Container>데이터가 없습니다.</Container>;

    return (
        <Container>
            <Header>
                <PreIconWrapper>
                    <PreIcon></PreIcon>
                </PreIconWrapper>

                <PageTitle>Insert 플레이스</PageTitle>
            </Header>
            <InfoBox style={{ height: "176px" }}>
                <InfoImage src={concertData.posterUrl} alt={concertData.title} />
                <InfoText>
                    <ConcertTitle>{concertData.title}</ConcertTitle>
                    <InfoRow>
                        <Location></Location>
                        <InfoRowText>{concertData?.venueName}</InfoRowText>
                    </InfoRow>
                    <InfoRow>
                        <Calender></Calender>
                        <InfoRowText>{concertData?.startDate && concertData?.endDate
                            ? `${concertData.startDate} ~ ${concertData.endDate}`
                            : '-'}</InfoRowText>
                    </InfoRow>
                    <ConcertContents>{concertData?.synopsis || ''}</ConcertContents>
                </InfoText>
            </InfoBox>
            <MenuTitle>프로필 선택</MenuTitle>
            <MenuItemList>
                {Profileitems.map((item) => (
                    <MenuItem
                        key={item.id}
                        icon={item.icon}
                        text={item.text}
                        isActive={item.id === activeId1}
                        onClick={() => setActiveId1(item.id)}
                    />
                ))}
            </MenuItemList>
            <MenuTitle>이동수단</MenuTitle>
            <MenuItemList>
                {Vehicleitems.map((item) => (
                    <MenuItem
                        key={item.id}
                        icon={item.icon}
                        text={item.text}
                        isActive={item.id === activeId2}
                        onClick={() => setActiveId2(item.id)}
                    />
                ))}
            </MenuItemList>
            <MenuTitle>그 외 원하시는 조건을 입력하세요.</MenuTitle>
            <InfoBox style={{ height: "128px" }}>
                <textarea placeholder="내용을 입력하세요." value={customConditions}
                    onChange={(e) => setCustomConditions(e.target.value)} />
            </InfoBox>
            <Button
                variant="filled"
                size="small"
                style={{
                    width: "100%"
                }}
                onClick={handleSubmit}
            >
                Insert 추천
            </Button>
        </Container>
    )
}

export default InsertPlacePage;