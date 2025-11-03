// HeaderComponent/style.js
import { Row, Drawer } from 'antd';
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
    transform: translateY(-5px) rotate(2deg);
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

const gridMove = keyframes`
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(50px, 50px);
  }
`;

const circuitGlow = keyframes`
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.8;
  }
`;

const techPulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(74, 144, 226, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(74, 144, 226, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(74, 144, 226, 0);
  }
`;

export const HeaderBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.isAdminPage
    ? 'linear-gradient(135deg, #1a2a6c 0%, #2a3a7c 50%, #3a4a8c 100%)'
    : 'linear-gradient(135deg, #0f1b2f 0%, #1c2c46 50%, #2a3c5c 100%)'};
  background-size: 400% 400%;
  animation: ${gradientShift} 10s ease infinite;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      linear-gradient(90deg, transparent 98%, rgba(74, 144, 226, 0.1) 100%),
      linear-gradient(0deg, transparent 98%, rgba(74, 144, 226, 0.1) 100%);
    background-size: 30px 30px;
    animation: ${gridMove} 20s linear infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(74, 144, 226, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(42, 157, 244, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(23, 107, 239, 0.05) 0%, transparent 50%);
    animation: ${circuitGlow} 4s ease-in-out infinite;
  }

  @media (max-width: 768px) {
    &::before {
      background-size: 20px 20px;
    }
  }
`;

export const HeaderContainer = styled.div`
  width: 100%;
  background: transparent;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: ${props => props.isAdminPage
    ? '2px solid rgba(74, 144, 226, 0.8)'
    : '2px solid rgba(42, 157, 244, 0.6)'};
  backdrop-filter: blur(20px);
  overflow: hidden;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  border-right: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    backdrop-filter: blur(10px);
  }
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
  font-size: ${props => props.position.includes('center') ? '16px' : '20px'};
  opacity: 0.8;
  animation: ${float} 5s ease-in-out infinite;
  animation-delay: ${props => {
    switch (props.position) {
      case 'left': return '0s';
      case 'right': return '1.5s';
      case 'center-left': return '3s';
      case 'center-right': return '4.5s';
      default: return '0s';
    }
  }};
  filter: drop-shadow(0 0 8px rgba(74, 144, 226, 0.6));
  z-index: 2;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  padding: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);

  @media (max-width: 768px) {
    display: none;
  }
`;

export const WapperHeader = styled(Row)`
  padding: 10px 0;
  width: 1270px;
  margin: 0 auto;
  align-items: center;
  gap: 20px;
  flex-wrap: nowrap;
  position: relative;
  z-index: 3;

  @media (max-width: 1270px) {
    width: 100%;
    padding: 10px 16px;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    gap: 10px;
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 8px 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  
  &:hover {
    transform: scale(1.02);
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(74, 144, 226, 0.5);
    box-shadow: 0 0 20px rgba(74, 144, 226, 0.3);
    
    .logo-icon {
      transform: scale(1.1) rotate(10deg);
      filter: drop-shadow(0 0 10px rgba(74, 144, 226, 0.8));
    }
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    
    &:hover {
      transform: none;
    }
  }
`;

export const WapperTextHeader = styled.span`
  font-size: 26px;
  color: #fff;
  font-weight: 800;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 10px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  
  .logo-content {
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
  }
  
  .logo-icon {
    font-size: 32px;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
  }
  
  .logo-text {
    background: ${props => props.isAdminPage
    ? 'linear-gradient(45deg, #4A90E2, #2D9CDB, #4A90E2)'
    : 'linear-gradient(45deg, #4A90E2, #2D9CDB, #56CCF2)'};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    background-size: 200% 100%;
    animation: ${gradientShift} 4s ease infinite;
    font-weight: 800;
    letter-spacing: -0.5px;
  }
  
  .admin-badge {
    background: linear-gradient(45deg, #4A90E2, #2D9CDB);
    color: #fff;
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
    border: 1px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    font-family: 'Courier New', monospace;
  }

  @media (max-width: 768px) {
    font-size: 20px;
    
    .logo-icon {
      font-size: 24px;
    }
    
    .logo-text {
      font-size: 18px;
    }
  }
`;

export const NotificationDot = styled.div`
  position: absolute;
  top: -4px;
  right: -6px;
  background: linear-gradient(45deg, #4A90E2, #2D9CDB);
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  color: white;
  animation: ${pulse} 2s infinite;
  cursor: pointer;
  border: 1px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  font-weight: bold;

  @media (max-width: 768px) {
    width: 14px;
    height: 14px;
    font-size: 7px;
    top: -2px;
    right: -4px;
  }
`;

export const SearchSection = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const SearchInputContainer = styled.div`
  width: 100%;
  max-width: 650px;
  
  .ant-input-group {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    
    &:hover {
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
      transform: translateY(-2px);
      border-color: rgba(74, 144, 226, 0.5);
    }
    
    &:focus-within {
      border-color: #4A90E2;
      box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.3), 0 12px 40px rgba(0, 0, 0, 0.4);
      animation: ${techPulse} 2s infinite;
    }
    
    .ant-input {
      height: 48px;
      font-size: 15px;
      padding: 0 20px;
      border: none;
      background: transparent;
      font-weight: 500;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      
      &::placeholder {
        color: #666;
        font-weight: 400;
      }
      
      &:focus {
        box-shadow: none;
      }
    }
    
    .ant-input-search-button {
      height: 48px;
      background: linear-gradient(135deg, #4A90E2, #2D9CDB);
      border: none;
      color: white;
      font-weight: 600;
      font-size: 14px;
      padding: 0 25px;
      transition: all 0.3s ease;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      
      &:hover {
        background: linear-gradient(135deg, #3A80D2, #1D8CCB);
        transform: scale(1.02);
        box-shadow: 0 4px 15px rgba(74, 144, 226, 0.4);
      }
    }
  }

  @media (max-width: 768px) {
    max-width: 100%;
    
    .ant-input-group {
      .ant-input {
        height: 44px;
        font-size: 14px;
        padding: 0 16px;
      }
      
      .ant-input-search-button {
        height: 44px;
        padding: 0 20px;
      }
    }
  }
`;

export const WapperHeaderAccount = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  gap: 10px;

  @media (max-width: 768px) {
    gap: 6px;
  }
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(74, 144, 226, 0.2), transparent);
    transition: left 0.6s;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    border-color: rgba(74, 144, 226, 0.4);
    
    &::before {
      left: 100%;
    }
  }

  .avatar-container {
    position: relative;
    
    .admin-corner {
      position: absolute;
      bottom: -2px;
      right: -2px;
      background: linear-gradient(45deg, #4A90E2, #2D9CDB);
      border-radius: 50%;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      color: white;
      border: 1px solid white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
  }

  .dropdown-icon {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    color: rgba(255, 255, 255, 0.8);
    font-size: 12px;
    
    &.rotate {
      transform: rotate(180deg);
    }
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    gap: 8px;
    
    &:hover {
      transform: none;
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
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  .user-role {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
    background: rgba(255, 255, 255, 0.1);
    padding: 2px 8px;
    border-radius: 8px;
    margin-top: 2px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    .user-name {
      font-size: 12px;
    }
    
    .user-role {
      font-size: 9px;
    }
  }
`;

export const LoginPrompt = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    border-color: rgba(74, 144, 226, 0.4);
  }
  
  .login-text {
    display: flex;
    flex-direction: column;
    
    .account-link {
      display: flex;
      align-items: center;
      gap: 4px;
      transition: transform 0.3s ease;
    }
  }
  
  &:hover .account-link {
    transform: translateX(3px);
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    gap: 8px;
    
    &:hover {
      transform: none;
    }
  }
`;

export const WapperTextHeaderSmall = styled.span`
  font-size: 12px;
  color: #fff;
  white-space: nowrap;
  font-weight: 500;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

export const CartSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 10px 16px;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    border-color: rgba(74, 144, 226, 0.4);
    
    .cart-icon {
      transform: scale(1.1);
      filter: drop-shadow(0 0 8px rgba(74, 144, 226, 0.6));
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
      background: rgba(74, 144, 226, 0.3);
      animation: ${pulse} 2s infinite;
    }
  }
  
  .cart-icon {
    font-size: 28px;
    color: #fff;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.3));
  }
  
  .ant-badge {
    .ant-badge-count {
      min-width: 20px;
      height: 20px;
      line-height: 20px;
      font-size: 11px;
      font-weight: 700;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      border: 1px solid white;
      background: linear-gradient(45deg, #4A90E2, #2D9CDB);
    }
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    gap: 4px;
    
    .cart-icon {
      font-size: 24px;
    }
    
    &:hover {
      transform: none;
    }
  }
`;

export const WrapperContentPopup = styled.p`
  cursor: pointer;
  padding: 12px 16px;
  margin: 0;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  border: 1px solid transparent;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  
  &:hover {
    background: linear-gradient(135deg, #4A90E2, #2D9CDB);
    color: #fff;
    transform: translateX(5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.2);
  }
  
  &:active {
    transform: translateX(5px) scale(0.98);
  }
`;

// Mobile Components
export const MobileMenuButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 18px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(74, 144, 226, 0.4);
  }
`;

export const SearchButtonMobile = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 18px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(74, 144, 226, 0.4);
  }
`;

export const MobileMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const MobileMenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background: #f5f5f5;
    transform: translateX(5px);
  }

  &.logout {
    color: #ff4d4f;
    border-top: 1px solid #f0f0f0;
    margin-top: 8px;
    padding-top: 16px;
  }

  &.login {
    background: linear-gradient(135deg, #4A90E2, #2D9CDB);
    color: white;
    justify-content: center;
    font-weight: 600;

    &:hover {
      background: linear-gradient(135deg, #3A80D2, #1D8CCB);
    }
  }
`;

export const SearchDrawer = styled(Drawer)`
  .ant-drawer-header {
    border-bottom: 1px solid #f0f0f0;
  }

  .ant-drawer-body {
    padding: 20px;
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
  HeaderBackground,
  MobileMenuButton,
  MobileMenu,
  MobileMenuItem,
  SearchButtonMobile,
  SearchDrawer
};