import styled from 'styled-components';

export const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: #fff;
  margin-top: 40px;
  padding: 30px 0 20px 0;
`;

export const FooterTop = styled.div`
  padding: 0 20px 20px 20px;
  max-width: 1270px;
  margin: 0 auto;
`;

export const FooterBottom = styled.div`
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  max-width: 1270px;
  margin: 0 auto;
`;

export const FooterSection = styled.div`
  text-align: center;
`;

export const FooterTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #fff;
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
  margin: 20px 0;
`;

export const SocialIcons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 10px;
`;

export const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${props => props.color || '#333'};
  border-radius: 50%;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 18px;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  }
`;