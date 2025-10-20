import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { converPrice } from '../../utils'
import {
  WrapperContainer,
  WrapperSuccessBox,
  WrapperSection,
  WrapperTitle,
  WrapperValue,
  WrapperOrderList,
  WrapperItemOrder
} from './style'

const OrderSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { state } = location || {}

  // Nếu không có dữ liệu đơn hàng → quay lại trang chủ
  useEffect(() => {
    if (!state?.orders || state?.orders?.length === 0) {
      navigate('/')
    }
  }, [state, navigate])

  // Xử lý hiển thị nhãn giao hàng & thanh toán
  const deliveryLabel =
    state?.delivery === 'FAST'
      ? 'Giao hàng tiết kiệm (FAST)'
      : state?.delivery === 'GO_JEK'
        ? 'Giao hàng GO_JEK'
        : state?.delivery || 'Không xác định'

  const paymentLabel =
    state?.payment === 'Thanh toán tiền mặt khi nhận hàng'
      ? 'Thanh toán tiền mặt khi nhận hàng'
      : state?.payment || 'Không xác định'

  // 🧮 Tính tổng giá, giảm giá và tiền cuối cùng
  const totalPrice = state?.totalPriceMemo || 0
  const discountPercent = state?.discountPercent || 0
  const discountAmount = (totalPrice * discountPercent) / 100
  const finalPrice = totalPrice - discountAmount

  return (
    <WrapperContainer>
      <WrapperSuccessBox>
        <CheckCircleOutlined style={{ fontSize: '60px', color: '#52c41a' }} />
        <h2>Đặt hàng thành công!</h2>
        <p>Cảm ơn bạn đã mua hàng 💙</p>

        {/* Phương thức giao hàng */}
        <WrapperSection>
          <WrapperTitle>📦 Phương thức giao hàng</WrapperTitle>
          <WrapperValue>{deliveryLabel}</WrapperValue>
        </WrapperSection>

        {/* Phương thức thanh toán */}
        <WrapperSection>
          <WrapperTitle>💳 Phương thức thanh toán</WrapperTitle>
          <WrapperValue>{paymentLabel}</WrapperValue>
        </WrapperSection>

        {/* Danh sách sản phẩm */}
        <WrapperSection>
          <WrapperTitle>🧾 Danh sách sản phẩm</WrapperTitle>
          <WrapperOrderList>
            {state?.orders?.map((item, index) => (
              <WrapperItemOrder key={index}>
                <div className="item-left">
                  <img src={item?.image} alt={item?.name} />
                  <span className="item-name">{item?.name}</span>
                </div>
                <div className="item-right">
                  <span>Giá: {converPrice(item?.price)}</span>
                  {item?.discount > 0 && (
                    <span style={{ color: 'green' }}>
                      Giảm: {item.discount}%
                    </span>
                  )}
                  <span>Số lượng: {item?.amount}</span>
                  <span style={{ color: 'red', fontWeight: 600 }}>
                    Thành tiền: {converPrice(item?.price * item?.amount * (1 - (item?.discount || 0) / 100))}
                  </span>
                </div>
              </WrapperItemOrder>
            ))}
          </WrapperOrderList>
        </WrapperSection>

        {/* Tổng tiền + Giảm giá + Thành tiền */}
        <WrapperSection>
          <WrapperTitle>💰 Tổng cộng</WrapperTitle>
          <WrapperValue>
            <div>Tổng tiền hàng: {converPrice(totalPrice)}</div>
            {discountPercent > 0 && (
              <div>Giảm giá ({discountPercent}%): -{converPrice(discountAmount)}</div>
            )}
            <div style={{ color: 'red', fontWeight: 600 }}>
              Thành tiền: {converPrice(finalPrice)}
            </div>
          </WrapperValue>
        </WrapperSection>

        {/* Nút quay về trang chủ */}
        <Button
          type="primary"
          style={{
            marginTop: '24px',
            background: '#1677ff',
            padding: '8px 24px',
            borderRadius: '6px',
          }}
          onClick={() => navigate('/')}
        >
          Quay lại Trang chủ
        </Button>
      </WrapperSuccessBox>
    </WrapperContainer>
  )
}

export default OrderSuccess
