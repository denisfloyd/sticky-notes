import styled, { css } from 'styled-components';

interface ContainerProps {
  backgroundColor: string;
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
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

  border-bottom: 1px solid ${({ theme }) => theme.colors.background};
`;
