import styled from "styled-components";
import ButtonComponent from './../../components/ButtonComponent/ButtonComponent';

// Các component cơ bản
export const HomeContainer = styled.div`
  max-width: 1270px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
  overflow-x: hidden; /* Ngăn chặn tràn ngang */
`

export const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 32px;
`

export const SectionTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
`

export const SectionSubtitle = styled.p`
  font-size: 16px;
  color: #666;
  margin: 0;
  font-weight: 400;
`

// Quick Actions
export const QuickActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 30px 0;
  flex-wrap: wrap;
  max-width: 100%;
`

export const QuickActionButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 20px;
  border: none;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e8ecef;
  min-width: 80px;
  flex-shrink: 0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.color};
  }

  .action-icon {
    font-size: 24px;
    color: ${props => props.color};
    margin-bottom: 8px;
  }

  span {
    font-size: 12px;
    font-weight: 600;
    color: #333;
  }
`

// Features Section
export const FeaturesSection = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: 40px 0;
  padding: 0 10px;
  width: 100%;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`

export const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  padding: 24px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e8ecef;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border-color: #2c5aa0;
  }

  .feature-icon {
    font-size: 32px;
    color: #2c5aa0;
    margin-right: 16px;
    flex-shrink: 0;
  }

  .feature-content {
    flex: 1;
    min-width: 0;

    h3 {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 4px;
      word-wrap: break-word;
    }

    p {
      font-size: 14px;
      color: #666;
      margin: 0;
      line-height: 1.4;
      word-wrap: break-word;
    }
  }
`

// Hot Deal Section
export const HotDealSection = styled.div`
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  border-radius: 16px;
  padding: 30px;
  margin: 40px 0;
  color: white;
  width: 100%;
  box-sizing: border-box;

  .deal-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 24px;
    flex-wrap: wrap;

    h2 {
      font-size: 24px;
      font-weight: 700;
      margin: 0;
    }

    .fire-icon {
      font-size: 28px;
      color: #ffd700;
    }
  }
`

export const CountdownTimer = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
`

// Slider Section
export const WrapperSliderSection = styled.div`
  margin: 30px 0 40px 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  width: 100%;
`

// Type Product Section
export const WrapperTypeProductSection = styled.div`
  background: white;
  border-radius: 16px;
  margin: 40px 0;
  padding: 40px 30px;
  border: 1px solid #e8ecef;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  width: 100%;
  box-sizing: border-box;
`

export const WrapperTypeProductTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #0b74e5;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

export const WapperTypeProduct = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 100%;
`

// Product Section
export const ProductSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px 30px;
  border: 1px solid #e8ecef;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  margin: 40px 0;
  width: 100%;
  box-sizing: border-box;
`

export const WrapperProducts = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  width: 100%;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  @media (max-width: 360px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`

// Tabs và Filter
export const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
  border-bottom: 1px solid #e8ecef;
  padding-bottom: 0;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
`

export const TabButton = styled.button`
  padding: 12px 16px;
  border: none;
  background: ${props => props.active ? '#2c5aa0' : 'transparent'};
  color: ${props => props.active ? 'white' : '#666'};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px 8px 0 0;
  transition: all 0.3s ease;
  border-bottom: 3px solid ${props => props.active ? '#2c5aa0' : 'transparent'};
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.active ? '#2c5aa0' : '#f8f9fa'};
    color: ${props => props.active ? 'white' : '#2c5aa0'};
  }

  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    padding: 8px 10px;
    font-size: 12px;
  }
`

export const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;

  .filter-controls {
    display: flex;
    gap: 16px;
    align-items: center;
    flex-wrap: wrap;
  }
`

export const SortSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #e8ecef;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  cursor: pointer;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: #2c5aa0;
  }
`

// Banner Section
export const BannerSection = styled.div`
  background: linear-gradient(135deg, #2c5aa0 0%, #3a6bb0 100%);
  border-radius: 16px;
  padding: 60px 40px;
  margin: 40px 0;
  text-align: center;
  color: white;
  width: 100%;
  box-sizing: border-box;

  .banner-content {
    h2 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 12px;
      letter-spacing: -0.5px;
    }

    p {
      font-size: 18px;
      margin-bottom: 24px;
      opacity: 0.9;
    }

    .banner-button {
      background: white;
      color: #2c5aa0;
      border: none;
      padding: 12px 32px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(255, 255, 255, 0.2);
      }
    }
  }

  @media (max-width: 768px) {
    padding: 40px 20px;
    
    .banner-content {
      h2 {
        font-size: 24px;
      }

      p {
        font-size: 16px;
      }
    }
  }
`

// Button More
export const WrapperButtonMore = styled(ButtonComponent)`
  &:hover {
    color: #fff !important;
    background: #2c5aa0 !important;
    border-color: #2c5aa0 !important;
    transform: translateY(-1px);
    
    span {
      color: #fff !important;
    }
  }
  
  transition: all 0.3s ease;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`