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

const Logo = styled.div`
color: #DF3B1E;
font-family: Pretendard;
font-size: 24px;
font-style: normal;
font-weight: 800;
line-height: normal;
letter-spacing: -0.12px;
`
const Wrapper = styled.div`
display:flex;
flex-direction: column;
align-items: center; 
transform: translateY(-50%) translateX(-50%);
position: absolute;
left: 50%;
top: 50%;
`
const WelcomeText = styled.div`
color: #000;
text-align: center;
font-family: Pretendard;
font-size: 24px;
font-style: normal;
font-weight: 600;
line-height: normal;
letter-spacing: 0.024px;
`

function WelcomePage() {
    
    return (
        <Container>
            <Logo>InSert</Logo>
            <Wrapper>
            <Character></Character>
            <WelcomeText>환영합니다!</WelcomeText>
            </Wrapper>
        </Container>
        //몇 초 후 메인 홈으로 이동하는 페이지 만들 것.
    )
}

export default WelcomePage;