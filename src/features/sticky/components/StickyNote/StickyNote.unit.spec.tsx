import { fireEvent, render, screen, waitFor, within } from '@/tests/test-utils';
import 'jest-styled-components';
import { StickyNote } from '.';
import { useSticky } from '../../contexts/StickyContext';
import { Sticky } from '../../types';
import theme from '@/styles/theme';

const useStickyMock = useSticky as jest.Mock;
jest.mock('@/features/sticky/contexts/StickyContext');

describe('StickyNote', () => {
  const sticky: Sticky = {
    id: 'sticky-1',
    text: '',
    x: 300,
    y: 200,
    color: theme.colors.stickiesColor[0],
    width: 200,
    height: 200,
  };

  const defaultContextProps = {
    containerRef: {
      current: {
        getBoundingClientRect: () => ({
          width: 1000,
          height: 800,
        }),
      },
    },
    updateSticky: jest.fn(),
    removeSticky: jest.fn(),
    setHighlightTrashZone: jest.fn(),
  };

  beforeAll(() => {
    useStickyMock.mockReturnValue({
      ...defaultContextProps,
    });
  });

  it('should render a sticky note', () => {
    render(<StickyNote sticky={sticky} />);

    const containerSticky = screen.getByTestId('sticky-1');

    expect(containerSticky).toBeInTheDocument();
    expect(within(containerSticky).getByRole('banner')).toBeInTheDocument();
    expect(within(containerSticky).getByRole('textbox')).toBeInTheDocument();
  });

  it('should set styles accordingly', () => {
    render(<StickyNote sticky={sticky} />);

    const containerSticky = screen.getByTestId('sticky-1');

    expect(containerSticky).toHaveStyle(`transform: translate(${sticky.x}px, ${sticky.y}px)`);
    expect(within(containerSticky).getByRole('banner')).toHaveStyleRule('cursor', 'move');
    expect(within(containerSticky).getByRole('banner')).toHaveStyle(
      `background-color: ${theme.colors.stickiesColor[0]}`,
    );
    expect(within(containerSticky).getByRole('textbox')).toHaveStyle(
      `background-color: ${theme.colors.stickiesColor[0]}`,
    );
  });

  it('should initialise drag listener when mouse down', () => {
    const events: { [key: string]: EventListenerOrEventListenerObject } = {};
    const listernerSpy = jest
      .spyOn(window, 'addEventListener')
      .mockImplementation((event, handle) => {
        events[event] = handle;
      });
    render(<StickyNote sticky={sticky} />);

    const containerSticky = screen.getByTestId('sticky-1');
    const headerMove = within(containerSticky).getByRole('banner');
    fireEvent.mouseDown(headerMove);

    expect(events).toEqual(
      expect.objectContaining({ mousemove: expect.any(Function), mouseup: expect.any(Function) }),
    );

    listernerSpy.mockRestore();
  });

  it('should update if element is in trash zone while moving', () => {
    Element.prototype.getBoundingClientRect = jest.fn().mockImplementation(() => {
      return {
        width: 200,
        height: 200,
      } as DOMRect;
    });
    const setHighlightTrashZoneMock = jest.fn();
    useStickyMock.mockReturnValue({
      ...defaultContextProps,
      setHighlightTrashZone: setHighlightTrashZoneMock,
    });

    render(<StickyNote sticky={sticky} />);

    const containerSticky = screen.getByTestId('sticky-1');
    const headerMove = within(containerSticky).getByRole('banner');
    fireEvent.mouseDown(headerMove, { clientX: 100, clientY: 0 });
    fireEvent.mouseMove(headerMove);

    expect(setHighlightTrashZoneMock).toHaveBeenCalledTimes(1);
  });

  it('should remove listeners when drop a sticky', () => {
    const events: { [key: string]: EventListenerOrEventListenerObject } = {};
    const listernerSpy = jest
      .spyOn(window, 'removeEventListener')
      .mockImplementation((event, handle) => {
        events[event] = handle;
      });
    render(<StickyNote sticky={sticky} />);

    const containerSticky = screen.getByTestId('sticky-1');
    const headerMove = within(containerSticky).getByRole('banner');
    fireEvent.mouseDown(headerMove, { clientX: 0, clientY: 0 });
    fireEvent.mouseUp(headerMove, { clientX: 100, clientY: 100 });

    expect(events).toEqual(
      expect.objectContaining({ mousemove: expect.any(Function), mouseup: expect.any(Function) }),
    );

    listernerSpy.mockRestore();
  });

  it('should update sticky position when drop outside trash zone', () => {
    Element.prototype.getBoundingClientRect = jest.fn().mockImplementation(() => {
      return {
        x: 100,
        y: 1,
      } as DOMRect;
    });
    const updateStickyMock = jest.fn();
    useStickyMock.mockReturnValue({
      ...defaultContextProps,
      updateSticky: updateStickyMock,
    });

    render(<StickyNote sticky={sticky} />);

    const containerSticky = screen.getByTestId('sticky-1');
    const headerMove = within(containerSticky).getByRole('banner');
    fireEvent.mouseDown(headerMove, { clientX: 100, clientY: 0 });
    fireEvent.mouseUp(headerMove, { clientX: 100, clientY: 1 });

    expect(updateStickyMock).toHaveBeenCalledTimes(1);
    expect(updateStickyMock).toHaveBeenCalledWith({ ...sticky, x: 100, y: 1 });
  });
});
