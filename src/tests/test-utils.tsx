import { FC, ReactElement } from 'react';
import { act, render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from '../styles/theme';

interface SimulateResizeProps {
  width: number;
  height: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listener: any;
}

const wrapper: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper, ...options });

export async function simulateResize({ listener, width, height }: SimulateResizeProps) {
  act(() => {
    listener([
      {
        contentRect: {
          width,
          height,
        },
      },
    ]);
  });
  await new Promise((resolve) => setTimeout(resolve, 100));
}

export * from '@testing-library/react';
export { customRender as render };
