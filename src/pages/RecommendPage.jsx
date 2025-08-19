import { styled } from "styled-components";
import Button from "../components/Button";
import { ReactComponent as PreIcon } from "../assets/icons/previous.svg";
import { ReactComponent as SaveIcon } from "../assets/icons/save.svg";
import { useState, useEffect } from "react";

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
function DraggableModal({ place, onClose }) {
    const [startY, setStartY] = useState(null);

    const handleTouchStart = (e) => {
        setStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e) => {
        if (!startY) return;
        const deltaY = e.touches[0].clientY - startY;
        if (deltaY > 100) {
            onClose();
        }
    };

     // 별을 숫자만큼 배열로 채워 넣기
    const renderStars = (count) => {
        return Array.from({ length: count }, (_, i) => (
            <span key={i}>★</span>
        ));
    };

    return (
        <Modal
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
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
    );
}



function RecommendPage() {
    const [selectMode, setSelectMode] = useState(false); // 버튼 눌렀는지 여부
    const [selectedPlaces, setSelectedPlaces] = useState([]); // 선택된 장소 id 배열
    const [activePlace, setActivePlace] = useState(null); // 정보창에 띄울 장소

    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        // 실제 API 호출
        fetch("/api/recommendations")
            .then((res) => res.json())
            .then((json) => {
                if (json.success) {
                    setRecommendations(json.data.recommendations);
                }
            });
    }, []);

    const mockReview = {
        "success": true,
        "data": {
            "recommendations": [
                {
                    "category": "ACTIVITY",
                    "places": [
                        {
                            "id": 67,
                            "name": "인천대공원",
                            "description": "인천문학경기장에서 가까운 대공원으로 데이트하기 좋은 곳입니다.",
                            "imageUrl": "https://example.com/park.jpg",
                            "address": "인천광역시 미추홀구 문학동",
                            "rating": 4.5,
                            "priceRange": "FREE",
                            "openingHours": "24시간",
                            "aiReason": "커플이 데이트하기 좋은 공원으로, 저녁에도 아름다운 조명을 감상할 수 있습니다.",
                            "distanceFromVenue": 0.8
                        },
                        {
                            "id": 68,
                            "name": "문학동 벚꽃길",
                            "description": "봄철 벚꽃이 아름다운 산책로입니다.",
                            "imageUrl": "https://example.com/cherry.jpg",
                            "address": "인천광역시 미추홀구 문학동",
                            "rating": 4.3,
                            "priceRange": "FREE",
                            "openingHours": "24시간",
                            "aiReason": "커플이 산책하며 대화하기 좋은 로맨틱한 분위기의 장소입니다.",
                            "distanceFromVenue": 1.2
                        },
                        {
                            "id": 69,
                            "name": "문학동 문화거리",
                            "description": "다양한 문화시설과 카페가 있는 거리입니다.",
                            "imageUrl": "https://example.com/culture.jpg",
                            "address": "인천광역시 미추홀구 문학동",
                            "rating": 4.1,
                            "priceRange": "LOW",
                            "openingHours": "10:00-22:00",
                            "aiReason": "커플이 문화생활을 즐기며 데이트할 수 있는 다양한 옵션이 있는 장소입니다.",
                            "distanceFromVenue": 0.5
                        }
                    ]
                },
                {
                    "category": "DINING",
                    "places": [
                        {
                            "id": 70,
                            "name": "문학동 맛집",
                            "description": "인천문학경기장 근처의 유명한 맛집입니다.",
                            "imageUrl": "https://example.com/restaurant.jpg",
                            "address": "인천광역시 미추홀구 문학동",
                            "rating": 4.7,
                            "priceRange": "MEDIUM",
                            "openingHours": "11:00-21:00",
                            "aiReason": "커플이 저녁 식사를 하며 데이트할 수 있는 분위기 좋은 맛집입니다.",
                            "distanceFromVenue": 0.3
                        },
                        {
                            "id": 71,
                            "name": "문학동 카페거리",
                            "description": "다양한 테마의 카페들이 모여있는 거리입니다.",
                            "imageUrl": "https://example.com/cafe.jpg",
                            "address": "인천광역시 미추홀구 문학동",
                            "rating": 4.4,
                            "priceRange": "LOW",
                            "openingHours": "09:00-23:00",
                            "aiReason": "커플이 커피를 마시며 대화하기 좋은 아늑한 카페들이 많습니다.",
                            "distanceFromVenue": 0.6
                        },
                        {
                            "id": 72,
                            "name": "문학동 야시장",
                            "description": "저녁에 열리는 다양한 먹거리와 놀거리가 있는 야시장입니다.",
                            "imageUrl": "https://example.com/nightmarket.jpg",
                            "address": "인천광역시 미추홀구 문학동",
                            "rating": 4.2,
                            "priceRange": "LOW",
                            "openingHours": "18:00-24:00",
                            "aiReason": "커플이 저녁에 방문하기 좋은 활기찬 분위기의 야시장입니다.",
                            "distanceFromVenue": 0.4
                        }
                    ]
                },
                {
                    "category": "CAFE",
                    "places": [
                        {
                            "id": 73,
                            "name": "문학동 북카페",
                            "description": "책을 읽으며 커피를 즐길 수 있는 북카페입니다.",
                            "imageUrl": "https://example.com/bookcafe.jpg",
                            "address": "인천광역시 미추홀구 문학동",
                            "rating": 4.6,
                            "priceRange": "LOW",
                            "openingHours": "10:00-22:00",
                            "aiReason": "커플이 책을 읽으며 조용한 데이트를 즐길 수 있는 문화적인 카페입니다.",
                            "distanceFromVenue": 0.7
                        },
                        {
                            "id": 74,
                            "name": "문학동 디저트카페",
                            "description": "다양한 디저트와 음료를 즐길 수 있는 카페입니다.",
                            "imageUrl": "https://example.com/dessertcafe.jpg",
                            "address": "인천광역시 미추홀구 문학동",
                            "rating": 4.3,
                            "priceRange": "MEDIUM",
                            "openingHours": "11:00-21:00",
                            "aiReason": "커플이 달콤한 디저트를 나누며 로맨틱한 시간을 보낼 수 있는 카페입니다.",
                            "distanceFromVenue": 0.9
                        },
                        {
                            "id": 75,
                            "name": "문학동 루프탑카페",
                            "description": "루프탑에서 도시 전경을 바라보며 커피를 즐길 수 있는 카페입니다.",
                            "imageUrl": "https://example.com/rooftopcafe.jpg",
                            "address": "인천광역시 미추홀구 문학동",
                            "rating": 4.8,
                            "priceRange": "HIGH",
                            "openingHours": "12:00-23:00",
                            "aiReason": "커플이 아름다운 전경을 바라보며 특별한 데이트를 즐길 수 있는 프리미엄 카페입니다.",
                            "distanceFromVenue": 1.1
                        }]
                }]
        },
        "message": "장소 추천이 성공적으로 생성되었습니다."
    };

    return (
        <Container>
            <PreIcon></PreIcon>
            <PageTitle>님을 위한<br></br> 오늘의 추천 장소입니다.</PageTitle>
            <PageSubTitle>Insert가 알려준 추천 장소로 인천을 즐겨 보세요.</PageSubTitle>
            {mockReview.data.recommendations.map((categoryItem) => (
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
                            <PlaceContents>{place.description}</PlaceContents>
                        </PlaceWrapper>
                    ))}
                </div>
            ))}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
                <Button variant="filled" size="small" icon={<SaveIcon />} onClick={() => setSelectMode(!selectMode)}>  {selectMode ? "선택 완료" : "장소 선택하기"}
                </Button>
            </div>
            {activePlace && <DraggableModal place={activePlace} onClose={() => setActivePlace(null)} />}

        </Container>
    )
}

export default RecommendPage;