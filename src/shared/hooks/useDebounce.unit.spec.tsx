import { act, renderHook as render } from '@/tests/test-utils';
import useDebounce from './useDebounce';

const renderHook = (
  [value, delay]: Parameters<typeof useDebounce> = [''],
  initialProps: Parameters<typeof useDebounce> = [''],
) => {
  return render(
    ([$p1 = value, $p2 = delay]: Parameters<typeof useDebounce>) => useDebounce($p1, $p2),
    {
      initialProps,
    },
  );
};

describe('useDebounce', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should return passed value immeadiatelly', () => {
    const { result } = renderHook([''], ['test']);

    expect(result.current).toBe('test');
  });

  it('should return value after default delay time', async () => {
    const { result, rerender } = renderHook();

    expect(result.current).toBe('');

    rerender(['test']);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toEqual('test');
  });

  it('should return value after passed delay time', () => {
    const { result, rerender } = renderHook();
    rerender(['test', 1000]);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current).toEqual('test');
  });
});
