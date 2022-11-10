import { render, screen } from '@/tests/test-utils';
import { TrashZone } from '.';
import { useSticky } from '../../contexts/StickyContext';

jest.mock('@/features/sticky/contexts/StickyContext');

describe('Trash Zone', () => {
  const useStickyMock = useSticky as jest.Mock;

  beforeAll(() => {
    useStickyMock.mockReturnValue({
      highlightTrashZone: false,
    });
  });

  it('should render correctly', () => {
    render(<TrashZone />);

    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  it('should render hightlighted when preference highlightTrashZone is true', () => {
    useStickyMock.mockReturnValueOnce({
      highlightTrashZone: true,
    });

    render(<TrashZone />);

    const styles = getComputedStyle(screen.getByRole('region'));
    expect(styles.backgroundColor).toEqual('rgb(248, 79, 79)');
    expect(styles.outline).not.toBeFalsy();
  });
});
