import { styled } from "styled-components";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Button from "../../components/Button";
import { ReactComponent as GoogleIcon } from "../../assets/icons/google.svg"
import { ReactComponent as Character } from "../../assets/icons/character.svg"
import { useNavigate } from "react-router-dom";

const Container = styled.div`
max-width: 600px; min-width: 360px; margin: 0 auto; 
padding: 18px;
`;

const InsertTitleWrapper = styled.div`
position: absolute; /* 화면 기준 위치 */
top: 40%;
left: 50%;
transform: translate(-50%, -50%); /* 중앙 맞춤 */
text-align: center; /* 텍스트 중앙 정렬 */
`;

const InsertTitle = styled.div`
color: #DF3B1E;
font-family: Pretendard;
font-size: 50px;
font-weight: 800;
letter-spacing: -0.25px;
`;

const InsertSub = styled.div`
color: #000;
font-family: Pretendard;
font-size: 20px;
font-weight: 500;
letter-spacing: 0.02px;
margin-top: 24px; /* 제목과 서브 간격 */
line-height: 130%; 
`;

const ButtonWrapper = styled.div`
display: flex;
justify-content: center;
position: absolute;
top: 70%; // 타이틀보다 아래
left: 50%;
transform: translateX(-50%); `;

const LoginButton = styled.button`
display: inline-flex;
padding: 8px 24px;
align-items: center;
gap: 8px;
border-radius: 5px;
border: 1px solid #D9D9D9;
background: #FFF;`

function LoginPage() {
//     const navigate = useNavigate();

//     const handleMockLogin = async () => {
//         // 가짜 JWT와 유저 데이터 (sub = userId)
//         const jwt = "mock-jwt-token";
//         const userName = "TestUser";
//         const userEmail = "testuser@example.com";
//         const userId = "108672889987053400743"; // Google sub를 mock

//         // localStorage에 저장
//         localStorage.setItem("muglog_token", jwt);
//         localStorage.setItem("user_name", userName);
//         localStorage.setItem("user_email", userEmail);
//         localStorage.setItem("user_id", userId); // userId 저장

//         // 로그인 성공 페이지로 이동
//         navigate(`/NameSettingPage`);
//     };
//     return (
//         <Container>
//             <InsertTitleWrapper>
//                 <Character></Character>
//                 <InsertTitle>InSert</InsertTitle>
//                 <InsertSub>하루의 특별한 순간<br></br>InSert가 함께 할게요.</InsertSub>
//             </InsertTitleWrapper>
//             <ButtonWrapper>
//                 <LoginButton onClick={handleMockLogin}>
//                     <GoogleIcon />Google 계정으로 시작하기</LoginButton>
//             </ButtonWrapper>
//         </Container>
//     )
// }

const navigate = useNavigate();

    useEffect(() => {
        // 로그인 상태 확인
        fetch(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
            method: "GET",
            credentials: "include",
        })
            .then(res => {
                if (res.status === 200) navigate("/NameSettingPage"); // 이미 로그인 됐으면 바로 이동
            })
            .catch(() => console.log("로그인 필요"));
    }, [navigate]);
    return (
        <Container>
            <InsertTitleWrapper>
                <Character></Character>
                <InsertTitle>InSert</InsertTitle>
                <InsertSub>하루의 특별한 순간<br></br>InSert가 함께 할게요.</InsertSub>
            </InsertTitleWrapper>
            <ButtonWrapper>
                <LoginButton as="a"
                    href="https://insert-back.duckdns.org/oauth2/authorization/google">
                    <GoogleIcon />Google 계정으로 시작하기</LoginButton>
            </ButtonWrapper>
        </Container>
    )
}

export default LoginPage;