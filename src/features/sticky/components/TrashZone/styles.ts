import styled from "styled-components";
import { TrashZoneDimensions } from "../../../../utils";

export const Container = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  height: ${TrashZoneDimensions.height}px;
  width: ${TrashZoneDimensions.width}px;
  background-color: ${({ theme }) => theme.colors.secondary["&hover"]};

  &:before {
    content: "Trash Zone";
    font-size: 20px;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
`;
