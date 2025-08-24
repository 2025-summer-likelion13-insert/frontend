import { styled } from "styled-components";
import Button from "../components/Button";
import { ReactComponent as PreIcon } from "../assets/icons/previous.svg";
import { ReactComponent as SaveIcon } from "../assets/icons/save.svg";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
max-width: 600px; min-width: 360px; margin: 0 auto; 
padding: 18px;
`;

const PageTitle = styled.div`
color: #000;
font-family: Pretendard;
font-size: 16px;
font-style: normal;
font-weight: 500;
line-height: normal;
letter-spacing: 0.016px;
margin-top:21px;`

const PageSubTitle = styled.div`
color: #212121;
font-family: Pretendard;
font-size: 12px;
font-style: normal;
font-weight: 400;
line-height: normal;
letter-spacing: 0.012px;
margin-top:8px;
margin-bottom:32px;`

const Category = styled.div`
color: #000;
font-family: Pretendard;
font-size: 14px;
font-style: normal;
font-weight: 500;
line-height: normal;
letter-spacing: 0.014px;
margin-bottom:8px;`

const PlaceWrapper = styled.div`
display: flex;
flex-direction: column; /* 세로 배치 */
padding: 16px;
border-radius: 20px;
border: 0.5px solid #D9D9D9;
background: #FFF;
margin-bottom:12px;
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
const ModalName = styled.div`
color: #000;
font-family: Pretendard;
font-size: 14px;
font-style: normal;
font-weight: 500;
line-height: 100%; /* 14px */
letter-spacing: 0.014px;
`

const ModalCategory = styled.div`
color: #9B9B9B;
text-align: center;
font-family: Pretendard;
font-size: 12px;
font-style: normal;
font-weight: 400;
line-height: 100%; /* 12px */
letter-spacing: 0.012px;
`

const ModalContent = styled.div`
color: #9B9B9B;
font-family: Pretendard;
font-size: 10px;
font-style: normal;
font-weight: 400;
line-height: 100%; /* 10px */
letter-spacing: 0.01px;
`;

const ModalImages = styled.div`
display: flex;
gap: 8px;
margin-top: 8px;
`;

const ModalImage = styled.img`
width: 60px;
height: 60px;
object-fit: cover;
border-radius: 8px;
`;

const Modal = styled.div`
position: fixed;
bottom: 0;
left: 0;
right: 0;
max-width: 600px;
min-width: 360px;
margin: 0 auto;
max-height: 70vh;   
overflow-y: auto;  
background: white;
padding: 16px;
border-radius: 32px 32px 0 0;
box-shadow: 0 -2px 10px -5px rgba(155, 155, 155, 0.50);
`;

const ModalTop = styled.div`
display: flex;
align-items: center;
gap: 8px;
`;

const ModalRate = styled.div`
color: #000;
font-family: Pretendard;
font-size: 10px;
font-style: normal;
font-weight: 300;
line-height: 100%; /* 10px */
letter-spacing: 0.01px;
`
const ModalStar = styled.div`
`
const ModalBackground = styled.div`
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
background: rgba(0,0,0,0.4);
display: flex;
justify-content: center;
align-items: flex-end;
z-index: 1000;
`;

function DraggableModal({ place, onClose }) {
    const [startY, setStartY] = useState(null);

    // 별을 숫자만큼 배열로 채워 넣기
    const renderStars = (count) => {
        return Array.from({ length: count }, (_, i) => (
            <span key={i}>★</span>
        ));
    };

    return (
        <ModalBackground onClick={onClose}>
            <Modal onClick={(e) => e.stopPropagation()}
            >
                <ModalTop>
                    <ModalName>{place.name}</ModalName>
                </ModalTop>
                <ModalTop>
                    <ModalRate>{place.rating}</ModalRate>
                    <ModalStar>{renderStars(place.rating)}</ModalStar>
                </ModalTop>
                <ModalContent>{place.description}</ModalContent>
                {place.imageUrl && (
                    <ModalImages>
                        <ModalImage src={place.imageUrl} alt={place.name} />
                    </ModalImages>
                )}
            </Modal>
        </ModalBackground>
    );
}

function RecommendPage() {
    const [selectMode, setSelectMode] = useState(false); // 버튼 눌렀는지 여부
    const [selectedPlaces, setSelectedPlaces] = useState([]); // 선택된 장소 id 배열
    const [activePlace, setActivePlace] = useState(null); // 정보창에 띄울 장소
    const [name, setName] = useState("");
    const [userId, setUserId] = useState(null);

    useEffect(() => {
    fetch("https://insert-back.duckdns.org/api/auth/me", {
        method: "GET",
        credentials: "include",
    })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(data => {
            setName(data.name);
            setUserId(data.id); // 여기서 userId 받아오기
        })
        .catch(err => console.error("API 호출 실패:", err));
}, []);

    const location = useLocation();
    const navigate = useNavigate();

    const recommendations = location.state?.recommendations?.data?.recommendations || [];

    const handleAddToSchedule = async () => {
        if (!userId) {
            alert("유저 정보 로딩 중입니다.");
            return;
        }

        try {
            await Promise.all(selectedPlaces.map(placeId =>
            fetch("https://insert-back.duckdns.org/api/schedules/places", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: userId,
                    eventId: 1,          // 필요한 eventId
                    placeId: placeId
                }),
                credentials: "include", // 쿠키 인증 포함
            })
        ));
        setSelectMode(false);
        setSelectedPlaces([]);
        navigate("/VisitSchedulePage");
        } catch (err) {
            console.error(err);
            alert("장소 추가 실패");
        }
    };
    return (
        <Container>
            <PreIcon></PreIcon>
            <PageTitle>{name} 님을 위한<br></br> 오늘의 추천 장소입니다.</PageTitle>
            <PageSubTitle>Insert가 알려준 추천 장소로 인천을 즐겨 보세요.</PageSubTitle>
            {recommendations.map((categoryItem) => (
                <div key={categoryItem.category}>
                    <Category>{categoryItem.category}</Category>
                    {categoryItem.places.map((place) => (
                        <PlaceWrapper key={place.id}
                            onClick={() => {
                                if (selectMode) {
                                    setSelectedPlaces(prev =>
                                        prev.includes(place.id)
                                            ? prev.filter(id => id !== place.id)
                                            : [...prev, place.id]
                                    );
                                } else {
                                    setActivePlace(place);
                                }
                            }}
                            style={{
                                border: selectedPlaces.includes(place.id)
                                    ? "0.5px solid #DF3B1E" // 선택되면 테두리 강조
                                    : "0.5px solid #D9D9D9",
                            }}
                        >
                            <PlaceHeader>
                                <PlaceImage src={place.imageUrl} alt={place.name} />
                                <PlaceTextWrapper>
                                    <PlaceTitle>{place.name}</PlaceTitle>
                                    <PlaceSubTitle>{place.address}</PlaceSubTitle>
                                </PlaceTextWrapper>
                            </PlaceHeader>
                            <PlaceContents>{place.aiReason}</PlaceContents>
                        </PlaceWrapper>
                    ))}
                </div>
            ))}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
                <Button
                    variant="filled"
                    size="small"
                    icon={<SaveIcon />}
                    onClick={() => {
                        if (selectMode) {
                            handleAddToSchedule(); // 선택 완료 시 서버 전송
                        } else {
                            setSelectMode(true); // 선택 모드 시작
                        }
                    }}
                >
                    {selectMode ? "선택 완료" : "장소 선택하기"}
                </Button>
            </div>
            {activePlace && <DraggableModal place={activePlace} onClose={() => setActivePlace(null)} />}

        </Container>
    )
}

export default RecommendPage;