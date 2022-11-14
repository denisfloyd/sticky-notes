import { fireEvent, render, screen, within } from '@/tests/test-utils';
import 'jest-styled-components';
import { StickyNote } from '.';
import { useSticky } from '../../contexts/StickyContext';
import { Sticky } from '../../types';
import theme from '@/styles/theme';
import { getNewPositionsFromClient, isStickyInTrashZone } from '@/utils';

const useStickyMock = useSticky as jest.Mock;
jest.mock('@/features/sticky/contexts/StickyContext');

const isStickyInTrashZoneMock = isStickyInTrashZone as jest.Mock;
const getNewPositionsFromClientMock = getNewPositionsFromClient as jest.Mock;
jest.mock('@/utils');

describe('Sticky - StickyNote (Unit)', () => {
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

    getNewPositionsFromClientMock.mockReturnValue({ translateX: 100, translateY: 100 });
    isStickyInTrashZoneMock.mockReturnValue(false);
  });

  beforeEach(() => {
    Element.prototype.getBoundingClientRect = jest.fn().mockImplementation(() => {
      return {
        width: 200,
        height: 200,
        x: 100,
        y: 1,
        left: 100,
        top: 1,
      } as DOMRect;
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

  it('should checking if element is inside trash zone while moving', () => {
    const setHighlightTrashZoneMock = jest.fn();
    useStickyMock.mockReturnValue({
      ...defaultContextProps,
      setHighlightTrashZone: setHighlightTrashZoneMock,
    });

    render(<StickyNote sticky={sticky} />);

    const containerSticky = screen.getByTestId('sticky-1');
    const headerMove = within(containerSticky).getByRole('banner');
    fireEvent.mouseDown(headerMove);
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
    fireEvent.mouseDown(headerMove);
    fireEvent.mouseUp(headerMove);

    expect(events).toEqual(
      expect.objectContaining({ mousemove: expect.any(Function), mouseup: expect.any(Function) }),
    );

    listernerSpy.mockRestore();
  });

  it('should update sticky when dropping outside trash zone', () => {
    const updateStickyMock = jest.fn();
    useStickyMock.mockReturnValue({
      ...defaultContextProps,
      updateSticky: updateStickyMock,
    });

    render(<StickyNote sticky={sticky} />);

    const containerSticky = screen.getByTestId('sticky-1');
    const headerMove = within(containerSticky).getByRole('banner');
    fireEvent.mouseDown(headerMove);
    fireEvent.mouseUp(headerMove);

    expect(updateStickyMock).toHaveBeenCalledTimes(1);
    expect(updateStickyMock).toHaveBeenCalledWith({ ...sticky, x: 100, y: 1 });
  });

  it('should remove sticky when dropping inside trash zone', () => {
    const removeStickyMock = jest.fn();
    useStickyMock.mockReturnValue({
      ...defaultContextProps,
      removeSticky: removeStickyMock,
    });
    isStickyInTrashZoneMock.mockReturnValueOnce(true);

    render(<StickyNote sticky={sticky} />);

    const containerSticky = screen.getByTestId('sticky-1');
    const headerMove = within(containerSticky).getByRole('banner');
    fireEvent.mouseDown(headerMove);
    fireEvent.mouseUp(headerMove);

    expect(removeStickyMock).toHaveBeenCalledTimes(1);
    expect(removeStickyMock).toHaveBeenCalledWith('sticky-1');
  });
});
