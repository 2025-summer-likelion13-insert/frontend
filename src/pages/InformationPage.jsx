import Styled from "styled-components";
import Button from "../components/Button";

const Container = Styled.div`
max-width: 600px; margin: 0 auto; padding: 16px;
`;

const ConcertImage = Styled.div`
height: 376px;
flex-shrink: 0;
background-image: url(${props => props.bg});
background-size: cover;
background-position: center;
background-repeat: no-repeat;
`
const ConcertInformation = Styled.div`
height: 528px;
flex-shrink: 0;
background: #fff;
border-radius: 32px 32px 0px 0px;
`

function InformationPage({imageUrl}) {
    return (
        <Container>
            <ConcertImage bg={imageUrl}>
            </ConcertImage>
            <ConcertInformation>
                <Button variant="filled" size="small">Go</Button>
            </ConcertInformation>
        </Container>
    )
}

export default InformationPage;