import { renderHook, act } from '@testing-library/react';
import theme from '../../../styles/theme';
import { StickyProvider, useSticky } from './StickyContext';

describe('Sticky Context', () => {
  Storage.prototype.setItem = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be able to load data from localStorage', () => {
    const stickiesFromStorage = [
      {
        id: 'sticky-2',
        text: 'test',
        x: 300,
        y: 200,
        color: theme.colors.stickiesColor[0],
        width: 40,
        height: 40,
      },
    ];

    const localStorageGetItemMock = jest.fn().mockReturnValue(JSON.stringify(stickiesFromStorage));
    Storage.prototype.getItem = localStorageGetItemMock;

    const { result } = renderHook(() => useSticky(), {
      wrapper: StickyProvider,
    });

    expect(result.current.stickies).toEqual(stickiesFromStorage);
    localStorageGetItemMock.mockReset();
  });

  it('should be able to create two stickies', async () => {
    const { result } = renderHook(() => useSticky(), {
      wrapper: StickyProvider,
    });

    act(() => {
      result.current.addSticky();
    });
    act(() => {
      result.current.addSticky();
    });

    expect(result.current.stickies).toHaveLength(2);
    result.current.stickies.forEach((sticky, i) => {
      expect(sticky.id).toEqual(`sticky-${i + 1}`);
      expect(theme.colors.stickiesColor).toContain(sticky.color);
      expect(sticky.x).toBeGreaterThanOrEqual(0);
      expect(sticky.y).toBeGreaterThanOrEqual(0);
    });
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('should be able to update a sticky', async () => {
    const { result } = renderHook(() => useSticky(), {
      wrapper: StickyProvider,
    });

    act(() => {
      result.current.addSticky();
    });

    const stickyWithUpdateData = {
      ...result.current.stickies[0],
      x: 500,
      y: 300,
      color: theme.colors.stickiesColor[0],
    };
    act(() => {
      result.current.updateSticky(stickyWithUpdateData);
    });

    const stickyUpdated = result.current.stickies[0];
    expect(stickyUpdated.id).toEqual('sticky-1');
    expect(stickyUpdated.x).toEqual(500);
    expect(stickyUpdated.y).toEqual(300);
    expect(stickyUpdated.color).toEqual(theme.colors.stickiesColor[0]);
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('should be able to remove a sticky', async () => {
    const { result } = renderHook(() => useSticky(), {
      wrapper: StickyProvider,
    });

    act(() => {
      result.current.addSticky();
    });

    expect(result.current.stickies).toHaveLength(1);

    act(() => {
      result.current.removeSticky('sticky-1');
    });

    expect(result.current.stickies).toHaveLength(0);
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('should be able to set to highlight trash zone', () => {
    const { result } = renderHook(() => useSticky(), {
      wrapper: StickyProvider,
    });

    act(() => {
      result.current.setHighlightTrashZone(true);
    });

    expect(result.current.highlightTrashZone).toBeTruthy();
  });
});
