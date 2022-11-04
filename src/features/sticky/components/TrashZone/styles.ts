import styled, { css } from 'styled-components';
import { TrashZoneDimensions } from '../../../../utils';

interface ContainerProps {
  isHighlighted: boolean;
}

export const Container = styled.div<ContainerProps>`
  position: fixed;
  bottom: 0;
  right: 0;
  height: ${TrashZoneDimensions.height}px;
  width: ${TrashZoneDimensions.width}px;
  background-color: ${({ theme }) => theme.colors.secondary['&hover']};
  transition: all ${({ theme }) => theme.transition.fast};

  ${(props) =>
    props.isHighlighted &&
    css`
      outline: 2px dashed ${({ theme }) => theme.colors.primary.color};
      background-color: ${({ theme }) => theme.colors.secondary.color};

      &:before {
        color: #fff;
      }
    `}

  &:before {
    content: 'Trash Zone';
    font-size: 20px;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    transition: color ${({ theme }) => theme.transition.fast};
  }
`;
