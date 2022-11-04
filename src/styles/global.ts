import { createGlobalStyle, css } from 'styled-components';

export default createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;

    &::before,
    &::after {
      box-sizing: inherit;
    }
  }

  button, a {
    cursor: pointer;
  }

  ${({ theme }) => css`
    html {
      font-size: 62.5%;
    }
    body {
      overflow: hidden;
      font-family: ${theme.font.family};
    }
  `}
`;
