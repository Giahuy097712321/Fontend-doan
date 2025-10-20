// HeaderComponent/style.js
import { Row } from 'antd';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0px);
  }
`;

export const HeaderContainer = styled.div`
  width: 100%;
  background: ${props => props.isAdminPage
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : 'linear-gradient(135deg, #1a94ff 0%, #0d7ae6 100%)'};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: ${props => props.isAdminPage ? '3px solid #8c6bce' : '3px solid #1890ff'};
  backdrop-filter: blur(10px);
  overflow: hidden;
`;

export const DecorationElement = styled.div`
  position: absolute;
  ${props => props.position === 'left' ? 'left: 20px;' : 'right: 20px;'}
  top: 50%;
  transform: translateY(-50%);
  font-size: 24px;
  opacity: 0.6;
  animation: ${float} 3s ease-in-out infinite;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  z-index: 1;
`;

export const WapperHeader = styled(Row)`
  padding: 15px 0;
  width: 1270px;
  margin: 0 auto;
  align-items: center;
  gap: 20px;
  flex-wrap: nowrap;
  position: relative;
  z-index: 2;
`;

export const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05) rotate(-1deg);
    
    .logo-icon {
      transform: scale(1.2) rotate(10deg);
    }
  }
`;

export const WapperTextHeader = styled.span`
  font-size: 28px;
  color: #fff;
  font-weight: 800;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 8px;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  
  .logo-content {
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
  }
  
  .logo-icon {
    font-size: 32px;
    transition: transform 0.3s ease;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }
  
  .logo-text {
    background: linear-gradient(45deg, #fff, #ffeaa7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 900;
  }
  
  .admin-badge {
    background: linear-gradient(45deg, #ff6b6b, #ffd93d);
    color: #fff;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    border: 2px solid rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(10px);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }
`;

export const NotificationDot = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff6b6b;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: white;
  animation: ${pulse} 2s infinite;
  cursor: pointer;
`;

export const SearchSection = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const SearchInputContainer = styled.div`
  width: 100%;
  max-width: 600px;
  
  .ant-input-group {
    border-radius: 30px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    border: 2px solid rgba(255, 255, 255, 0.3);
    
    &:hover {
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
      transform: translateY(-2px);
      border-color: rgba(255, 255, 255, 0.5);
    }
    
    .ant-input {
      height: 48px;
      font-size: 16px;
      padding: 0 20px;
      border: none;
      background: rgba(255, 255, 255, 0.95);
      
      &::placeholder {
        color: #999;
      }
    }
    
    .ant-input-search-button {
      height: 48px;
      background: linear-gradient(45deg, #ff6b6b, #ffd93d);
      border: none;
      color: white;
      font-weight: 600;
      font-size: 16px;
      padding: 0 25px;
      
      &:hover {
        background: linear-gradient(45deg, #ff5252, #ffc107);
      }
    }
  }
  
  .search-suggestions {
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
    
    .suggestion-item {
      background: rgba(255, 255, 255, 0.2);
      padding: 4px 12px;
      border-radius: 15px;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: translateY(-1px);
      }
    }
  }
`;

// ... (giữ nguyên các styled components khác từ code trước)

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(15px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }

  .avatar-container {
    position: relative;
    
    .admin-corner {
      position: absolute;
      bottom: -2px;
      right: -2px;
      background: #ffd93d;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: #333;
      border: 2px solid white;
    }
  }

  .dropdown-icon {
    transition: transform 0.3s ease;
    color: rgba(255, 255, 255, 0.9);
    font-size: 14px;
    
    &.rotate {
      transform: rotate(180deg);
    }
  }
`;

export const CartSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-3px);
    
    .cart-icon {
      transform: scale(1.15);
    }
    
    .cart-pulse {
      animation: ${pulse} 1s ease-in-out;
    }
  }
  
  .cart-container {
    position: relative;
    
    .cart-pulse {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      animation: ${pulse} 2s infinite;
    }
  }
  
  .cart-icon {
    font-size: 32px;
    color: #fff;
    transition: transform 0.2s ease;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  }
  
  .ant-badge {
    .ant-badge-count {
      min-width: 20px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      font-weight: 700;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }
  }
`;

export const WrapperContentPopup = styled.p`
  cursor: pointer;
  padding: 12px 16px;
  margin: 0;
  border-radius: 10px;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  
  &:hover {
    background: linear-gradient(135deg, #1a94ff 0%, #0d7ae6 100%);
    color: #fff;
    transform: translateX(8px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateX(8px) scale(0.95);
  }
`;

// ... (giữ nguyên các styled components còn lại)