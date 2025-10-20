import styled from "styled-components";

export const FooterContainer = styled.footer`
  background-color: #f8f8f8;
  padding: 40px 0 20px;
  color: #333;
  font-size: 14px;
`;

export const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const FooterColumn = styled.div`
  flex: 1;
  min-width: 250px;
  margin-bottom: 20px;
`;

export const FooterTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
`;

export const FooterLink = styled.a`
  display: block;
  color: #555;
  text-decoration: none;
  margin-bottom: 8px;
  transition: color 0.3s;

  &:hover {
    color: #1890ff;
  }
`;

export const FooterText = styled.p`
  margin: 0 0 8px;
`;

export const SocialIcons = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 10px;

  a {
    color: #555;
    font-size: 18px;
    transition: color 0.3s;
  }

  a:hover {
    color: #1890ff;
  }
`;

export const FooterBottom = styled.div`
  text-align: center;
  border-top: 1px solid #ddd;
  padding-top: 15px;
  margin-top: 20px;
  color: #888;
  font-size: 13px;
`;
