import styled from "styled-components";

export const WrapperContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;

  .login-box {
    width: 900px;
    height: 550px;
    border-radius: 16px;
    background: #fff;
    display: flex;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
`

export const WrapperContainerLeft = styled.div`
  flex: 1;
  padding: 50px 45px 30px;
  display: flex;
  flex-direction: column;
  
  .form-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    h1 {
      font-size: 28px;
      font-weight: 700;
      color: #333;
      margin-bottom: 8px;
    }
    
    p {
      color: #666;
      margin-bottom: 30px;
      font-size: 14px;
    }
  }
  
  .input-group {
    margin-bottom: 20px;
    
    .error-text {
      color: #ff4757;
      font-size: 12px;
      margin-top: 4px;
      display: block;
    }
  }
  
  .password-toggle {
    z-index: 10;
    position: absolute;
    top: 12px;
    right: 12px;
    color: #666;
    cursor: pointer;
    transition: color 0.2s;
    
    &:hover {
      color: #333;
    }
  }
  
  .error-message {
    background: #ffe6e6;
    color: #ff4757;
    padding: 12px;
    border-radius: 6px;
    font-size: 14px;
    margin: 10px 0;
    border: 1px solid #ffcccc;
  }
  
  .signup-section {
    text-align: center;
    margin-top: 10px;
    
    p {
      color: #666;
      font-size: 14px;
      margin: 0;
    }
  }
`

export const WrapperContainerRight = styled.div`
  width: 350px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 40px 30px;
  color: white;
  
  .welcome-content {
    text-align: center;
    
    h2 {
      font-size: 24px;
      font-weight: 700;
      margin: 20px 0 10px;
    }
    
    p {
      font-size: 16px;
      opacity: 0.9;
      margin-bottom: 30px;
    }
  }
  
  .feature-list {
    text-align: left;
    margin-top: 20px;
    
    .feature-item {
      padding: 8px 0;
      font-size: 14px;
      opacity: 0.9;
    }
  }
`

export const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 30px;
  
  .ant-image {
    display: block;
    margin: 0 auto 10px;
  }
`

export const BrandName = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

export const Tagline = styled.p`
  color: #666;
  font-size: 12px;
  margin: 4px 0 0 0;
  font-weight: 500;
`

export const WrapperTextLight = styled.span`
  color: #667eea;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    color: #764ba2;
    text-decoration: underline;
  }
`