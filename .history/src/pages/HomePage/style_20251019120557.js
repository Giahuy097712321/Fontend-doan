import styled from "styled-components";
import ButtonComponent from './../../components/ButtonComponent/ButtonComponent';

export const HomePageContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  background: linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%);
  
  .category-section {
    padding: 40px 0 20px 0;
    background: white;
    margin: 20px 0;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }
  
  .products-section {
    padding: 40px 0;
    background: white;
    margin: 20px 0;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }
  
  .load-more-section {
    display: flex;
    justify-content: center;
    margin-top: 40px;
    padding: 20px 0;
  }
  
  .no-products {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 60px 20px;
    background: white;
    border-radius: 20px;
    margin: 20px 0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    
    .no-products-content {
      text-align: center;
      
      h3 {
        font-size: 24px;
        color: #333;
        margin-bottom: 12px;
        font-weight: 600;
      }
      
      p {
        font-size: 16px;
        color: #666;
        line-height: 1.6;
      }
    }
  }
`;

export const HeroSection = styled.div`
  width: 100%;
  margin-bottom: 30px;
  
  .slider-container {
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  }
`;

export const SectionTitle = styled.div`
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  
  .title-text {
    font-size: 32px;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: inline-block;
    margin-bottom: 16px;
    position: relative;
    z-index: 2;
  }
  
  .title-decoration {
    width: 80px;
    height: 4px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    margin: 0 auto;
    border-radius: 2px;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 16px;
      height: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
  }
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(102, 126, 234, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
    }
  }
`;

export const WapperTypeProduct = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const WrapperProducts = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
    padding: 0 16px;
  }
`;

export const WrapperButtonMore = styled(ButtonComponent)`
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(24, 144, 255, 0.3);
    
    ${props => !props.disabled && `
      color: #fff !important;
      background: linear-gradient(135deg, #1890ff, #52c41a) !important;
      border-color: transparent !important;
      
      span {
        color: #fff !important;
      }
    `}
  }
  
  &:active {
    transform: translateY(0);
  }
  
  ${props => props.disabled && `
    cursor: not-allowed;
    opacity: 0.6;
    
    &:hover {
      transform: none;
      box-shadow: none;
    }
  `}
  
  /* SỬA LỖI Ở ĐÂY - XÓA DÒNG color: transparent */
  /* XÓA HOÀN TOÀN DÒNG NÀY: color: ${(props) => props.disabled ? '#fff' : 'transparent'}; */
`;
export const FeaturesSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  padding: 60px 20px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 40px 16px;
  }
`;

export const FeatureCard = styled.div`
  background: white;
  padding: 32px 24px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    
    .feature-icon {
      transform: scale(1.1);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      
      svg {
        color: white;
      }
    }
  }
  
  .feature-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    svg {
      font-size: 32px;
      color: white;
      transition: all 0.3s ease;
    }
  }
  
  .feature-content {
    h3 {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin-bottom: 12px;
    }
    
    p {
      font-size: 14px;
      color: #666;
      line-height: 1.6;
      margin: 0;
    }
  }
`;

export const BannerSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 40px 0;
  padding: 60px 20px;
  border-radius: 20px;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: rotate 20s linear infinite;
  }
  
  .banner-content {
    position: relative;
    z-index: 2;
    
    h2 {
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 16px;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }
    
    p {
      font-size: 18px;
      opacity: 0.9;
      margin-bottom: 8px;
    }
  }
  
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  @media (max-width: 768px) {
    padding: 40px 16px;
    
    .banner-content {
      h2 {
        font-size: 28px;
      }
      
      p {
        font-size: 16px;
      }
    }
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;