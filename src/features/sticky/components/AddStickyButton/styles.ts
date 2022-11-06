import styled from 'styled-components';

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
  color: #fff;
  background-color: ${({ theme }) => theme.colors.primary.color};
  transition: background-color 0.2s ease-in;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary['&hover']};
  }
`;
