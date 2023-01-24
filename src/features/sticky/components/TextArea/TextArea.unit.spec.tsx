import theme from '@/styles/theme';
import { fireEvent, render, screen, simulateResize } from '@/tests/test-utils';
import { TextArea } from '.';
import { Sticky } from '../../types';

let listener: ResizeObserverCallback;
window.ResizeObserver = class NewResizeObserver extends ResizeObserver {
  constructor(ls: ResizeObserverCallback) {
    super(ls);
    listener = ls;
  }
};

describe('Sticky - TextArea', () => {
  const sticky: Sticky = {
    id: 'sticky-1',
    text: 'test',
    x: 300,
    y: 200,
    color: theme.colors.stickiesColor[0],
    width: 200,
    height: 200,
  };

  const defaultProps = {
    sticky,
    text: 'test',
    onChangeText: jest.fn(),
    onResize: jest.fn(),
  };

  it('should render correctly ', () => {
    render(<TextArea {...defaultProps} />);

    const textAreaComp = screen.getByRole('textbox');
    expect(textAreaComp.textContent).toBe('test');
  });

  it('should set correctly width and height on start', () => {
    render(<TextArea {...defaultProps} />);

    const textAreaComp = screen.getByRole('textbox');
    expect(textAreaComp).toHaveStyle('width: 200px');
    expect(textAreaComp).toHaveStyle('height: 200px');
  });

  it('should have min properties for dimensions', () => {
    render(<TextArea {...defaultProps} />);

    const textAreaComp = screen.getByRole('textbox');
    expect(textAreaComp).toHaveStyleRule('min-width', '200px');
    expect(textAreaComp).toHaveStyleRule('min-height', '200px');
  });

  it('should have max properties for dimensions', () => {
    render(<TextArea {...defaultProps} />);

    const textAreaComp = screen.getByRole('textbox');
    expect(textAreaComp).toHaveStyleRule('max-width', '350px');
    expect(textAreaComp).toHaveStyleRule('max-height', '350px');
  });

  it('should call onChangeText when changing text', () => {
    const onChangeTextMock = jest.fn();
    render(<TextArea {...defaultProps} onChangeText={onChangeTextMock} />);

    const textAreaComp = screen.getByRole('textbox');
    fireEvent.change(textAreaComp, { target: { value: 'text changed' } });

    expect(onChangeTextMock).toHaveBeenCalled();
    expect(onChangeTextMock).toHaveBeenCalledWith('text changed');
  });

  it('should call onResize when resizing element', () => {
    const onResizeMock = jest.fn();
    const { unmount } = render(<TextArea {...defaultProps} onResize={onResizeMock} />);

    // simulate a RezizeObserver listener
    simulateResize({ listener, width: 300, height: 300 });

    expect(onResizeMock).toHaveBeenCalled();
    expect(onResizeMock).toHaveBeenCalledWith(300, 300);

    unmount();
  });
});
