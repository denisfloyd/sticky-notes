import { HTMLAttributes, MutableRefObject, ReactNode, useEffect, useRef, useState } from 'react';
import { Sticky } from '../..';
import { useSticky } from '../../contexts/StickyContext';
import { getNewPositionsToClient, isStickyInTrashZone, stickyPadding } from '../../../../utils';
import { Container, HeaderMoveContainer } from './styles';
import { DragProps, ElementDimensions, MouseEventProps } from '@/shared/types';
import useDebounce from '@/shared/hooks/useDebounce';
import { TextArea } from '../TextArea';

interface StickyNoteProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  sticky: Sticky;
}

interface InitializeDragEvent {
  target: {
    offsetTop: number;
    offsetLeft: number;
  };
  clientX: number;
  clientY: number;
}

export const StickyNote = ({ sticky }: StickyNoteProps) => {
  const [text, setText] = useState(sticky.text);

  const elemRef = useRef<HTMLDivElement>();
  const dragProps = useRef<DragProps>();

  const stickyRef = useRef<Sticky>();
  stickyRef.current = sticky;

  const debounceValue = useDebounce(text, 500);

  const { containerRef, updateSticky, removeSticky, setHighlightTrashZone } = useSticky();

  useEffect(() => {
    /* istanbul ignore else */
    if (elemRef.current) {
      elemRef.current.style.transform = `translate(${sticky.x}px, ${sticky.y}px)`;
    } else {
      throw new Error('ref was not set correctly');
    }

    return () => (stickyRef.current = undefined);
  }, []);

  useEffect(() => {
    if (debounceValue && stickyRef.current && stickyRef.current.text !== debounceValue) {
      updateSticky({ ...sticky, text: debounceValue });
    }
  }, [debounceValue]);

  const getContainerDimensions = () => {
    const { width, height } = containerRef?.current?.getBoundingClientRect() ?? {};

    return {
      width,
      height,
    } as ElementDimensions;
  };

  const initialiseDrag = (event: InitializeDragEvent) => {
    /* istanbul ignore else */
    if (elemRef.current) {
      const { target, clientX, clientY } = event;
      const { offsetTop, offsetLeft } = target;

      const { left, top } = elemRef.current && elemRef.current.getBoundingClientRect();

      dragProps.current = {
        dragStartLeft: left - offsetLeft,
        dragStartTop: top - offsetTop,
        dragStartX: clientX,
        dragStartY: clientY,
      };

      console.log(dragProps.current);

      window.addEventListener('mousemove', startDragging, false);
      window.addEventListener('mouseup', stopDragging, false);
    } else {
      throw new Error('ref was not set correctly');
    }
  };

  const startDragging = ({ clientX, clientY }: MouseEventProps) => {
    /* istanbul ignore else */
    if (elemRef.current && dragProps.current) {
      const containerDimensions = getContainerDimensions();
      const elementDimensions = elemRef.current.getBoundingClientRect();

      const { translateX, translateY } = getNewPositionsToClient({
        clientEvent: { clientX, clientY },
        containerDimensions,
        elementDimensions,
        dragProps: dragProps.current,
      });

      console.log(clientX, clientY);

      elemRef.current.style.transform = `translate(${translateX}px, ${translateY}px)`;

      setHighlightTrashZone(isStickyInTrashZone(clientX, clientY, containerDimensions));
    } else {
      throw new Error('ref was not set correctly');
    }
  };

  const stopDragging = ({ clientX, clientY }: MouseEventProps) => {
    window.removeEventListener('mousemove', startDragging, false);
    window.removeEventListener('mouseup', stopDragging, false);

    if (isStickyInTrashZone(clientX, clientY, getContainerDimensions())) {
      removeSticky(sticky.id);
    } else if (elemRef.current) {
      const elementDimensions = elemRef.current.getBoundingClientRect();

      updateSticky({
        ...(stickyRef.current as Sticky),
        x: elementDimensions?.x,
        y: elementDimensions?.y,
      });
    }
  };

  /* istanbul ignore next */
  const onResize = (widthResized: number, heightResized: number) => {
    const { width: prevWidth, height: prevHeight } = stickyRef.current || {};

    const totalPadding = stickyPadding * 2;

    if (prevWidth !== widthResized + totalPadding || prevHeight !== heightResized + totalPadding) {
      updateSticky({
        ...(stickyRef.current as Sticky),
        width: widthResized + totalPadding,
        height: heightResized + totalPadding,
      });
    }
  };

  return (
    <Container
      ref={elemRef as MutableRefObject<HTMLDivElement>}
      backgroundColor={sticky.color}
      id={sticky.id}
      data-testid={sticky.id}
    >
      <HeaderMoveContainer
        onMouseDown={(ev) => initialiseDrag(ev as unknown as InitializeDragEvent)}
      />
      <TextArea sticky={sticky} text={text} onChangeText={setText} onResize={onResize} />
    </Container>
  );
};
