import React, { createContext, ReactNode, useContext, useRef, useState } from 'react';
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
  removeSticky: (id: string) => void;
  highlightTrashZone: boolean;
  setHighlightTrashZone: (isHighlighted: boolean) => void;
}

const StickyContext = createContext<StickyContextData>({} as StickyContextData);

export function StickyProvider({ children }: StickyProviderProps): JSX.Element {
  const containerRef = useRef<HTMLElement>(null);
  const countRef = useRef<number>(0);
  const [stickies, setStickies] = useState<Sticky[]>([]);
  const [highlightTrashZone, setHighlightTrashZone] = useState(false);

  const addSticky = () => {
    const { width = 1000, height = 500 } = containerRef.current?.getBoundingClientRect() ?? {};
    const maximumBounding = {
      x: width - TrashZoneDimensions.width,
      y: height - TrashZoneDimensions.height,
    };

    const newSticky = {
      id: `sticky-${++countRef.current}`,
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

  return (
    <StickyContext.Provider
      value={{
        containerRef,
        stickies,
        addSticky,
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
