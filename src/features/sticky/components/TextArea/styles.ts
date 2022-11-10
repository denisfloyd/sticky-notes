import styled from 'styled-components';

const maxResizeElement = 350;

export const Container = styled.textarea`
  outline: none;
  border: none;
  min-width: 200px;
  min-height: 200px;
  padding: 20px;
  font-family: ${({ theme }) => theme.font.family};
  font-size: 14px;

  // limit rezise
  max-width: ${maxResizeElement}px;
  max-height: ${maxResizeElement}px;
`;
