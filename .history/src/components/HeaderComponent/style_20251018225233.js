// HeaderComponent/style.js
import { Row } from 'antd';
import styled from 'styled-components';

export const HeaderContainer = styled.div`
  width: 100%;
  background: ${props => props.isAdminPage
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : 'linear-gradient(135deg, #1a94ff 0%, #0d7ae6 100%)'};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: ${props => props.isAdminPage ? '2px solid #8c6bce' : '2px solid #1890ff'};
`;

export const WapperHeader = styled(Row)`
  padding: 12px 0;
  width: 1270px;
  margin: 0 auto;
  align-items: center;
  gap: 16px;
  flex-wrap: nowrap;
`;

export const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

export const WapperTextHeader = styled.span`
  font-size: 24px;
  color: #fff;
  font-weight: 700;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  
  .admin-badge {
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 600;
    border: 1px solid rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(10px);
  }
`;

export const SearchSection = styled.div`
  display: flex;
  justify-content: center;
  
  .ant-input-group {
    border-radius: 25px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    
    &:hover {
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
      transform: translateY(-1px);
    }
  }
`;

export const WapperHeaderAccount = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  gap: 10px;
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .dropdown-icon {
    transition: transform 0.3s ease;
    color: rgba(255, 255, 255, 0.8);
    
    &.rotate {
      transform: rotate(180deg);
    }
  }
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  
  .user-name {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    display: flex;
    align-items: center;
  }
  
  .user-role {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
  }
`;

export const LoginPrompt = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .login-text {
    display: flex;
    flex-direction: column;
    
    .account-link {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
`;

export const WapperTextHeaderSmall = styled.span`
  font-size: 12px;
  color: #fff;
  white-space: nowrap;
  font-weight: 500;
`;

export const CartSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    
    .cart-icon {
      transform: scale(1.1);
    }
  }
  
  .cart-icon {
    font-size: 28px;
    color: #fff;
    transition: transform 0.2s ease;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }
  
  .ant-badge {
    .ant-badge-count {
      min-width: 18px;
      height: 18px;
      line-height: 18px;
      font-size: 11px;
      font-weight: 700;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
  }
`;

export const WrapperContentPopup = styled.p`
  cursor: pointer;
  padding: 10px 16px;
  margin: 0;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  
  &:hover {
    background: linear-gradient(135deg, #1a94ff 0%, #0d7ae6 100%);
    color: #fff;
    transform: translateX(4px);
  }
  
  &:active {
    transform: translateX(4px) scale(0.98);
  }
`;

export default {
  HeaderContainer,
  WapperHeader,
  WapperTextHeader,
  WapperHeaderAccount,
  WapperTextHeaderSmall,
  WrapperContentPopup,
  LogoContainer,
  SearchSection,
  UserSection,
  CartSection,
  UserInfo,
  LoginPrompt
};