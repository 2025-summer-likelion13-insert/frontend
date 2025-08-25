import styled from "styled-components";
import PropTypes from "prop-types";

const ToggleWrapper = styled.div`
flex:1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 72px;
  height: 46px;
  gap: 2px;
  text-align: center;
  font-family: Pretendard;
  font-size: clamp(8px, 2.22vw, 10px);
  font-style: normal;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: -0.04px;
  border-radius: 4px;
  background: #FFF;
box-shadow: 0 4px 2.9px 0 rgba(0, 0, 0, 0.10);
text-align: center;
font-family: Pretendard;
font-size: 8px;
font-style: normal;
font-weight: 400;
line-height: 100%; /* 8px */
letter-spacing: -0.04px;

  color: ${(props) => (props.$isActive ? "#DF3B1E" : "#000")};
  border: ${(props) => (props.$isActive ? "0.5px solid #DF3B1E" : "#CBCBCB")};
  cursor: pointer;

  svg {
    fill: ${(props) => (props.$isActive ? "#DF3B1E" : "#000")};
  }
`;

function MenuToggle({ icon, text, isActive, onClick }) {
  return (
    <ToggleWrapper $isActive={isActive} onClick={onClick}>
      {icon}
      {text}
    </ToggleWrapper>
  );
}

MenuToggle.propTypes = {
  icon: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default MenuToggle;
