import { renderHook, act } from '@testing-library/react';
import theme from '../../../styles/theme';
import { StickyProvider, useSticky } from './StickyContext';

describe('Sticky Context', () => {
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
  });

  it('should be able to update a sticky', async () => {
    const { result } = renderHook(() => useSticky(), {
      wrapper: StickyProvider,
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
  });

  it('should be able to remove a sticky', async () => {
    const { result } = renderHook(() => useSticky(), {
      wrapper: StickyProvider,
    });

    expect(result.current.stickies.length).toBeGreaterThan(1);

    act(() => {
      result.current.removeSticky('sticky-1');
    });

    expect(result.current.stickies).toHaveLength(1);
    expect(result.current.stickies).toEqual(
      expect.arrayContaining([
        expect.not.objectContaining({
          id: 'sticky-1',
        }),
      ]),
    );
  });
});
