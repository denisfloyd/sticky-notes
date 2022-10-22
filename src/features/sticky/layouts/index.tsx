import React, { useEffect, useRef } from "react"
import { StickyNote } from "../components/StickNote";
import { AddStickButton } from "../components/AddStickButton";
import { Container } from "./styles"
import { TrashZone } from "../components/TrashZone";
import { useSticky } from "../contexts/StickyContext";

export const StickyNotesContainer: React.FC = () => {
  const { containerRef, stickies } = useSticky();

  return (
    <>
      <Container ref={containerRef}>
        <AddStickButton />
        {stickies ? stickies.map(item => (
          <StickyNote sticky={item} key={item.id}/>
        )) : null}
        <TrashZone />
      </Container>
    </>
  )
}