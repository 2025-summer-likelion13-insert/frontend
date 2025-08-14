// src/components/Button.js
import styled, { css } from "styled-components";

const ButtonWrapper = styled.button`
border-radius: 999px;
background: #DF3B1E;
display: inline-flex;
padding: 8px 16px;
justify-content: center;
align-items: center;
gap: 8px;
flex-shrink: 0;

${({ variant }) => variant === "filled" && css`
background-color: #DF3B1E;
color: white; 
border: none;`}

${({ variant }) => variant === "outline" && css`
background-color: transparent;
border: 1px solid #DF3B1E;`}

${({ size }) => size === "small" && css`
height: 32px;`}

${({ size }) => size === "medium" && css`
height: 40px;`}

${({ size }) => size === "large" && css`
height: 48px;`}
`;


export default function Button({ icon, children, ...props }) {
        return (
                <ButtonWrapper {...props}>
                        {icon && <span>{icon}</span>}
                        {children}
                </ButtonWrapper>
        );
}