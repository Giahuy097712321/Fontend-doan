// HeaderComponent/style.js
import { Row } from 'antd';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px) rotate(0deg) scale(1);
  }
  33% {
    transform: translateY(-8px) rotate(5deg) scale(1.1);
  }
  66% {
    transform: translateY(4px) rotate(-3deg) scale(1.05);
  }
  100% {
    transform: translateY(0px) rotate(0deg) scale(1);
  }
`;

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
    filter: hue-rotate(0deg);
  }
  50% {
    background-position: 100% 50%;
    filter: hue-rotate(180deg);
  }
  100% {
    background-position: 0% 50%;
    filter: hue-rotate(360deg);
  }
`;

const neonGlow = keyframes`
  0%, 100% {
    text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #ff00de, 0 0 20px #ff00de;
    box-shadow: 0 0 5px rgba(255, 0, 222, 0.2), 0 0 20px rgba(255, 0, 222, 0.4);
  }
  50% {
    text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #00ffff, 0 0 40px #00ffff;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.4), 0 0 30px rgba(0, 255, 255, 0.6);
  }
`;

const matrixRain = keyframes`
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 0% 100%;
  }
`;

const hologram = keyframes`
  0%, 100% {
    opacity: 0.8;
    transform: scale(1) rotate(0deg);
  }
  25% {
    opacity: 1;
    transform: scale(1.02) rotate(1deg);
  }
  50% {
    opacity: 0.9;
    transform: scale(1) rotate(0deg);
  }
  75% {
    opacity: 1;
    transform: scale(1.02) rotate(-1deg);
  }
`;

const cyberPulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 0, 222, 0.7);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(255, 0, 222, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 0, 222, 0);
  }
`;

export const HeaderBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.isAdminPage
    ? 'linear-gradient(135deg, #8A2BE2 0%, #FF00FF 25%, #00FFFF 50%, #FF00FF 75%, #8A2BE2 100%)'
    : 'linear-gradient(135deg, #FF0080 0%, #FF00FF 25%, #00FFFF 50%, #FF00FF 75%, #FF0080 100%)'};
  background-size: 400% 400%;
  animation: ${gradientShift} 6s ease infinite;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      linear-gradient(90deg, transparent 95%, rgba(255, 255, 255, 0.3) 100%),
      linear-gradient(0deg, transparent 95%, rgba(255, 255, 255, 0.3) 100%);
    background-size: 50px 50px;
    animation: ${matrixRain} 20s linear infinite;
    opacity: 0.3;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(255, 0, 222, 0.4) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(0, 255, 255, 0.4) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(255, 0, 128, 0.3) 0%, transparent 50%);
    animation: ${hologram} 4s ease-in-out infinite;
  }
`;

export const HeaderContainer = styled.div`
  width: 100%;
  background: transparent;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 2px solid;
  border-image: ${props => props.isAdminPage
    ? 'linear-gradient(90deg, #8A2BE2, #FF00FF, #00FFFF, #FF00FF, #8A2BE2) 1'
    : 'linear-gradient(90deg, #FF0080, #FF00FF, #00FFFF, #FF00FF, #FF0080) 1'};
  backdrop-filter: blur(25px);
  overflow: hidden;
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  border-right: 1px solid rgba(255, 255, 255, 0.3);
`;

export const DecorationElement = styled.div`
  position: absolute;
  ${props => {
    switch (props.position) {
      case 'left': return 'left: 20px; top: 25%;';
      case 'right': return 'right: 20px; top: 25%;';
      case 'center-left': return 'left: 20%; top: 75%;';
      case 'center-right': return 'right: 20%; top: 75%;';
      case 'top-center': return 'left: 50%; top: 10px; transform: translateX(-50%);';
      default: return 'left: 20px; top: 50%;';
    }
  }}
  font-size: ${props => props.position.includes('center') ? '20px' : '28px'};
  opacity: 0.9;
  animation: ${float} 4s ease-in-out infinite, ${neonGlow} 3s ease-in-out infinite;
  animation-delay: ${props => {
    switch (props.position) {
      case 'left': return '0s, 0s';
      case 'right': return '1s, 0.5s';
      case 'center-left': return '2s, 1s';
      case 'center-right': return '3s, 1.5s';
      case 'top-center': return '1.5s, 2s';
      default: return '0s, 0s';
    }
  }};
  z-index: 2;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  padding: 12px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.5);
`;

export const WapperHeader = styled(Row)`
  padding: 8px 0;
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
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 12px 20px;
  border-radius: 15px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.6s;
  }
  
  &:hover {
    transform: scale(1.05);
    border-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 30px rgba(255, 0, 222, 0.6);
    
    &::before {
      left: 100%;
    }
    
    .logo-icon {
      transform: scale(1.2) rotate(15deg);
      filter: drop-shadow(0 0 15px rgba(255, 0, 222, 0.8));
    }
    
    .logo-text {
      animation: ${neonGlow} 2s ease-in-out infinite;
    }
  }
`;

export const WapperTextHeader = styled.span`
  font-size: 32px;
  color: #fff;
  font-weight: 900;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 12px;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.8);
  font-family: 'Arial Black', 'Segoe UI', sans-serif;
  letter-spacing: 1px;
  
  .logo-content {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
  }
  
  .logo-icon {
    font-size: 42px;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.5));
    animation: ${pulse} 3s ease-in-out infinite;
  }
  
  .logo-text {
    background: ${props => props.isAdminPage
    ? 'linear-gradient(45deg, #FF00FF, #00FFFF, #FF00FF)'
    : 'linear-gradient(45deg, #FF0080, #00FFFF, #FF0080)'};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    background-size: 300% 100%;
    animation: ${gradientShift} 4s ease infinite;
    font-weight: 900;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
  
  .admin-badge {
    background: linear-gradient(45deg, #FF00FF, #00FFFF);
    color: #000;
    padding: 6px 16px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 800;
    border: 2px solid rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    font-family: 'Courier New', monospace;
    animation: ${pulse} 2s ease-in-out infinite;
  }
`;

export const NotificationDot = styled.div`
  position: absolute;
  top: -8px;
  right: -10px;
  background: linear-gradient(45deg, #FF00FF, #00FFFF);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #000;
  animation: ${pulse} 1.5s infinite, ${neonGlow} 2s ease-in-out infinite;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  font-weight: bold;
  z-index: 10;
`;

export const SearchSection = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const SearchInputContainer = styled.div`
  width: 100%;
  max-width: 700px;
  
  .ant-input-group {
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border: 2px solid rgba(255, 255, 255, 0.4);
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(25px);
    
    &:hover {
      box-shadow: 0 12px 50px rgba(0, 0, 0, 0.7);
      transform: translateY(-3px);
      border-color: rgba(255, 255, 255, 0.8);
    }
    
    &:focus-within {
      border-color: #FF00FF;
      box-shadow: 0 0 0 4px rgba(255, 0, 222, 0.4), 0 15px 50px rgba(0, 0, 0, 0.7);
      animation: ${cyberPulse} 2s infinite;
    }
    
    .ant-input {
      height: 52px;
      font-size: 16px;
      padding: 0 24px;
      border: none;
      background: transparent;
      font-weight: 600;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: white;
      
      &::placeholder {
        color: rgba(255, 255, 255, 0.7);
        font-weight: 500;
      }
      
      &:focus {
        box-shadow: none;
        background: rgba(255, 255, 255, 0.1);
      }
    }
    
    .ant-input-search-button {
      height: 52px;
      background: linear-gradient(135deg, #FF00FF, #00FFFF);
      border: none;
      color: #000;
      font-weight: 700;
      font-size: 15px;
      padding: 0 30px;
      transition: all 0.3s ease;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      
      &:hover {
        background: linear-gradient(135deg, #FF00CC, #00CCFF);
        transform: scale(1.05);
        box-shadow: 0 6px 25px rgba(255, 0, 222, 0.6);
        animation: ${neonGlow} 1s ease-in-out infinite;
      }
    }
  }
`;

export const WapperHeaderAccount = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  gap: 15px;
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 24px;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(0, 0, 0, 0.4);
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
    background: linear-gradient(90deg, transparent, rgba(255, 0, 222, 0.3), transparent);
    transition: left 0.6s;
  }
  
  &:hover {
    background: rgba(0, 0, 0, 0.6);
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.6);
    border-color: rgba(255, 0, 222, 0.8);
    
    &::before {
      left: 100%;
    }
    
    .avatar-container {
      animation: ${pulse} 1s ease-in-out;
    }
  }

  .avatar-container {
    position: relative;
    
    .admin-corner {
      position: absolute;
      bottom: -4px;
      right: -4px;
      background: linear-gradient(45deg, #FF00FF, #00FFFF);
      border-radius: 50%;
      width: 22px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: #000;
      border: 2px solid white;
      box-shadow: 0 3px 15px rgba(0, 0, 0, 0.4);
      animation: ${pulse} 2s infinite;
    }
  }

  .dropdown-icon {
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  .user-role {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 600;
    background: linear-gradient(45deg, rgba(255, 0, 222, 0.3), rgba(0, 255, 255, 0.3));
    padding: 4px 10px;
    border-radius: 10px;
    margin-top: 4px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    animation: ${pulse} 3s ease-in-out infinite;
  }
`;

export const LoginPrompt = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 24px;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(25px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  
  &:hover {
    background: rgba(0, 0, 0, 0.6);
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.6);
    border-color: rgba(255, 0, 222, 0.8);
    animation: ${cyberPulse} 2s infinite;
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
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

export const CartSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 12px 20px;
  border-radius: 15px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  
  &:hover {
    background: rgba(0, 0, 0, 0.6);
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.6);
    border-color: rgba(255, 0, 222, 0.8);
    animation: ${neonGlow} 1s ease-in-out infinite;
    
    .cart-icon {
      transform: scale(1.2);
      filter: drop-shadow(0 0 15px rgba(255, 0, 222, 0.8));
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
      background: rgba(255, 0, 222, 0.4);
      animation: ${pulse} 2s infinite;
    }
  }
  
  .cart-icon {
    font-size: 32px;
    color: #fff;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4));
  }
  
  .ant-badge {
    .ant-badge-count {
      min-width: 22px;
      height: 22px;
      line-height: 22px;
      font-size: 11px;
      font-weight: 800;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
      border: 2px solid white;
      background: linear-gradient(45deg, #FF00FF, #00FFFF);
      color: #000;
    }
  }
`;

export const WrapperContentPopup = styled.p`
  cursor: pointer;
  padding: 14px 18px;
  margin: 0;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  border: 1px solid transparent;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  
  &:hover {
    background: linear-gradient(135deg, #FF00FF, #00FFFF);
    color: #000;
    transform: translateX(8px) scale(1.05);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
    border-color: rgba(255, 255, 255, 0.5);
    animation: ${pulse} 0.5s ease-in-out;
  }
  
  &:active {
    transform: translateX(8px) scale(0.98);
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