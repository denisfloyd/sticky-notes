import { DragProps, ElementDimensions, MouseEventProps } from 'shared/types';

export const TrashZoneDimensions: ElementDimensions = {
  width: 350,
  height: 350,
};

export const stickyPadding = 20;

export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const isStickyInTrashZone = (
  stickyX: number,
  stickyY: number,
  container: ElementDimensions,
) => {
  return (
    stickyX > container.width - TrashZoneDimensions.width &&
    stickyY > container.height - TrashZoneDimensions.height
  );
};

export const getNewPositionsFromClient = ({
  clientEvent,
  containerDimensions,
  elementDimensions,
  dragProps,
}: {
  clientEvent: MouseEventProps;
  containerDimensions: ElementDimensions;
  elementDimensions: ElementDimensions;
  dragProps: DragProps;
}) => {
  const { clientX, clientY } = clientEvent;
  const { width: widthContainer, height: heightContainer } = containerDimensions;
  const { width: widthElement, height: heightElement } = elementDimensions;
  const { dragStartLeft, dragStartTop, dragStartX, dragStartY } = dragProps;

  const translateX = Math.max(
    0,
    Math.min(dragStartLeft + clientX - dragStartX, widthContainer - widthElement),
  );

  const translateY = Math.max(
    0,
    Math.min(dragStartTop + clientY - dragStartY, heightContainer - heightElement),
  );

  return {
    translateX,
    translateY,
  };
};
