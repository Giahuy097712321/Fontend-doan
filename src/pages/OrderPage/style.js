import styled from "styled-components";

/* Container tổng */
export const WrapperContainer = styled.div`
  background: #f5f5fa;
  width: 100%;
  min-height: 100vh;
  font-family: "Roboto", sans-serif;
`;

/* Header */
export const WrapperStyleHeader = styled.div`
  background: #fff;
  padding: 16px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 16px;

  span {
    color: #222;
    font-weight: 500;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
    
    /* Ẩn các cột trên mobile, chỉ hiển thị checkbox và tổng sản phẩm */
    & > div:last-child {
      display: none;
    }
  }
`;

export const WrapperStyleHeaderDilivery = styled.div`
  background: #fff;
  padding: 16px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    padding: 12px 16px;
    margin-bottom: 16px;
  }
`;

/* LEFT SIDE */
export const WrapperLeft = styled.div`
  flex: 1;
  min-width: 0; /* Quan trọng cho flex item */

  @media (max-width: 768px) {
    width: 100%;
  }
`;

/* Danh sách sản phẩm */
export const WrapperListOrder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

export const WrapperItemOrder = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  background: ${(props) => (props.checked ? "#f0f9ff" : "#fff")};
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: ${(props) => props.checked ? "2px solid #1890ff" : "2px solid transparent"};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    display: none; /* Ẩn trên mobile, sử dụng MobileProductCard thay thế */
  }
`;

/* Bộ đếm số lượng */
export const WrapperCountOrder = styled.div`
  display: flex;
  align-items: center;
  width: 100px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  justify-content: space-between;
  padding: 4px 8px;
  background: #fff;
  transition: all 0.3s ease;

  &:hover {
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
  }

  button {
    background: transparent;
    border: none;
    cursor: pointer;
    color: #666;
    font-size: 12px;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s ease;

    &:hover {
      background: #f5f5f5;
      color: #1890ff;
    }

    &:active {
      transform: scale(0.9);
    }
  }

  @media (max-width: 768px) {
    width: 90px;
  }
`;

export const WrapperInputNumber = styled.input`
  width: 40px;
  text-align: center;
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 500;
  background: transparent;

  @media (max-width: 768px) {
    width: 30px;
  }
`;

/* RIGHT SIDE */
export const WrapperRight = styled.div`
  width: 380px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    width: 100%;
    margin-top: 20px;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    width: 320px;
  }
`;

export const WrapperInfo = styled.div`
  padding: 20px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  width: 100%;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

/* Components cho mobile */
export const MobileProductCard = styled.div`
  background: ${(props) => (props.checked ? "#f0f9ff" : "#fff")};
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 12px;
  border: ${(props) => props.checked ? "2px solid #1890ff" : "2px solid transparent"};
  transition: all 0.3s ease;

  @media (min-width: 769px) {
    display: none; /* Ẩn trên desktop */
  }
`;

export const MobileProductInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

/* Tóm tắt đơn hàng */
export const OrderSummary = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .summary-header {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 16px;
    color: #333;
  }

  .summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 16px;

    span:first-child {
      font-weight: 500;
    }

    span:last-child {
      font-weight: 600;
    }
  }

  .discount {
    color: #52c41a !important;
  }

  .divider {
    height: 2px;
    background: #f0f0f0;
    margin: 16px 0;
  }

  .total {
    display: flex;
    justify-content: space-between;
    align-items: center;

    span:first-child {
      font-size: 20px;
      font-weight: 700;
      color: #333;
    }

    .total-price {
      color: #ff4d4f;
      font-size: 24px;
      font-weight: bold;
    }
  }

  @media (max-width: 768px) {
    padding: 16px;
    
    .summary-header {
      font-size: 16px;
    }

    .summary-item {
      font-size: 15px;
    }

    .total {
      span:first-child {
        font-size: 18px;
      }

      .total-price {
        font-size: 20px;
      }
    }
  }
`;

/* Nút hành động */
export const ActionButton = styled.button`
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  width: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(24, 144, 255, 0.4);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
  }

  @media (max-width: 768px) {
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 0;
    padding: 20px;
    font-size: 18px;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
    z-index: 100;
  }
`;