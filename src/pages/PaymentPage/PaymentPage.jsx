import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, message, Grid, Modal, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { removeAllOrderProduct } from '../../redux/sildes/orderSlide';
import { updateUser } from '../../redux/sildes/userSlide';
import * as OrderService from '../../services/OrderService';
import * as UserService from '../../services/UserService';
import * as PaymentService from '../../services/PaymentService';
import { useMutationHooks } from '../../hooks/useMutationHook';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import Loading from '../../components/LoadingComponent/Loading';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import { converPrice } from '../../utils';
import {
  PaymentContainer,
  PaymentWrapper,
  PaymentHeader,
  PaymentContent,
  PaymentLeft,
  PaymentRight,
  PaymentSection,
  PaymentInfoCard,
  OrderSummary,
  ProductList,
  ProductItem,
  DeliveryOption,
  PaymentOption
} from './style';

// Stripe
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeCheckoutComponent from '../../components/StripeCheckoutComponent/StripeCheckoutComponent';

const { useBreakpoint } = Grid;
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentPage = () => {
  const order = useSelector(state => state?.order);
  const user = useSelector(state => state?.user);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();

  // Lấy thông tin từ location.state (được truyền từ OrderPage)
  const passedOrders = location?.state?.orders || [];
  const orderItems = passedOrders.length ? passedOrders : order.orderItemsSelected;
  const selectedAddress = location?.state?.address || null; // Địa chỉ đã chọn từ OrderPage

  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('COD'); // Mặc định là COD
  const [delivery, setDelivery] = useState('FAST');
  const [clientSecret, setClientSecret] = useState(null);
  const [isStripeReady, setIsStripeReady] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [hasOrdered, setHasOrdered] = useState(false);
  const [isValidOrder, setIsValidOrder] = useState(true);
  const [stripeKey, setStripeKey] = useState(0);

  const mutationUpdate = useMutationHooks(async ({ id, token, ...userData }) =>
    UserService.updateUser(id, userData, token)
  );

  const mutationAddOrder = useMutationHooks((data) => {
    const { token, ...rest } = data;
    return OrderService.createOrder(rest, token);
  });

  const { isLoading } = mutationUpdate;
  const {
    isLoading: isLoadingAddOrder,
    isSuccess,
    isError,
    data: newOrder
  } = mutationAddOrder;

  // Reset Stripe khi chuyển sang COD
  const resetStripeAndState = useCallback(() => {
    setClientSecret(null);
    setIsStripeReady(false);
    setIsPlacingOrder(false);
    setStripeKey(prev => prev + 1);
  }, []);

  // Tự động reset khi chuyển phương thức thanh toán
  useEffect(() => {
    if (paymentMethod !== 'Stripe') {
      resetStripeAndState();
    }
  }, [paymentMethod, resetStripeAndState]);

  // Kiểm tra tính hợp lệ của đơn hàng
  useEffect(() => {
    const checkOrderValidity = () => {
      if (!orderItems?.length) {
        message.error('Không có sản phẩm nào để thanh toán!');
        setIsValidOrder(false);
        setTimeout(() => navigate('/order', { replace: true }), 1500);
        return false;
      }

      // Kiểm tra địa chỉ đã chọn
      if (!selectedAddress || !selectedAddress.name || !selectedAddress.address || !selectedAddress.phone || !selectedAddress.city) {
        message.warning('Vui lòng quay lại giỏ hàng và chọn địa chỉ giao hàng!');
        setIsValidOrder(false);
        setTimeout(() => navigate('/order', { replace: true }), 2000);
        return false;
      }

      if (hasOrdered) {
        message.warning('Đơn hàng đã được xử lý!');
        setIsValidOrder(false);
        setTimeout(() => navigate('/order', { replace: true }), 1500);
        return false;
      }

      setIsValidOrder(true);
      return true;
    };

    checkOrderValidity();
  }, [orderItems, selectedAddress, hasOrdered, navigate]);

  // Tính toán giá
  const priceMemo = useMemo(() => {
    if (!isValidOrder || !orderItems?.length) return 0;
    return orderItems.reduce((total, cur) => total + cur.price * cur.amount, 0);
  }, [orderItems, isValidOrder]);

  const priceDiscountMemo = useMemo(() => {
    if (!isValidOrder || !orderItems?.length) return 0;
    return orderItems.reduce((total, cur) =>
      total + (cur.price * cur.amount * (cur.discount || 0)) / 100, 0
    );
  }, [orderItems, isValidOrder]);

  const deliveryPriceMemo = useMemo(() => {
    if (!isValidOrder || !orderItems.length) return 0;
    if (priceMemo >= 200000 && priceMemo < 500000) return 10000;
    if (priceMemo >= 500000) return 0;
    return 20000;
  }, [priceMemo, orderItems, isValidOrder]);

  const totalPriceMemo = useMemo(() =>
    priceMemo - priceDiscountMemo + deliveryPriceMemo,
    [priceMemo, priceDiscountMemo, deliveryPriceMemo]
  );

  const totalDiscountPercent = useMemo(() =>
    (priceMemo === 0 ? 0 : Math.round((priceDiscountMemo / priceMemo) * 100)),
    [priceDiscountMemo, priceMemo]
  );

  // Component hiển thị thông tin giao hàng
  const DeliveryAddressComponent = () => {
    if (!selectedAddress) {
      return (
        <PaymentInfoCard>
          <div className="info-header">
            <span className="title">Địa chỉ giao hàng</span>
          </div>
          <div className="info-content">
            <div className="info-item" style={{ color: '#ff4d4f' }}>
              Chưa có địa chỉ giao hàng. Vui lòng quay lại giỏ hàng để chọn địa chỉ.
            </div>
          </div>
        </PaymentInfoCard>
      );
    }

    const isPersonalInfo = selectedAddress?._id === 'personal-info' || selectedAddress?.isPersonalInfo;

    return (
      <PaymentInfoCard>
        <div className="info-header">
          <span className="title">Địa chỉ giao hàng</span>
          <span
            className="change-btn"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/order')}
          >
            Thay đổi
          </span>
        </div>
        <div className="info-content">
          <div className="info-item">
            <strong>{selectedAddress?.name || 'Chưa có'}</strong> | {selectedAddress?.phone || 'Chưa có'}
            {isPersonalInfo && (
              <span style={{
                marginLeft: '8px',
                fontSize: '12px',
                color: '#52c41a',
                backgroundColor: '#f6ffed',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                Thông tin cá nhân
              </span>
            )}
          </div>
          <div className="info-item">
            {selectedAddress?.address && selectedAddress?.city
              ? `${selectedAddress.address}, ${selectedAddress.city}`
              : 'Chưa có địa chỉ'}
          </div>
        </div>
      </PaymentInfoCard>
    );
  };

  // Hàm xử lý order thành công
  const handleOrderSuccess = useCallback((orderData, paymentMethodUsed) => {
    setHasOrdered(true);
    setIsValidOrder(false);
    setIsPlacingOrder(false);

    // Xóa sản phẩm khỏi giỏ hàng
    const arrayOrdered = orderItems.map(item => item.product);
    dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }));

    // Thông báo thành công
    const successMessage = paymentMethodUsed === 'Stripe'
      ? 'Thanh toán thành công!'
      : 'Đặt hàng thành công!';
    message.success(successMessage);

    // Reset Stripe nếu có
    resetStripeAndState();

    // Chuyển hướng đến trang thành công
    navigate('/orderSuccess', {
      state: {
        delivery,
        payment: paymentMethodUsed,
        orders: orderItems,
        totalPriceMemo,
        orderId: orderData._id || createdOrderId,
        address: selectedAddress // Truyền địa chỉ sang trang thành công
      },
      replace: true
    });
  }, [orderItems, dispatch, navigate, delivery, totalPriceMemo, createdOrderId, resetStripeAndState, selectedAddress]);

  // Tạo đơn hàng
  const handleCreateOrder = async (paymentMethodType = paymentMethod) => {
    if (!isValidOrder || hasOrdered || !orderItems?.length) {
      throw new Error('Đơn hàng không hợp lệ hoặc đã được xử lý');
    }

    // Xác định trạng thái thanh toán dựa trên paymentMethod
    const isPaid = paymentMethodType === 'Stripe';

    const payload = {
      orderItems,
      fullName: selectedAddress?.name || user?.name,
      email: user?.email,
      phone: selectedAddress?.phone || user?.phone,
      paymentMethod: paymentMethodType, // 'COD' hoặc 'Stripe'
      itemsPrice: priceMemo,
      shippingPrice: deliveryPriceMemo,
      totalPrice: totalPriceMemo,
      delivery,
      user: user?.id,
      address: selectedAddress?.address || user?.address,
      city: selectedAddress?.city || user?.city,
      country: 'Việt Nam',
      taxPrice: 0,
      discount: totalDiscountPercent || 0,
      isPaid, // Quan trọng: truyền isPaid đúng theo paymentMethod
    };

    console.log('📤 Gửi dữ liệu đơn hàng:', payload);

    return new Promise((resolve, reject) => {
      mutationAddOrder.mutate(
        {
          ...payload,
          token: user?.access_token
        },
        {
          onSuccess: async (res) => {
            console.log('✅ Phản hồi từ backend:', res);
            if (res?.status === 'OK') {
              const orderData = res.data;
              setCreatedOrderId(orderData._id);

              // Nếu là Stripe, cập nhật trạng thái thanh toán
              if (paymentMethodType === 'Stripe') {
                try {
                  await OrderService.payOrder(orderData._id, user?.access_token);
                } catch (payError) {
                  console.error('Lỗi khi cập nhật trạng thái thanh toán:', payError);
                }
              }

              resolve(orderData);
            } else {
              reject(new Error(res?.message || 'Lỗi tạo đơn hàng'));
            }
          },
          onError: (error) => {
            console.error('❌ Lỗi tạo đơn hàng:', error);
            setIsPlacingOrder(false);
            reject(error);
          }
        }
      );
    });
  };

  // Xử lý đặt hàng
  const handlePlaceOrder = async () => {
    if (!isValidOrder) {
      message.error('Đơn hàng không hợp lệ!');
      return;
    }

    if (hasOrdered) {
      message.warning('Đơn hàng đã được xử lý!');
      return;
    }

    // Kiểm tra địa chỉ đã chọn
    if (!selectedAddress) {
      message.warning('Vui lòng quay lại giỏ hàng và chọn địa chỉ giao hàng!');
      navigate('/order');
      return;
    }

    if (!user?.access_token || !orderItems?.length || !user?.id) {
      message.warning('Vui lòng kiểm tra thông tin đơn hàng!');
      return;
    }

    setIsPlacingOrder(true);

    // Xử lý COD
    if (paymentMethod === 'COD') {
      try {
        const orderData = await handleCreateOrder('COD');
        handleOrderSuccess(orderData, 'COD');
      } catch (err) {
        console.error('Lỗi đặt hàng COD:', err);
        message.error('Đặt hàng thất bại: ' + (err.message || 'Lỗi không xác định'));
        setIsPlacingOrder(false);
      }
    }
    // Xử lý Stripe
    else if (paymentMethod === 'Stripe') {
      try {
        // Tạo Payment Intent
        const res = await PaymentService.createPaymentIntent(totalPriceMemo, user?.access_token);

        if (res?.status === 'OK' && res?.clientSecret) {
          setClientSecret(res.clientSecret);
          setIsStripeReady(true);
          // Giữ nguyên trạng thái loading để chờ Stripe form
        } else {
          message.error('Không thể tạo thanh toán Stripe!');
          setIsPlacingOrder(false);
        }
      } catch (err) {
        console.error('Lỗi tạo payment Stripe:', err);
        message.error('Stripe đang gặp sự cố. Vui lòng thử lại hoặc chọn phương thức COD!');
        setIsPlacingOrder(false);
      }
    }
  };

  // Xử lý thành công từ Stripe
  const handleStripeSuccess = async () => {
    if (hasOrdered || !isValidOrder) {
      message.warning('Đơn hàng đã được xử lý!');
      return;
    }

    try {
      setIsPlacingOrder(true);
      const orderData = await handleCreateOrder('Stripe');
      handleOrderSuccess(orderData, 'Stripe');
    } catch (error) {
      console.error('Lỗi xử lý Stripe success:', error);
      message.error('Có lỗi xảy ra khi xử lý đơn hàng!');
      setIsPlacingOrder(false);
    }
  };

  // Xử lý khi hủy Stripe
  const handleStripeCancel = () => {
    resetStripeAndState();
    setIsPlacingOrder(false);
    message.info('Đã hủy thanh toán Stripe');
  };

  // Fallback: Xử lý khi mutation thành công
  useEffect(() => {
    if (isSuccess && newOrder && !hasOrdered && isValidOrder) {
      handleOrderSuccess(newOrder.data, paymentMethod);
    }
  }, [isSuccess, newOrder, hasOrdered, isValidOrder, handleOrderSuccess, paymentMethod]);

  // Xử lý khi chuyển đổi phương thức thanh toán
  const handlePaymentChange = (newPaymentMethod) => {
    // Reset trạng thái Stripe khi chuyển sang COD
    if (newPaymentMethod !== 'Stripe') {
      resetStripeAndState();
    }
    setPaymentMethod(newPaymentMethod);
  };

  if (!isValidOrder) {
    return (
      <PaymentContainer>
        <PaymentWrapper>
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h2 style={{ color: '#ff4d4f', marginBottom: '20px' }}>⚠️ Đơn hàng không hợp lệ</h2>
            <p style={{ color: '#666', marginBottom: '30px' }}>
              {!orderItems?.length
                ? 'Không có sản phẩm nào để thanh toán.'
                : 'Thông tin đơn hàng không đầy đủ hoặc đã được xử lý.'
              }
            </p>
            <ButtonComponent
              onClick={() => navigate('/order', { replace: true })}
              size={40}
              styleButton={{
                background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                height: '48px',
                width: '200px',
                border: 'none',
                borderRadius: '8px'
              }}
              textButton={'Quay lại giỏ hàng'}
              styleTextButton={{ color: '#fff', fontSize: '16px', fontWeight: '600' }}
            />
          </div>
        </PaymentWrapper>
      </PaymentContainer>
    );
  }

  return (
    <PaymentContainer>
      <Loading isLoading={isLoadingAddOrder || isLoading}>
        <PaymentWrapper>
          <PaymentHeader>
            <h2>🧾 Thanh toán đơn hàng</h2>
            <p>Hoàn tất đơn hàng của bạn</p>
          </PaymentHeader>

          <PaymentContent>
            {/* LEFT SIDE */}
            <PaymentLeft>
              {/* Thông tin giao hàng - CHỈ HIỂN THỊ TỪ ORDERPAGE */}
              <PaymentSection>
                <h3>🚚 Thông tin giao hàng</h3>
                <DeliveryAddressComponent />
                <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                  <span style={{ cursor: 'pointer', color: '#1890ff' }} onClick={() => navigate('/order')}>
                    ← Quay lại giỏ hàng để thay đổi địa chỉ
                  </span>
                </div>
              </PaymentSection>

              {/* Phương thức giao hàng */}
              <PaymentSection>
                <h3>📦 Phương thức giao hàng</h3>
                <div className="options-grid">
                  <DeliveryOption
                    selected={delivery === 'FAST'}
                    onClick={() => setDelivery('FAST')}
                  >
                    <div className="option-content">
                      <div className="option-title">FAST Express</div>
                      <div className="option-desc">Giao hàng nhanh trong 2-4 giờ</div>
                    </div>
                  </DeliveryOption>

                  <DeliveryOption
                    selected={delivery === 'GO_JEK'}
                    onClick={() => setDelivery('GO_JEK')}
                  >
                    <div className="option-content">
                      <div className="option-title">GO_JEK</div>
                      <div className="option-desc">Giao hàng tiết kiệm - 1-2 ngày</div>
                    </div>
                  </DeliveryOption>
                </div>
              </PaymentSection>

              {/* Phương thức thanh toán */}
              <PaymentSection>
                <h3>💳 Phương thức thanh toán</h3>
                <div className="options-grid">
                  <PaymentOption
                    selected={paymentMethod === 'COD'}
                    onClick={() => handlePaymentChange('COD')}
                  >
                    <div className="option-content">
                      <div className="option-title">Thanh toán khi nhận hàng (COD)</div>
                      <div className="option-desc">Thanh toán bằng tiền mặt khi nhận hàng</div>
                    </div>
                  </PaymentOption>

                  <PaymentOption
                    selected={paymentMethod === 'Stripe'}
                    onClick={() => handlePaymentChange('Stripe')}
                  >
                    <div className="option-content">
                      <div className="option-title">Thẻ tín dụng/ghi nợ</div>
                      <div className="option-desc">Thanh toán an toàn qua Stripe</div>
                    </div>
                  </PaymentOption>
                </div>

                {/* Stripe Form */}
                {paymentMethod === 'Stripe' && isStripeReady && clientSecret && (
                  <div style={{ marginTop: '20px' }}>
                    <Elements
                      key={stripeKey}
                      stripe={stripePromise}
                      options={{ clientSecret }}
                    >
                      <StripeCheckoutComponent
                        totalPrice={totalPriceMemo}
                        user={user}
                        clientSecret={clientSecret}
                        onSuccess={handleStripeSuccess}
                        onCancel={handleStripeCancel}
                      />
                    </Elements>
                  </div>
                )}
              </PaymentSection>

              {/* Danh sách sản phẩm */}
              <PaymentSection>
                <h3>🛍️ Sản phẩm đã chọn</h3>
                <ProductList>
                  {orderItems.map((item, index) => (
                    <ProductItem key={index}>
                      <img src={item.image} alt={item.name} />
                      <div className="product-info">
                        <div className="product-name">{item.name}</div>
                        <div className="product-price">
                          {converPrice(item.price * (1 - (item.discount || 0) / 100))}
                          {item.discount > 0 && (
                            <span className="original-price">
                              {converPrice(item.price)}
                            </span>
                          )}
                        </div>
                        {item.discount > 0 && (
                          <div className="product-discount">-{item.discount}%</div>
                        )}
                      </div>
                      <div className="product-quantity">x{item.amount}</div>
                    </ProductItem>
                  ))}
                </ProductList>
              </PaymentSection>
            </PaymentLeft>

            {/* RIGHT SIDE */}
            <PaymentRight>
              <OrderSummary>
                <h3>Tóm tắt đơn hàng</h3>

                <div className="summary-item">
                  <span>Tạm tính ({orderItems.length} sản phẩm)</span>
                  <span>{converPrice(priceMemo)}</span>
                </div>

                <div className="summary-item discount">
                  <span>Giảm giá</span>
                  <span>-{converPrice(priceDiscountMemo)}</span>
                </div>

                <div className="summary-item">
                  <span>Phí giao hàng</span>
                  <span>{converPrice(deliveryPriceMemo)}</span>
                </div>

                <div className="divider"></div>

                <div className="total">
                  <span>Tổng cộng</span>
                  <span className="total-price">{converPrice(totalPriceMemo)}</span>
                </div>

                <div className="tax-note">(Đã bao gồm VAT nếu có)</div>

                <Loading isLoading={isPlacingOrder && !isStripeReady}>
                  <ButtonComponent
                    onClick={handlePlaceOrder}
                    size={40}
                    styleButton={{
                      background: hasOrdered || (paymentMethod === 'Stripe' && isStripeReady)
                        ? '#ccc'
                        : 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                      height: '52px',
                      width: '100%',
                      border: 'none',
                      borderRadius: '12px',
                      marginTop: '20px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: hasOrdered || (paymentMethod === 'Stripe' && isStripeReady)
                        ? 'not-allowed'
                        : 'pointer'
                    }}
                    textButton={
                      hasOrdered
                        ? 'ĐANG XỬ LÝ...'
                        : (paymentMethod === 'Stripe' && isStripeReady)
                          ? 'ĐANG CHỜ THANH TOÁN...'
                          : paymentMethod === 'COD'
                            ? 'ĐẶT HÀNG NGAY'
                            : 'THANH TOÁN NGAY'
                    }
                    styleTextButton={{ color: '#fff', fontSize: '16px', fontWeight: '600' }}
                    disabled={hasOrdered || (paymentMethod === 'Stripe' && isStripeReady)}
                  />
                </Loading>

                <div className="security-note">
                  <span>🔒 Thanh toán an toàn & bảo mật</span>
                </div>
              </OrderSummary>
            </PaymentRight>
          </PaymentContent>
        </PaymentWrapper>
      </Loading>
    </PaymentContainer>
  );
};

export default PaymentPage;