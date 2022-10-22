import styled from 'styled-components';
import theme from '../../../../styles/theme';
import { TrashZoneDimensions } from '../../../../utils';

export const Container = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  height: ${TrashZoneDimensions.height}px;
  width: ${TrashZoneDimensions.width}px;
  background-color: ${theme.colors.trashZoneBackground};

  &:before {
    content: 'Trash Zone';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
`;