import styled from 'styled-components';

export const WrapperContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;

  .forgot-password-box {
    display: flex;
    width: 900px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    min-height: 600px;
  }
`;

export const WrapperContainerLeft = styled.div`
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .form-section {
    max-width: 400px;
    margin: 0 auto;
    width: 100%;

    h1 {
      font-size: 28px;
      font-weight: 700;
      color: #333;
      margin-bottom: 8px;
      text-align: center;
    }

    p {
      color: #666;
      text-align: center;
      margin-bottom: 30px;
    }

    .step-content {
      margin-top: 20px;
    }

    .input-group {
      margin-bottom: 15px;
    }

    .password-toggle {
      color: #666;
      transition: color 0.3s ease;

      &:hover {
        color: #1890ff;
      }
    }

    .auth-links {
      text-align: center;
      margin-top: 25px;

      p {
        margin: 8px 0;
        color: #666;
      }
    }
  }
`;

export const WrapperContainerRight = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;

  .welcome-content {
    max-width: 350px;

    h2 {
      font-size: 32px;
      font-weight: 700;
      margin: 20px 0 10px;
    }

    p {
      font-size: 16px;
      opacity: 0.9;
      margin-bottom: 30px;
    }

    .security-list {
      text-align: left;
      margin-top: 30px;

      .security-item {
        padding: 8px 0;
        font-size: 14px;
        opacity: 0.9;
      }
    }
  }
`;

export const WrapperTextLight = styled.span`
  color: #1890ff;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #40a9ff;
    text-decoration: underline;
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

export const BrandName = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 10px 0 5px;
`;

export const Tagline = styled.p`
  color: #666;
  font-size: 14px;
  margin: 0;
`;