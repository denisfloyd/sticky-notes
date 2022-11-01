import styled, { css } from "styled-components";

interface ContainerProps {
  backgroundColor: string;
}

export const Container = styled.div<ContainerProps>`
  position: absolute;
  text-align: center;
  z-index: 1;

  ${(props) =>
    props.backgroundColor &&
    css`
      header,
      textarea {
        background-color: ${props.backgroundColor};
      }
    `}
`;

export const HeaderMoveContainer = styled.header`
  height: 40px;
  cursor: move;

  border: 1px solid ${({ theme }) => theme.colors.background};
`;

export const TextAreaContainer = styled.textarea`
  outline: none;
  border: none;
  min-width: 200px;
  min-height: 200px;
  padding: 20px;
  font-family: ${({ theme }) => theme.font.family};
  font-size: 14px;
`;
