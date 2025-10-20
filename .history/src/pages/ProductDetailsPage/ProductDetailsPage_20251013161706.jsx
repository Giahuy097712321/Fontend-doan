import React from 'react'
import ProductDetailsComponent from './../../components/ProductDetailsComponent/ProductDetailsComponent';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ width: '100%', background: '#efefef' }}>
      <div style={{ padding: '0 120px', background: '#efefef', minHeight: '1000px' }}>
        <h5
          style={{
            fontSize: '22px',
            marginBottom: '20px',
            fontWeight: '600',
            color: '#333',
          }}
        >
          <span
            style={{ cursor: 'pointer', fontWeight: 'bold', color: '#007bff' }}
            onClick={() => navigate('/')}
          >
            Trang chủ
          </span>{' '}
          - Chi tiết sản phẩm
        </h5>

        <ProductDetailsComponent idProduct={id} />
      </div>
    </div>
  );
};

export default ProductDetailsPage;
