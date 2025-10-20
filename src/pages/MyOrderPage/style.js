import styled from "styled-components";

export const WrapperContainer = styled.div`
  background: #f5f5fa;
  min-height: 100vh;
  padding: 24px 40px;
`;

export const WrapperListOrder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const WrapperItemOrder = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  padding: 16px;
`;

export const WrapperStatus = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 10px;
  color: rgb(56, 56, 61);
  div {
    margin-bottom: 2px;
  }
`;

export const WrapperHeaderItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-top: 1px solid #f0f0f0;
`;

export const WrapperFooterItem = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #f0f0f0;
  padding-top: 10px;
`;
