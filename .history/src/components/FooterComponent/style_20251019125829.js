import styled from 'styled-components';

export const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: #fff;
  margin-top: 40px;
`;

export const FooterTop = styled.div`
  padding: 40px 0 20px 0;
  max-width: 1270px;
  margin: 0 auto;
`;

export const FooterBottom = styled.div`
  padding: 20px 0;
  background: rgba(0, 0, 0, 0.3);
  max-width: 1270px;
  margin: 0 auto;
`;

export const FooterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
`;

export const FooterColumn = styled.div`
  flex: 1;
  min-width: 200px;
  padding: 0 15px;
`;

export const FooterSection = styled.div`
  text-align: center;
`;

export const FooterTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #fff;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 40px;
    height: 2px;
    background: #d70018;
  }
`;

export const FooterLink = styled.a`
  display: block;
  color: #bdc3c7;
  text-decoration: none;
  margin-bottom: 8px;
  transition: all 0.3s ease;
  font-size: 14px;
  
  &:hover {
    color: #d70018;
    transform: translateX(5px);
  }
`;

export const FooterText = styled.p`
  color: #bdc3c7;
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 1.5;
`;

export const FooterDivider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, #d70018 50%, transparent 100%);
  margin: 10px 0;
`;

export const SocialIcons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

export const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: ${props => props.color || '#333'};
  border-radius: 50%;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 16px;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  }
`;

export const PaymentMethods = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
`;

export const PaymentIcon = styled.div`
  width: 40px;
  height: 30px;
  background: #fff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  border: 1px solid #ddd;
`;