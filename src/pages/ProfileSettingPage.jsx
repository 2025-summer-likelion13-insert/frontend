import { styled } from "styled-components";
import { ReactComponent as CancelIcon } from "../assets/icons/cancel.svg"
import { ReactComponent as LightCancelIcon } from "../assets/icons/light_cancel.svg"
import Button from "../components/Button";

const Container = styled.div`
max-width: 600px; min-width: 360px; margin: 0 auto; 
padding: 18px;
`;

const ProfilePhoto = styled.img`
width:72px;
height:72px;
border-radius: 50%; /* 동그랗게 하고 싶으면 추가 */
object-fit: cover;  /* 비율 맞게 */
margin: 0 auto;
display: flex;
margin-top: 144px;
`

const NameInputWrapper = styled.div`
display: flex;
align-items: center;
margin: 0 36px;
margin-top: 28px;
border-bottom: 1px solid #F1F1F1;;
`
const NameInput = styled.input`
border:none;
color: #000;
text-align: center;
font-family: Pretendard;
font-size: 17px;
font-style: normal;
font-weight: 400;
line-height: normal;
letter-spacing: -0.085px;
width: 152px;
margin: 0 auto;
padding: 4px 0px;
`

const SubText = styled.div`
margin: 0 36px;
color: #CBCBCB;
font-family: Inter;
font-size: 10px;
font-style: normal;
font-weight: 400;
line-height: normal;
letter-spacing: -0.05px;`

function ProfileSettingPage() {
    return (
        <Container>
            <CancelIcon></CancelIcon>
            <ProfilePhoto src={"숀.jpeg"}></ProfilePhoto>
            <NameInputWrapper>
                <NameInput></NameInput>
                <LightCancelIcon></LightCancelIcon>
            </NameInputWrapper>
            <Button style={{
                margin: "18px 36px",
                width: "calc(100% - 72px)"
            }} variant="filled"
                size="small">수정완료</Button>
            <SubText>한글/영어/숫자/밑줄/띄어쓰기를 사용할 수 있습니다.</SubText>
        </Container>
    )
}

export default ProfileSettingPage;