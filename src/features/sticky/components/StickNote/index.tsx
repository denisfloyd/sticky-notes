import { HTMLAttributes, MutableRefObject, ReactNode, useEffect, useRef } from 'react';
import { Sticky } from '../..';
import { useSticky } from '../../contexts/StickyContext';
import { isStickyInTrashZone } from '../../../../utils';
import { Container, HeaderMoveContainer, TextAreaContainer } from './styles';

interface StickyNoteProps extends HTMLAttributes<HTMLDivElement>{
  children?: ReactNode;
  sticky: Sticky;
}

interface DragProps {
  dragStartLeft: number,
  dragStartTop: number,
  dragStartX: number,
  dragStartY: number
}

interface MouseEventProps {
  clientX: number, 
  clientY: number
}

export const StickyNote = ({sticky}: StickyNoteProps) => {
  const elemRef = useRef<HTMLDivElement>();
  const dragProps = useRef<DragProps>();

  const {containerRef, removeSticky} = useSticky();

  useEffect(() => {
    if(elemRef.current) {
      elemRef.current.style.transform = `translate(${sticky.x}px, ${sticky.y}px)`
    }
  }, []);

  const initialiseDrag = (event: any) => {
    if(elemRef.current) {
      const { target, clientX, clientY } = event;
      const { offsetTop, offsetLeft } = target;
  
      const { left, top } = elemRef.current && elemRef.current.getBoundingClientRect();

      dragProps.current = {
        dragStartLeft: left - offsetLeft,
        dragStartTop: top - offsetTop,
        dragStartX: clientX,
        dragStartY: clientY
      }

      window.addEventListener('mousemove', startDragging, false)
      window.addEventListener('mouseup', stopDragging, false)
    }
  }
  
  const startDragging = ({ clientX, clientY }: MouseEventProps) => {    
    if(elemRef.current && dragProps.current) {
      elemRef.current.style.transform = `translate(${dragProps.current.dragStartLeft + clientX - dragProps.current.dragStartX}px, 
        ${dragProps.current.dragStartTop + clientY - dragProps.current.dragStartY}px)`
    }
  } 

  const stopDragging = ({ clientX, clientY }: MouseEventProps) => {
    console.log(clientX, clientY);

    window.removeEventListener('mousemove', startDragging, false)
    window.removeEventListener('mouseup', stopDragging, false)

    const { width, height } = containerRef.current!.getBoundingClientRect() ?? {};
    if(isStickyInTrashZone(clientX, clientY, { width, height})) {
      removeSticky(sticky.id);
    }
  }

  return (
    <Container ref={elemRef as MutableRefObject<HTMLDivElement>} backgroundColor={sticky.color} id={sticky.id}>
      <HeaderMoveContainer onMouseDown={initialiseDrag} />
      <TextAreaContainer />
    </Container>
  )
};