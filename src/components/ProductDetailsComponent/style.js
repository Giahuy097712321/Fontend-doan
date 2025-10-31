// src/components/ProductDetailsComponent/style.js
import { Image, Col, InputNumber, Tabs } from 'antd';
import { styled } from 'styled-components';

export const WrapperProductImage = styled(Image)`
    width: 100%;
    height: 400px;
    object-fit: contain;
    border-radius: 8px;
    border: 1px solid #f0f0f0;
`;

export const WrapperProductInfo = styled.div`
    padding: 0 20px;
`;

export const WrapprerStyleImageSmall = styled(Image)`
    height: 64px;
    width: 64px;
`;

export const WrapperStyleNameProduct = styled.h1`
    color: #333;
    font-size: 28px;
    font-weight: 600;
    line-height: 1.4;
    margin-bottom: 12px;
    word-break: break-word;
`;

export const WrapperStyleTextSell = styled.span`
    font-size: 14px;
    line-height: 24px;
    color: #666;
`;

export const WrapperPriceProduct = styled.div`
    background: #f8f9fa;
    border-radius: 6px;
    padding: 5px 0;
    margin: 16px 0;
`;

export const WrapperPriceTextProduct = styled.div`
    font-size: 32px;
    line-height: 1.2;
    font-weight: 700;
    color: #d70018;
    padding: 10px 20px;
`;

export const WrapperAddressProduct = styled.div`
    padding: 12px;
    background: #f8f9fa;
    border-radius: 6px;
    margin: 16px 0;
    
    span.address {
        text-decoration: underline;
        font-size: 14px;
        font-weight: 500;
        color: #333;
    };
    
    span.change-address {
        color: #d70018;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
    }
`;

export const WrapperQuanlityProduct = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
    width: 140px;
    border: 2px solid #e8e8e8;
    border-radius: 8px;
    padding: 4px;
    background: #fff;
`;

export const WrapperInputNumber = styled(InputNumber)`
    &.ant-input-number.ant-input-number-sm {
        width: 60px;
        border: none;
        .ant-input-number-handler-wrap {
            display: none !important;
        }
        .ant-input-number-input {
            text-align: center;
            font-weight: 600;
        }
    }
`;

export const WrapperInfoSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 20px 0;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
`;

export const WrapperPolicyItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #333;
    
    span {
        font-weight: 500;
    }
`;

export const WrapperButtonGroup = styled.div`
    display: flex;
    gap: 16px;
    margin-top: 24px;
    
    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

// Thêm các styled components mới cho phần mô tả
export const WrapperDescription = styled.div`
  padding: 20px;
  
  .description-content {
    line-height: 1.6;
    color: #333;
    font-size: 14px;
    
    p {
      margin-bottom: 16px;
      text-align: justify;
    }
  }
  
  .specifications {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #e8e8e8;
    
    h3 {
      color: #d70018;
      margin-bottom: 16px;
      font-size: 18px;
      font-weight: 600;
    }
    
    .specs-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .spec-item {
      display: flex;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .spec-key {
        font-weight: 600;
        min-width: 200px;
        color: #666;
        font-size: 14px;
      }
      
      .spec-value {
        color: #333;
        flex: 1;
        font-size: 14px;
      }
    }
  }
`;

export const WrapperTabsContainer = styled.div`
  .ant-tabs {
    .ant-tabs-nav {
      margin-bottom: 0;
      
      .ant-tabs-tab {
        padding: 16px 32px;
        font-weight: 600;
        font-size: 16px;
        
        &:hover {
          color: #d70018;
        }
        
        .anticon {
          margin-right: 8px;
        }
      }
      
      .ant-tabs-tab-active {
        .ant-tabs-tab-btn {
          color: #d70018;
          font-weight: 700;
        }
      }
      
      .ant-tabs-ink-bar {
        background: #d70018;
        height: 3px;
      }
    }
    
    .ant-tabs-content {
      padding: 24px 0;
      min-height: 200px;
    }
    
    .ant-tabs-tabpane {
      padding: 0 8px;
    }
  }
`;

export const WrapperEmptyDescription = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
  
  .empty-icon {
    font-size: 48px;
    color: #ccc;
    margin-bottom: 16px;
  }
  
  p {
    font-size: 16px;
    margin: 0;
  }
`;