import { render, screen } from '@/tests/test-utils';
import 'jest-styled-components';
import theme from '@/styles/theme';
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

    expect(screen.getByRole('region')).toHaveStyleRule(
      'background-color',
      theme.colors.secondary.color,
    );
    expect(screen.getByRole('region')).toHaveStyleRule('outline', expect.anything());
  });
});
