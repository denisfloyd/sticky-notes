import styled, {  } from 'styled-components';
import theme from '../../../../styles/theme';

export const Container = styled.button`
  position: fixed;
  top: 30px;
  left: 30px;

  border-radius: 50px;
  height: 40px;
  width: 40px;
  font-size: 20px;
  font-weight: bold;
  border: none;
  color: #FFF;
  background-color: ${theme.colors.buttonColor};
  transition: background-color 0.2s ease-in;

  &:hover {
    background-color: ${theme.colors.buttonColorHover};  
  }
`;