// style.js
import styled from 'styled-components'

export const PageContainer = styled.div`
  background: #f5f5fa;
  min-height: 100vh;
  padding: 20px 0;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
`

export const OrderHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 24px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);

  .header-content {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .header-icon {
    font-size: 36px;
    opacity: 0.9;
  }

  .header-text {
    h1 {
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 8px 0;
    }

    .order-id {
      font-size: 16px;
      opacity: 0.9;
    }
  }
`

export const InfoSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`

export const InfoCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 2px solid #f8f9fa;

    .card-icon {
      font-size: 20px;
      color: #1890ff;
    }

    h3 {
      font-size: 18px;
      font-weight: 600;
      color: #262626;
      margin: 0;
    }
  }

  .card-content {
    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #f8f9fa;

      &:last-child {
        border-bottom: none;
      }

      strong {
        color: #666;
        font-weight: 500;
      }

      span {
        color: #262626;
        font-weight: 500;
        text-align: right;

        &.price {
          color: #ff4d4f;
          font-weight: 600;
        }

        &.free {
          color: #52c41a;
          font-weight: 600;
        }
      }
    }
  }
`

export const ProductSection = styled.div`
  margin-bottom: 24px;
`

export const ProductCard = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  overflow: hidden;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    background: #fafafa;
    border-bottom: 1px solid #f0f0f0;

    h3 {
      font-size: 18px;
      font-weight: 600;
      color: #262626;
      margin: 0;
    }

    .product-count {
      color: #666;
      font-size: 14px;
      font-weight: 500;
    }
  }

  .products-list {
    max-height: 500px;
    overflow-y: auto;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
    }
  }
`

export const ProductItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f8f9fa;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #fafafa;
  }

  &:last-child {
    border-bottom: none;
  }

  .product-info {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
  }

  .product-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #f0f0f0;
  }

  .product-details {
    flex: 1;

    .product-name {
      font-size: 16px;
      font-weight: 500;
      color: #262626;
      margin-bottom: 8px;
      line-height: 1.4;
    }

    .product-meta {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .quantity {
      font-size: 14px;
      color: #666;
      font-weight: 500;
    }
  }

  .price-info {
    text-align: right;
    min-width: 150px;

    .original-price {
      font-size: 14px;
      color: #999;
      text-decoration: line-through;
      margin-bottom: 4px;
    }

    .current-price {
      font-size: 15px;
      color: #666;
      margin-bottom: 6px;
    }

    .total-price {
      font-size: 16px;
      font-weight: 600;
      color: #ff4d4f;
    }
  }
`

export const PriceSection = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const PriceCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  width: 350px;

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #262626;
    margin: 0 0 20px 0;
    padding-bottom: 16px;
    border-bottom: 2px solid #f8f9fa;
  }

  .price-details {
    .total {
      font-size: 18px;
      
      .total-amount {
        font-size: 24px;
        color: #ff4d4f;
      }
    }
  }
`

export const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f8f9fa;

  &:last-child {
    border-bottom: none;
  }

  span {
    font-size: 15px;
    color: #666;

    &:last-child {
      font-weight: 500;
      color: #262626;
    }

    &.price {
      color: #ff4d4f;
      font-weight: 600;
    }

    &.free {
      color: #52c41a;
      font-weight: 600;
    }
  }

  &.total {
    span {
      font-size: 16px;
      font-weight: 600;
      color: #262626;

      &:last-child {
        font-size: 20px;
        color: #ff4d4f;
      }
    }
  }
`

export const StatusBadge = styled.span`
  background: ${props => props.type === 'discount' ? '#fff2f0' : '#f6ffed'};
  color: ${props => props.type === 'discount' ? '#ff4d4f' : '#52c41a'};
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid ${props => props.type === 'discount' ? '#ffccc7' : '#b7eb8f'};
`