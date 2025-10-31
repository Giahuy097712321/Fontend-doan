import styled from "styled-components";

export const WrapperContainer = styled.div`
  background: #f5f5fa;
  min-height: 100vh;
  padding: 24px 0;
  
  .order-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .page-header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    
    h1 {
      font-size: 28px;
      font-weight: 700;
      color: #262626;
      margin: 0;
    }
  }

  /* Card Styles */
  .order-card {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid #f0f0f0;
    
    .ant-card-head {
      border-bottom: 1px solid #f0f0f0;
      padding: 16px 24px;
      
      .ant-card-head-title {
        padding: 0;
      }
    }
    
    .ant-card-body {
      padding: 24px;
    }
  }
  
  .products-list {
    max-height: 400px;
    overflow-y: auto;
    
    /* Custom scrollbar */
    &::-webkit-scrollbar {
      width: 4px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 2px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 2px;
    }
  }
`;

export const WrapperListOrder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const WrapperOrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  
  .order-info {
    flex: 1;
    
    .order-id {
      font-size: 16px;
      font-weight: 600;
      color: #262626;
      margin-bottom: 4px;
    }
    
    .order-date {
      font-size: 14px;
      color: #666;
    }
  }
  
  .order-status {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  
  .total-amount {
    font-size: 18px;
    font-weight: 700;
    color: #ff4d4f;
  }
`;

export const WrapperHeaderItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 0;
  gap: 16px;
  
  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
`;

export const WrapperProductInfo = styled.div`
  flex: 1;
  
  .product-name {
    font-size: 15px;
    font-weight: 500;
    color: #262626;
    margin-bottom: 6px;
    line-height: 1.4;
  }
  
  .product-details {
    font-size: 13px;
    color: #666;
    
    .discount {
      color: #ff4d4f;
      margin-left: 8px;
      font-weight: 500;
    }
  }
`;

export const WrapperPriceInfo = styled.div`
  text-align: right;
  min-width: 120px;
  
  .original-price {
    font-size: 13px;
    color: #999;
    text-decoration: line-through;
    margin-bottom: 2px;
  }
  
  .final-price {
    font-size: 15px;
    color: #ff4d4f;
    font-weight: 600;
  }
`;

export const WrapperFooterItem = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const WrapperActionButtons = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const EmptyOrder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  
  .ant-empty-image {
    height: 120px;
  }
  
  .ant-empty-description {
    font-size: 16px;
    color: #666;
  }
`;