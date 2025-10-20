import styled from 'styled-components'

export const WrapperContainer = styled.div`
  background: linear-gradient(180deg, #f9f9ff 0%, #f0f0fa 100%);
  min-height: 100vh;
  padding: 60px 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`

export const WrapperSuccessBox = styled.div`
  background: #fff;
  padding: 40px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  width: 700px;
  transition: all 0.3s ease;

  h2 {
    color: #52c41a;
    font-size: 26px;
    margin: 12px 0 4px;
  }

  p {
    font-size: 15px;
    color: #555;
    margin-bottom: 24px;
  }
`

export const WrapperSection = styled.div`
  background: #fafaff;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  padding: 18px 22px;
  text-align: left;
  margin-bottom: 16px;
`

export const WrapperTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
`

export const WrapperValue = styled.div`
  font-size: 15px;
  background: #fff;
  padding: 10px 16px;
  border-radius: 8px;
  color: #444;
  border: 1px solid #e0e0ff;
`

export const WrapperOrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const WrapperItemOrder = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #f0f0f5;

  .item-left {
    display: flex;
    align-items: center;
    gap: 12px;

    img {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      object-fit: cover;
      border: 1px solid #eee;
    }

    .item-name {
      font-size: 15px;
      color: #333;
      max-width: 250px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .item-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-size: 14px;
    color: #555;
    gap: 3px;
  }
`
