import { AddStickButton } from '.';
import { fireEvent, render, screen } from '@/tests/test-utils';
import { useSticky } from '@/features/sticky/contexts/StickyContext';

const useStickyMock = useSticky as jest.Mock;
jest.mock('@/features/sticky/contexts/StickyContext');

describe('Sticky - AddStickyButton', () => {
  const addStickyMock = jest.fn();

  beforeAll(() => {
    useStickyMock.mockReturnValue({
      addSticky: addStickyMock,
    });
  });

  it('should be able to call addSticky', () => {
    render(<AddStickButton />);

    fireEvent.click(screen.getByRole('button'));

    expect(addStickyMock).toHaveBeenCalled();
  });
});
