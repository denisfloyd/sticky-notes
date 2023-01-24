import App from '@/App';
import { fireEvent, render, screen, within } from '@/tests/test-utils';
import { TrashZoneDimensions } from '@/utils';

import { StickyProvider } from '../contexts/StickyContext';

describe('Sticky Page - (Integration)', () => {
  const customRender = (children: JSX.Element) => {
    render(<StickyProvider>{children}</StickyProvider>);
  };

  const returnElementsBoundingClickRectMock = (
    stickyNoteX: number,
    stickyNoteY: number,
    returnContainer?: boolean,
  ) => {
    const stickyElement = {
      width: 200,
      height: 200,
      x: stickyNoteX,
      y: stickyNoteY,
      left: stickyNoteX,
      top: stickyNoteY,
    } as DOMRect;

    if (returnContainer) {
      return (Element.prototype.getBoundingClientRect = jest
        .fn()
        .mockImplementationOnce(() => {
          // container element
          return {
            width: 1000,
            height: 800,
            x: 0,
            y: 0,
            left: 0,
            top: 0,
          } as DOMRect;
        })
        .mockImplementation(() => {
          return stickyElement;
        }));
    }

    return (Element.prototype.getBoundingClientRect = jest.fn().mockImplementation(() => {
      return stickyElement;
    }));
  };

  it('should render children components', () => {
    customRender(<App />);

    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  it('should be able to add a new sticky notes', () => {
    customRender(<App />);

    fireEvent.click(screen.getByRole('button', { name: '+' }));

    expect(screen.getAllByTestId('sticky')).toHaveLength(1);
  });

  it('should update sticky when dropping outside trash zone', () => {
    returnElementsBoundingClickRectMock(300, 200);

    customRender(<App />);

    const containerSticky = screen.getByTestId('sticky');
    const headerMove = within(containerSticky).getByRole('banner');
    fireEvent.mouseDown(headerMove, { clientX: 300, clientY: 200 });

    returnElementsBoundingClickRectMock(400, 300, true);

    fireEvent.mouseMove(headerMove, { clientX: 400, clientY: 300 });

    returnElementsBoundingClickRectMock(400, 300, true);

    expect(screen.getByRole('region')).not.toHaveStyleRule('outline');

    fireEvent.mouseUp(headerMove, { clientX: 400, clientY: 300 });

    const stickyNote = screen.getByTestId('sticky');
    expect(stickyNote).toBeInTheDocument();
    expect(stickyNote).toHaveStyle('transform: translate(400px, 300px)');
  });

  it('should remove sticky when dropping inside trash zone', () => {
    returnElementsBoundingClickRectMock(300, 200);

    customRender(<App />);

    const containerSticky = screen.getByTestId('sticky');
    const headerMove = within(containerSticky).getByRole('banner');
    fireEvent.mouseDown(headerMove, { clientX: 300, clientY: 200 });

    returnElementsBoundingClickRectMock(
      TrashZoneDimensions.width + 1,
      TrashZoneDimensions.height + 2,
      true,
    );

    fireEvent.mouseMove(headerMove, {
      clientX: 1000 - TrashZoneDimensions.width + 1,
      clientY: 800 - TrashZoneDimensions.height + 1,
    });

    returnElementsBoundingClickRectMock(
      TrashZoneDimensions.width + 1,
      TrashZoneDimensions.height + 2,
      true,
    );

    expect(screen.getByRole('region')).toHaveStyleRule('outline', expect.anything());

    fireEvent.mouseUp(headerMove, {
      clientX: 1000 - TrashZoneDimensions.width + 1,
      clientY: 800 - TrashZoneDimensions.height + 1,
    });

    expect(screen.queryByTestId('sticky')).not.toBeInTheDocument();
  });

  it('should overlapping other stickies while moving one', () => {
    returnElementsBoundingClickRectMock(300, 200);
    customRender(<App />);

    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.click(screen.getByRole('button', { name: '+' }));

    expect(screen.getAllByTestId('sticky')).toHaveLength(2);

    const [sticky1, sticky2] = screen.getAllByTestId('sticky');
    const headerMove = within(sticky1).getByRole('banner');
    fireEvent.mouseDown(headerMove, { clientX: 300, clientY: 200 });

    returnElementsBoundingClickRectMock(400, 300, true);

    fireEvent.mouseMove(headerMove, { clientX: 400, clientY: 300 });

    expect(sticky1).toHaveStyle('z-index: 1');
    expect(sticky2).toHaveStyle('z-index: 0');
  });
});
