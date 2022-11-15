import React from 'react';
import { StickyNote } from '../components/StickyNote';
import { AddStickButton } from '../components/AddStickyButton';
import { Container } from './styles';
import { TrashZone } from '../components/TrashZone';
import { useSticky } from '../contexts/StickyContext';

export const StickyNotesContainer: React.FC = () => {
  const { containerRef, stickies } = useSticky();

  return (
    <>
      <Container ref={containerRef} id='container'>
        <AddStickButton />
        {stickies && stickies.length > 0
          ? stickies.map((item) => <StickyNote sticky={item} key={item.id} />)
          : null}
        <TrashZone />
      </Container>
    </>
  );
};
