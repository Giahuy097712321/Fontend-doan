import styled from "styled-components";
import ButtonComponent from './../../components/ButtonComponent/ButtonComponent';

export const WrapperTypeSection = styled.div`
  padding: 20px 0;
  background: linear-gradient(to right, #fff, #f8f8f8, #fff);
  border-bottom: 2px solid #e8e8e8;
  margin-bottom: 20px;
`;

export const WrapperTypeProduct = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  height: 50px;
  flex-wrap: wrap;
`;

export const WrapperButtonMore = styled(ButtonComponent)`
  &:hover {
    color: #fff;
    background: #d70018;
    span {
      color: #fff;
    }
  }
  width: 100%;
  text-align: center;
  cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointer'};
  background-color: ${(props) => props.disabled ? '#f5f5f5' : '#fff'};
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

export const WrapperProducts = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 10px;
  flex-wrap: wrap;
  justify-content: flex-start;
`;