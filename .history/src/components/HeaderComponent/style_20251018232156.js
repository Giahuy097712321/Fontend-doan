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
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-8px) rotate(5deg);
  }
  100% {
    transform: translateY(0px) rotate(0deg);
  }
`;

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

export const HeaderBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.isAdminPage
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #8B5FBF 100%)'
    : 'linear-gradient(135deg, #FF6B9D 0%, #FF8E53 50%, #FFD93D 100%)'};
  background-size: 400% 400%;
  animation: ${gradientShift} 8s ease infinite;
  z-index: 1;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    animation: ${shimmer} 3s infinite;
  }
`;

export const HeaderContainer = styled.div`
  width: 100%;
  background: transparent;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.25);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: ${props => props.isAdminPage
    ? '3px solid rgba(139, 95, 191, 0.8)'
    : '3px solid rgba(255, 107, 157, 0.8)'};
  backdrop-filter: blur(20px);
  overflow: hidden;
`;

export const DecorationElement = styled.div`
  position: absolute;
  ${props => {
    switch (props.position) {
      case 'left': return 'left: 30px; top: 30%;';
      case 'right': return 'right: 30px; top: 30%;';
      case 'center-left': return 'left: 25%; top: 70%;';
      case 'center-right': return 'right: 25%; top: 70%;';
      default: return 'left: 20px; top: 50%;';
    }
  }}
  font-size: ${props => props.position.includes('center') ? '18px' : '24px'};
  opacity: 0.7;
  animation: ${float} 4s ease-in-out infinite;
  animation-delay: ${props => {
    switch (props.position) {
      case 'left': return '0s';
      case 'right': return '1s';
      case 'center-left': return '2s';
      case 'center-right': return '3s';
      default: return '0s';
    }
  }};
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
  z-index: 2;
`;

export const WapperHeader = styled(Row)`
  padding: 12px 0;
  width: 1270px;
  margin: 0 auto;
  align-items: center;
  gap: 20px;
  flex-wrap: nowrap;
  position: relative;
  z-index: 3;
`;

export const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  padding: 8px 16px;
  border-radius: 20px;
  
  &:hover {
    transform: scale(1.05) rotate(-2deg);
    background: rgba(255, 255, 255, 0.15);
    
    .logo-icon {
      transform: scale(1.3) rotate(15deg);
    }
    
    .logo-text {
      background: linear-gradient(45deg, #fff, #FFD93D, #fff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
`;

export const WapperTextHeader = styled.span`
  font-size: 28px;
  color: #fff;
  font-weight: 900;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 10px;
  text-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  
  .logo-content {
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
  }
  
  .logo-icon {
    font-size: 36px;
    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
  }
  
  .logo-text {
    background: ${props => props.isAdminPage
    ? 'linear-gradient(45deg, #fff, #E9D8FD, #fff)'
    : 'linear-gradient(45deg, #fff, #FFEAA7, #fff)'};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    background-size: 200% 100%;
    animation: ${gradientShift} 3s ease infinite;
    font-weight: 900;
    letter-spacing: -0.5px;
  }
  
  .admin-badge {
    background: linear-gradient(45deg, #FF6B6B, #FFD93D);
    color: #fff;
    padding: 6px 14px;
    border-radius: 25px;
    font-size: 12px;
    font-weight: 800;
    border: 2px solid rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }
`;

export const NotificationDot = styled.div`
  position: absolute;
  top: -6px;
  right: -8px;
  background: linear-gradient(45deg, #FF6B6B, #FFD93D);
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: white;
  animation: ${pulse} 2s infinite;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

export const SearchSection = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const SearchInputContainer = styled.div`
  width: 100%;
  max-width: 650px;
  
  .ant-input-group {
    border-radius: 30px;
    overflow: hidden;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border: 2px solid rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    
    &:hover {
      box-shadow: 0 16px 50px rgba(0, 0, 0, 0.4);
      transform: translateY(-3px);
      border-color: rgba(255, 255, 255, 0.8);
    }
    
    &:focus-within {
      border-color: ${props => props.isAdminPage ? '#8B5FBF' : '#FF6B9D'};
      box-shadow: 0 0 0 4px ${props => props.isAdminPage
    ? 'rgba(139, 95, 191, 0.3)'
    : 'rgba(255, 107, 157, 0.3)'};
    }
    
    .ant-input {
      height: 52px;
      font-size: 16px;
      padding: 0 24px;
      border: none;
      background: transparent;
      font-weight: 500;
      
      &::placeholder {
        color: #999;
        font-weight: 400;
      }
      
      &:focus {
        box-shadow: none;
      }
    }
    
    .ant-input-search-button {
      height: 52px;
      background: ${props => props.isAdminPage
    ? 'linear-gradient(135deg, #8B5FBF, #667eea)'
    : 'linear-gradient(135deg, #FF6B9D, #FF8E53)'};
      border: none;
      color: white;
      font-weight: 700;
      font-size: 16px;
      padding: 0 30px;
      transition: all 0.3s ease;
      
      &:hover {
        background: ${props => props.isAdminPage
    ? 'linear-gradient(135deg, #7C4DBF, #5A6FEA)'
    : 'linear-gradient(135deg, #FF5286, #FF7B3A)'};
        transform: scale(1.02);
      }
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
  gap: 15px;
  padding: 12px 24px;
  border-radius: 35px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(25px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.6s;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-4px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.6);
    
    &::before {
      left: 100%;
    }
  }

  .avatar-container {
    position: relative;
    
    .admin-corner {
      position: absolute;
      bottom: -3px;
      right: -3px;
      background: linear-gradient(45deg, #FFD93D, #FF6B6B);
      border-radius: 50%;
      width: 22px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: #333;
      border: 2px solid white;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
    }
  }

  .dropdown-icon {
    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    color: rgba(255, 255, 255, 0.9);
    font-size: 14px;
    
    &.rotate {
      transform: rotate(180deg);
    }
  }
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  
  .user-name {
    font-size: 15px;
    font-weight: 700;
    color: #fff;
    display: flex;
    align-items: center;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .user-role {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 600;
    background: rgba(255, 255, 255, 0.2);
    padding: 2px 8px;
    border-radius: 10px;
    margin-top: 2px;
    backdrop-filter: blur(10px);
  }
`;

export const LoginPrompt = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 24px;
  border-radius: 35px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(25px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-4px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.6);
  }
  
  .login-text {
    display: flex;
    flex-direction: column;
    
    .account-link {
      display: flex;
      align-items: center;
      gap: 6px;
      transition: transform 0.3s ease;
    }
  }
  
  &:hover .account-link {
    transform: translateX(5px);
  }
`;

export const WapperTextHeaderSmall = styled.span`
  font-size: 13px;
  color: #fff;
  white-space: nowrap;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

export const CartSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 12px 20px;
  border-radius: 25px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    
    .cart-icon {
      transform: scale(1.2) rotate(-5deg);
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
      background: rgba(255, 255, 255, 0.4);
      animation: ${pulse} 2s infinite;
    }
  }
  
  .cart-icon {
    font-size: 34px;
    color: #fff;
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4));
  }
  
  .ant-badge {
    .ant-badge-count {
      min-width: 22px;
      height: 22px;
      line-height: 22px;
      font-size: 12px;
      font-weight: 800;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      border: 2px solid white;
    }
  }
`;

export const WrapperContentPopup = styled.p`
  cursor: pointer;
  padding: 14px 18px;
  margin: 0;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  border: 1px solid transparent;
  
  &:hover {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    transform: translateX(10px) scale(1.02);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  &:active {
    transform: translateX(10px) scale(0.98);
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
  LoginPrompt,
  SearchInputContainer,
  DecorationElement,
  NotificationDot,
  HeaderBackground
};