import { MutableRefObject, useEffect, useRef } from 'react';
import { useSticky } from '../../contexts/StickyContext';
import { Sticky } from '../../types';
import { Container } from './styles';

interface TextAreaProps {
  sticky: Sticky;
  text: string;
  onChangeText: (text: string) => void;
  onResize: (width: number, height: number) => void;
}

export const TextArea = ({ sticky, text, onChangeText, onResize }: TextAreaProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>();

  const { stickies } = useSticky();

  useEffect(() => {
    /* istanbul ignore else */
    if (textAreaRef.current) {
      textAreaRef.current.style.width = `${sticky.width}px`;
      textAreaRef.current.style.height = `${sticky.height}px`;
    } else {
      throw new Error('ref was not set correctly');
    }
  }, []);

  useEffect(() => {
    // Resize listener to text area input element
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      onResize(width, height);
    });

    observer.observe(textAreaRef?.current as Element);
    
    return () => textAreaRef?.current && observer.unobserve(textAreaRef?.current);
  }, [stickies]);

  return (
    <Container
      ref={textAreaRef as MutableRefObject<HTMLTextAreaElement>}
      value={text}
      onChange={(event) => onChangeText(event.target.value)}
    />
  );
};
