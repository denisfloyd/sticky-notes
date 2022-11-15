import { act, fireEvent, render, screen, simulateResize, within } from '@/tests/test-utils';
import 'jest-styled-components';
import { StickyNote } from '.';
import { useSticky } from '../../contexts/StickyContext';
import { Sticky } from '../../types';
import theme from '@/styles/theme';
import { getNewPositionsToClient, isStickyInTrashZone, stickyPadding } from '@/utils';

const useStickyMock = useSticky as jest.Mock;
jest.mock('@/features/sticky/contexts/StickyContext');

let listener: ResizeObserverCallback;
window.ResizeObserver = class NewResizeObserver extends ResizeObserver {
  constructor(ls: ResizeObserverCallback) {
    super(ls);
    listener = ls;
  }
};

describe('Sticky - StickyNote (Integration)', () => {
  const sticky: Sticky = {
    id: 'sticky-1',
    text: '',
    x: 300,
    y: 200,
    color: theme.colors.stickiesColor[0],
    width: 200,
    height: 200,
  };

  const updateStickyMock = jest.fn().mockReturnValue(null);
  const defaultContextProps = {
    containerRef: {
      current: {
        getBoundingClientRect: () => ({
          width: 1000,
          height: 800,
        }),
      },
    },
    updateSticky: updateStickyMock,
    removeSticky: jest.fn(),
    setHighlightTrashZone: jest.fn(),
  };

  beforeAll(() => {
    useStickyMock.mockReturnValue({
      ...defaultContextProps,
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should update sticky when changing sticky text', () => {
    jest.useFakeTimers();

    render(<StickyNote sticky={sticky} />);

    const containerSticky = screen.getByTestId('sticky');
    const textArea = within(containerSticky).getByRole('textbox');
    fireEvent.change(textArea, { target: { value: 'new text' } });
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(updateStickyMock).toHaveBeenCalledTimes(1);
    expect(updateStickyMock).toHaveBeenCalledWith({ ...sticky, text: 'new text' });
  });

  it('should update sticky when resize sticky note', () => {
    render(<StickyNote sticky={sticky} />);

    // simulate a RezizeObserver listener
    simulateResize({ listener, width: 300, height: 300 });

    expect(updateStickyMock).toHaveBeenCalledTimes(1);
    expect(updateStickyMock).toHaveBeenCalledWith({
      ...sticky,
      width: 300 + stickyPadding * 2,
      height: 300 + stickyPadding * 2,
    });
  });
});
