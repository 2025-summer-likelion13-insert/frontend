import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ReactComponent as ErrorIcon } from "../../assets/icons/error.svg"

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

const Title = styled.div`
color: #000;
text-align: center;
font-family: Pretendard;
font-size: 24px;
font-style: normal;
font-weight: 600;
line-height: normal;
letter-spacing: 0.024px;
margin-top: 100px;`

const Sub = styled.div`
color: #676769;
text-align: center;
font-family: Pretendard;
font-size: 14px;
font-style: normal;
font-weight: 600;
line-height: normal;
letter-spacing: 0.014px;
margin-top:20px;
white-space: pre-line; 

`
const InputWrapper = styled.div`
display: inline-flex;
justify-content: space-between;
align-items: center;
width:270px;
border-radius: 10px;
border: 1px solid #F1F1F1;
background: #F1F1F1;
padding:12px 16px;
margin-top: 36px;
right: 50%;
transform: translateX(50%);
`
const InputName = styled.input`
color: #000;
font-family: Pretendard;
font-size: 13px;
font-style: normal;
font-weight: 500;
line-height: normal;
letter-spacing: 0.013px;
border: none;
background: transparent;`

const Check = styled.div`
color: #DF3B1E;
font-family: Pretendard;
font-size: 11px;
font-style: normal;
font-weight: 500;
line-height: normal;
letter-spacing: 0.011px;
`

const ButtonWrapper = styled.div`
display: flex;
justify-content: space-between;
position: absolute;
bottom: 40px; /* 화면 아래에서 40px 위 */
box-sizing: border-box;
right: 50%;
transform: translateX(50%);
max-width: 600px;
min-width: 360px; 
padding: 18px;
`

const MoveButton = styled.button`
display: flex;
width: 40px;
height: 40px;
padding:10px;
justify-content: center;
align-items: center;
flex-shrink: 0;
border-radius: 16px;
border: none;
`

function NameSettingPage() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [isValid, setIsValid] = useState(false);

    const validateName = (value) => {
        const regex = /^[가-힣]{2,10}$/;
        if (value === "") {
            setError(""); // 아무것도 안 썼을 때는 공백
            setIsValid(false);
        } else if (!regex.test(value)) {
            setError(`2-10글자의 한글로 입력해 주세요. \n(숫자 및 특수기호 제외)`);
            setIsValid(false);
        } else {
            setError(""); // 유효하면 공백
            setIsValid(true);
        }
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setName(value);
        validateName(value);

        const regex = /^[가-힣]{2,10}$/;
        setIsValid(regex.test(value));
    };

    const handleMoveNext = () => {
    if (!isValid) return;

    // 입력한 닉네임을 user_id로 저장
    localStorage.setItem("user_name", name);

    // 다음 페이지로 이동
    navigate("/home"); // 원하는 경로
};

    return (
        <Container>
            <Logo>InSert</Logo>
            <Title>2-10 글자 이내<br></br>닉네임을 정해주세요</Title>
      <Sub>{error}</Sub> {/* 여기서 공백/경고문구 출력 */}
            <InputWrapper>
                <InputName value={name} onChange={handleChange} />
                {name.length > 0 && (
                    <Check isValid={isValid}>
                        {isValid ? "사용 가능" : <ErrorIcon></ErrorIcon> }
                    </Check>
                )}
            </InputWrapper>
            <ButtonWrapper>
                <MoveButton onClick={() => navigate("/")}>←</MoveButton>
                <MoveButton
                    style={{
                        background: isValid ? "#DF3B1E" : "#efefef",
                        color: isValid ? "#fff": "#000",
                        cursor: isValid ? "pointer" : "not-allowed",
                    }}
                    disabled={!isValid}
                    onClick={handleMoveNext}
                >
                    →
                </MoveButton>
            </ButtonWrapper>
        </Container>
    )
}

export default NameSettingPage;