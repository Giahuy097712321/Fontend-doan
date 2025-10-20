import styled from 'styled-components'

export const WrapperHeaderUser = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`

export const WrapperInfoUser = styled.div`
  flex: 1;
  padding: 0 10px;
`

export const WrapperLabel = styled.div`
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  text-transform: uppercase;
  font-size: 14px;
`

export const WrapperContentInfo = styled.div`
  background-color: #fafafa;
  padding: 10px 12px;
  border-radius: 6px;
  color: #555;
  font-size: 14px;
  line-height: 1.6;

  .name-info {
    font-weight: 600;
    color: #000;
  }

  span {
    color: #777;
  }
`

export const WrapperStyleContent = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`

export const WrapperProductItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  padding: 12px 0;

  &:last-child {
    border-bottom: none;
  }
`

export const WrapperPrice = styled.div`
  width: 140px;
  text-align: right;
  font-weight: 500;
  color: #222;
`

export const WrapperTotalPrice = styled.div`
  margin-top: 20px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  font-size: 16px;
  line-height: 1.8;
  color: #333;

  div {
    display: flex;
    justify-content: space-between;
  }
`
