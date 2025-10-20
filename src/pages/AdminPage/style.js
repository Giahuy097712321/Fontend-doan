// AdminPage/style.js
import styled from "styled-components";

export const AdminContainer = styled.div`
  .ant-layout-sider {
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    border-right: 1px solid #e8e8e8;
  }

  .ant-menu-item {
    margin: 4px 8px;
    border-radius: 6px;
    height: 40px;
    line-height: 40px;
    
    &.ant-menu-item-selected {
      background-color: #e6f7ff;
      color: #1890ff;
      font-weight: 500;
      
      &::after {
        border-right: 3px solid #1890ff;
      }
    }
    
    &:hover {
      background-color: #f5f5f5;
      color: #1890ff;
    }
  }

  .ant-menu-inline {
    border-right: none;
  }

  .admin-header {
    padding: 16px;
    text-align: center;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 8px;
    
    .admin-title {
      font-weight: 600;
      color: #1890ff;
      margin-top: 8px;
      font-size: 16px;
    }
  }

  .content-area {
    background: #f5f5f5;
    min-height: calc(100vh - 64px);
    padding: 24px;
  }

  @media (max-width: 768px) {
    .ant-layout-sider {
      position: fixed !important;
      z-index: 1000;
      height: 100vh;
    }
    
    .content-area {
      padding: 16px;
    }
  }
`;

export const SiderLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 8px;
  
  .logo-icon {
    font-size: 24px;
    color: #1890ff;
  }
  
  .logo-text {
    font-weight: 600;
    color: #1890ff;
    margin-left: 8px;
    font-size: 16px;
  }
`;

export const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  
  .menu-icon {
    font-size: 16px;
  }
  
  .menu-text {
    font-size: 14px;
  }
`;

export default {
    AdminContainer,
    SiderLogo,
    MenuItem
};