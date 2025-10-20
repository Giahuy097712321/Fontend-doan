// HeaderComponent/style.js
import { Row } from 'antd';
import styled from 'styled-components';

export const HeaderContainer = styled.div`
  width: 100%;
  background: ${props => props.isAdminPage
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        : 'linear-gradient(135deg, #1a94ff 0%, #0d7ae6 100%)'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

export const WapperHeader = styled(Row)`
  padding: 12px 0;
  width: 1270px;
  margin: 0 auto;
  align-items: center;
  gap: 16px;
  flex-wrap: nowrap;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

export const WapperTextHeader = styled.span`
  font-size: 24px;
  color: #fff;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const AdminBadge = styled.span`
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
`;

export const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  
  .ant-input-group {
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
  justify-content: flex-end;
`;

export const WapperHeaderAccount = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  gap: 10px;
`;

export const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
  
  .user-info {
    display: flex;
    flex-direction: column;
    
    .user-name {
      font-size: 14px;
      font-weight: 600;
      color: #fff;
    }
    
    .user-role {
      font-size: 10px;
      color: rgba(255, 255, 255, 0.8);
    }
  }
  
  .dropdown-icon {
    color: rgba(255, 255, 255, 0.8);
    font-size: 12px;
  }
`;

export const LoginSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
  
  .login-text {
    display: flex;
    flex-direction: column;
    
    .account-text {
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

export const CartBadge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 8px;
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
    
    .cart-icon {
      transform: scale(1.1);
    }
  }
  
  .cart-icon {
    font-size: 24px;
    color: #fff;
    transition: transform 0.2s ease;
  }
  
  .ant-badge {
    .ant-badge-count {
      min-width: 16px;
      height: 16px;
      line-height: 16px;
      font-size: 10px;
      font-weight: 600;
    }
  }
`;

export const WrapperContentPopup = styled.p`
  cursor: pointer;
  padding: 8px 12px;
  margin: 0;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #1890ff;
    color: #fff;
  }
`;

// Responsive styles
export const MobileMenu = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

export default {
    HeaderContainer,
    WapperHeader,
    WapperTextHeader,
    WapperHeaderAccount,
    WapperTextHeaderSmall,
    WrapperContentPopup,
    Logo,
    SearchContainer,
    ActionButtons,
    UserMenu,
    CartBadge,
    AdminBadge,
    LoginSection,
    MobileMenu
};