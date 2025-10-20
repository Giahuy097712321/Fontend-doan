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
  padding: 12px 18px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease-in-out;

  span {
    color: #222;
    font-weight: 500;
    font-size: 14px;
  }
`;

export const WrapperStyleHeaderDilivery = styled.div`
  background: #fff;
  padding: 12px 18px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  }
`;

/* LEFT SIDE */
export const WrapperLeft = styled.div`
  width: 900px;
`;

/* Danh sách sản phẩm */
export const WrapperListOrder = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const WrapperItemOrder = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 18px;
  background: ${(props) => (props.checked ? "#fff7f7" : "#fff")};
  border-radius: 10px;
  transition: all 0.2s ease;
  box-shadow: ${(props) =>
    props.checked
      ? "0 0 0 2px rgba(255, 77, 79, 0.5)"
      : "0 1px 4px rgba(0, 0, 0, 0.05)"};

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  img {
    border-radius: 8px;
    transition: 0.3s;
  }

  img:hover {
    transform: scale(1.05);
  }
`;

/* Bộ đếm số lượng */
export const WrapperCountOrder = styled.div`
  display: flex;
  align-items: center;
  width: 90px;
  border: 1px solid #ddd;
  border-radius: 6px;
  justify-content: space-between;
  padding: 2px 4px;
  background: #fafafa;
  transition: all 0.2s ease;

  &:hover {
    border-color: #ff4d4f;
    box-shadow: 0 0 4px rgba(255, 77, 79, 0.3);
  }

  button {
    background: transparent;
    border: none;
    cursor: pointer;
    color: #555;
    font-size: 14px;
    transition: 0.2s;

    &:hover {
      color: #ff4d4f;
      transform: scale(1.2);
    }

    &:active {
      transform: scale(0.9);
    }
  }
`;

export const WrapperInputNumber = styled.input`
  width: 30px;
  text-align: center;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;
`;

/* RIGHT SIDE */
export const WrapperRight = styled.div`
  width: 330px;
  margin-left: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const WrapperInfo = styled.div`
  padding: 18px 20px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  width: 100%;
  transition: 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  strong {
    color: #333;
  }
`;

export const WrapperTotal = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 18px 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  span:first-child {
    font-weight: 600;
    font-size: 16px;
    color: #333;
  }
`;

export const WrapperPriceDiscount = styled.span`
  color: #999;
  font-size: 12px;
  text-decoration: line-through;
  margin-left: 4px;
`;

/* Nút hành động */
export const ActionButton = styled.button`
  background: #ff4d4f;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  border: none;
  border-radius: 6px;
  padding: 12px 20px;
  width: 100%;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: #ff6b6f;
    box-shadow: 0 4px 10px rgba(255, 77, 79, 0.3);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: none;
  }
`;
