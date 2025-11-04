import styled from "styled-components";

export const PaymentContainer = styled.div`
  background: #f5f6fa;
  width: 100%;
  min-height: 100vh;
  padding: 20px 0;

  @media (max-width: 768px) {
    padding: 12px 0;
  }
`;

export const PaymentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    padding: 20px 16px;
    border-radius: 12px;
    margin: 0 12px;
  }
`;

export const PaymentHeader = styled.div`
  text-align: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid #f0f0f0;

  h2 {
    font-size: 28px;
    font-weight: 700;
    color: #333;
    margin-bottom: 8px;
  }

  p {
    font-size: 16px;
    color: #666;
    margin: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 24px;
    
    h2 {
      font-size: 24px;
    }
    
    p {
      font-size: 14px;
    }
  }
`;

export const PaymentContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 350px;
    gap: 24px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

export const PaymentLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const PaymentRight = styled.div`
  position: sticky;
  top: 20px;

  @media (max-width: 768px) {
    position: static;
  }
`;

export const PaymentSection = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .options-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  @media (max-width: 768px) {
    padding: 20px 16px;
    
    h3 {
      font-size: 16px;
      margin-bottom: 16px;
    }
  }
`;

export const PaymentInfoCard = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    border-color: #1890ff;
    background: #f0f9ff;
  }

  .info-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .title {
      font-weight: 600;
      color: #333;
      font-size: 16px;
    }

    .change-btn {
      color: #1890ff;
      font-size: 14px;
      font-weight: 500;
      text-decoration: underline;
    }
  }

  .info-content {
    .info-item {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
      font-size: 14px;
      color: #666;

      strong {
        color: #333;
      }
    }
  }

  @media (max-width: 768px) {
    padding: 16px;
    
    .info-header .title {
      font-size: 15px;
    }
  }
`;

export const DeliveryOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 2px solid ${props => props.selected ? '#1890ff' : '#e8e8e8'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.selected ? '#f0f9ff' : '#fff'};

  &:hover {
    border-color: #1890ff;
  }

  .option-content {
    flex: 1;
    
    .option-title {
      font-weight: 600;
      color: #333;
      margin-bottom: 4px;
    }
    
    .option-desc {
      font-size: 14px;
      color: #666;
    }
  }

  /* ĐÃ XÓA PHẦN HIỂN THỊ GIÁ */
`;

export const PaymentOption = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border: 2px solid ${props => props.selected ? '#1890ff' : '#e8e8e8'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.selected ? '#f0f9ff' : '#fff'};

  &:hover {
    border-color: #1890ff;
  }

  .option-content {
    .option-title {
      font-weight: 600;
      color: #333;
      margin-bottom: 4px;
    }
    
    .option-desc {
      font-size: 14px;
      color: #666;
    }
  }
`;

export const OrderSummary = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  position: sticky;
  top: 20px;

  h3 {
    font-size: 20px;
    font-weight: 700;
    color: #333;
    margin-bottom: 20px;
    text-align: center;
  }

  .summary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-size: 16px;

    span:first-child {
      color: #666;
    }

    span:last-child {
      font-weight: 600;
      color: #333;
    }

    &.discount span:last-child {
      color: #52c41a;
    }
  }

  .divider {
    height: 1px;
    background: #f0f0f0;
    margin: 16px 0;
  }

  .total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    span:first-child {
      font-size: 18px;
      font-weight: 700;
      color: #333;
    }

    .total-price {
      color: #ff4d4f;
      font-size: 24px;
      font-weight: bold;
    }
  }

  .tax-note {
    font-size: 12px;
    color: #999;
    text-align: center;
    margin-bottom: 20px;
  }

  .security-note {
    text-align: center;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
    
    span {
      font-size: 14px;
      color: #52c41a;
      font-weight: 500;
    }
  }

  @media (max-width: 768px) {
    position: static;
    padding: 20px 16px;
    
    h3 {
      font-size: 18px;
    }
    
    .total .total-price {
      font-size: 22px;
    }
  }
`;

export const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ProductItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;

  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 6px;
  }

  .product-info {
    flex: 1;
    
    .product-name {
      font-weight: 500;
      color: #333;
      margin-bottom: 4px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .product-price {
      font-weight: 600;
      color: #ff4d4f;
      font-size: 14px;
      
      .original-price {
        text-decoration: line-through;
        color: #999;
        font-size: 12px;
        margin-left: 6px;
      }
    }
    
    .product-discount {
      background: #fff2f0;
      color: #ff4d4f;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 11px;
      display: inline-block;
      margin-top: 4px;
    }
  }

  .product-quantity {
    font-weight: 600;
    color: #333;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    padding: 10px;
    
    img {
      width: 50px;
      height: 50px;
    }
    
    .product-info .product-name {
      font-size: 14px;
    }
  }
`;