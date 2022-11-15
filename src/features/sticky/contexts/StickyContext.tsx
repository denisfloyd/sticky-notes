import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { Sticky } from '..';
import theme from '../../../styles/theme';
import { getRandomInt, TrashZoneDimensions } from '../../../utils';

interface StickyProviderProps {
  children: ReactNode;
}

interface StickyContextData {
  containerRef: React.RefObject<HTMLElement>;
  stickies: Sticky[];
  addSticky: () => void;
  updateSticky: (stickyWithUpdateData: Sticky) => void;
  removeSticky: (id: string) => void;
  highlightTrashZone: boolean;
  setHighlightTrashZone: (isHighlighted: boolean) => void;
}

const StickyContext = createContext<StickyContextData>({} as StickyContextData);

export function StickyProvider({ children }: StickyProviderProps): JSX.Element {
  const containerRef = useRef<HTMLElement>(null);
  const countRef = useRef<number>(0);
  const [stickies, setStickies] = useState<Sticky[]>(() => {
    const notes: Sticky[] = window.localStorage.getItem('@sticky-notes/notes')
      ? [...JSON.parse(window.localStorage.getItem('@sticky-notes/notes') as string)]
      : [];

    countRef.current = notes.length > 0 ? Number(notes[notes.length - 1]?.id.split('-')[1]) : 0;
    return notes;
  });
  const [highlightTrashZone, setHighlightTrashZone] = useState(false);

  useEffect(() => {
    window.localStorage.setItem('@sticky-notes/notes', JSON.stringify(stickies));
  }, [stickies]);

  const addSticky = () => {
    const { width = 1000, height = 500 } = containerRef.current?.getBoundingClientRect() ?? {};
    const maximumBounding = {
      x: width - TrashZoneDimensions.width,
      y: height - TrashZoneDimensions.height,
    };

    const newSticky = {
      id: `sticky-${++countRef.current}`,
      text: '',
      width: 200,
      height: 200,
      x: getRandomInt(0, maximumBounding.x),
      y: getRandomInt(0, maximumBounding.y),
      color: theme.colors.stickiesColor[getRandomInt(0, 4)],
    };

    setStickies([...stickies, newSticky]);
  };

  const removeSticky = (id: string) => {
    const newStickiesArray = [...stickies.filter((sticky) => sticky.id !== id)];
    setStickies(newStickiesArray);
    setHighlightTrashZone(false);
  };

  const updateHighlightTrashZone = (newValue: boolean) => {
    setHighlightTrashZone(() => newValue);
  };

  const updateSticky = (stickyWithUpdateData: Sticky) => {
    const stickyIndex = stickies.findIndex((sticky) => sticky.id === stickyWithUpdateData.id);

    if (stickyIndex !== -1) {
      const newStickies = [
        ...JSON.parse(window.localStorage.getItem('@sticky-notes/notes') as string),
      ];
      newStickies[stickyIndex] = stickyWithUpdateData;
      setStickies(newStickies);
    }

    return;
  };

  return (
    <StickyContext.Provider
      value={{
        containerRef,
        stickies,
        addSticky,
        updateSticky,
        removeSticky,
        highlightTrashZone,
        setHighlightTrashZone: updateHighlightTrashZone,
      }}
    >
      {children}
    </StickyContext.Provider>
  );
}

export function useSticky(): StickyContextData {
  const context = useContext(StickyContext);

  return context;
}
