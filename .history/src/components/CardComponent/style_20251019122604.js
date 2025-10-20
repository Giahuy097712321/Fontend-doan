import styled from "styled-components";
import { Card } from "antd";

export const WrapperCardStyle = styled(Card)`
  width: 200px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e6e9ec;
  background: #fff;
  transition: all 0.3s ease;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.15);
  }

  .ant-card-body {
    padding: 10px 12px;
  }
`;

export const WrapperImage = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fafafa;

  & img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

export const WrapperDiscountText = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: #ff4d4f;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 6px;
`;

export const StyleNameProduct = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-top: 8px;
  min-height: 36px;
  line-height: 1.3;
`;

export const WrapperReportText = styled.div`
  font-size: 12px;
  color: #888;
  display: flex;
  align-items: center;
  margin-top: 6px;
`;

export const WrapperStyleTextSell = styled.span`
  font-size: 12px;
  color: #777;
`;

export const WrapperPriceText = styled.div`
  color: #e60023;
  font-size: 16px;
  font-weight: 600;
  margin-top: 6px;
`;
