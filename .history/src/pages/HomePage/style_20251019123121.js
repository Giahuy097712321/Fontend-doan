import styled from "styled-components";
import ButtonComponent from './../../components/ButtonComponent/ButtonComponent';

export const WrapperTypeProductSection = styled.div`
  background: linear-gradient(90deg, #f6f8fa, #ffffff);
  border-radius: 12px;
  margin-top: 30px;
  padding: 20px 30px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
`

export const WrapperTypeProductTitle = styled.h2`
  font-size: 22px;
  font-weight: 600;
  color: #0b74e5;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

export const WapperTypeProduct = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: flex-start;
`

export const WrapperSliderSection = styled.div`
  margin-top: 40px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0,0,0,0.1);
`

export const WrapperProducts = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 18px;
  margin-top: 30px;
  padding: 0 10px;

  & > * {
    flex: 0 0 calc(16.66% - 18px); /* 100% / 6 - khoảng cách */
    box-sizing: border-box;
  }

  @media (max-width: 1200px) {
    & > * {
      flex: 0 0 calc(25% - 18px); /* 4 sản phẩm / hàng trên màn nhỏ hơn */
    }
  }

  @media (max-width: 768px) {
    & > * {
      flex: 0 0 calc(50% - 18px); /* 2 sản phẩm / hàng trên tablet */
    }
  }

  @media (max-width: 480px) {
    & > * {
      flex: 0 0 100%; /* 1 sản phẩm / hàng trên điện thoại */
    }
  }
`


export const WrapperButtonMore = styled(ButtonComponent)`
  &:hover {
    color: #fff !important;
    background: linear-gradient(90deg, #0b74e5, #2e9dfb);
    border: none;
    span {
      color: #fff !important;
    }
  }
  transition: all 0.3s ease;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};
`
