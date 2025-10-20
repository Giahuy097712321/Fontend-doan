import React from 'react'
import ProductDetailsComponent from './../../components/ProductDetailsComponent/ProductDetailsComponent';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{
      width: '100%',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ed 100%)',
      minHeight: '100vh',
      padding: '20px 0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {/* Breadcrumb */}
        <div style={{
          marginBottom: '24px',
          padding: '12px 0'
        }}>
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: '#666'
          }}>
            <span
              style={{
                cursor: 'pointer',
                fontWeight: '500',
                color: '#d70018',
                transition: 'color 0.3s ease'
              }}
              onClick={() => navigate('/')}
              onMouseEnter={(e) => e.target.style.color = '#ff4757'}
              onMouseLeave={(e) => e.target.style.color = '#d70018'}
            >
              🏠 Trang chủ
            </span>

            <span style={{ color: '#ccc' }}>›</span>
            <span style={{
              fontWeight: '600',
              color: '#333'
            }}>
              🔍 Chi tiết sản phẩm
            </span>
          </nav>
        </div>

        {/* Product Details */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden'
        }}>
          <ProductDetailsComponent idProduct={id} />
        </div>

        {/* Additional Info Section */}
        <div style={{
          marginTop: '24px',
          background: '#fff',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: '2px solid #f0f0f0'
          }}>
            📋 Thông tin bổ sung
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            fontSize: '14px',
            color: '#666'
          }}>
            <div>
              <strong>🚚 Giao hàng:</strong> Miễn phí toàn quốc
            </div>
            <div>
              <strong>🛠️ Bảo hành:</strong> 12 tháng chính hãng
            </div>
            <div>
              <strong>🔄 Đổi trả:</strong> Trong 30 ngày
            </div>
            <div>
              <strong>💳 Thanh toán:</strong> Trả góp 0%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;