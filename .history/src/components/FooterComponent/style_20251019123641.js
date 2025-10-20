import styled from 'styled-components';

export const WrapperFooter = styled.footer`
  background-color: #0b74e5;
  color: white;
  margin-top: 60px;
  padding-top: 40px;
  font-size: 15px;
`;

export const FooterTop = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 1200px;
  max-width: 95%;
  margin: 0 auto;
  gap: 30px;
`;

export const FooterColumn = styled.div`
  flex: 1;
  min-width: 250px;
  p {
    margin: 6px 0;
    line-height: 1.6;
  }
`;

export const FooterTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const FooterLink = styled.p`
  color: #f1f1f1;
  margin: 6px 0;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    color: #ffd700;
  }
`;

export const FooterBottom = styled.div`
  border-top: 1px solid rgba(255,255,255,0.2);
  text-align: center;
  padding: 15px 0;
  margin-top: 20px;
  font-size: 14px;
  color: #e0e0e0;
`;
