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

  const passedOrders = location?.state?.orders || [];
  const orderItems = passedOrders.length ? passedOrders : order.orderItemsSelected;

  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  });

  // Address selection state
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

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

  // Determine default address for user (prefers addresses array default, otherwise fallback to user.address)
  const defaultAddress = useMemo(() => {
    const defaultAddr = (user?.addresses || []).find(a => a.isDefault)
    if (defaultAddr) return defaultAddr
    if (user?.address || user?.city || user?.phone || user?.name) {
      return { name: user?.name, phone: user?.phone, address: user?.address, city: user?.city }
    }
    return null
  }, [user])

  // Fetch addresses when opening selector or on mount
  const fetchAddresses = async () => {
    if (!user?.id) return
    try {
      const res = await UserService.getAddresses(user.id, user.access_token)
      if (res?.data) setAddresses(res.data)
    } catch (err) {
      console.log('❌ Lỗi fetch addresses', err)
    }
  }

  // Set selectedAddress from location state or default
  useEffect(() => {
    if (location?.state?.address) {
      setSelectedAddress(location.state.address)
    } else {
      const def = (user?.addresses || []).find(a => a.isDefault)
      if (def) setSelectedAddress(def)
    }
  }, [location, user])

  // Kiểm tra tính hợp lệ của đơn hàng
  useEffect(() => {
    const checkOrderValidity = () => {
      if (!orderItems?.length) {
        message.error('Không có sản phẩm nào để thanh toán!');
        setIsValidOrder(false);
        setTimeout(() => navigate('/order', { replace: true }), 1500);
        return false;
      }

      // require selectedAddress or fallback
      const currentAddr = selectedAddress || (user && ((user.address && user.city && user.phone && user.name) ? { name: user.name, address: user.address, city: user.city, phone: user.phone } : null))

      if (!user?.access_token || !currentAddr?.name || !currentAddr?.address || !currentAddr?.phone || !currentAddr?.city || !user?.id) {
        message.warning('Vui lòng cập nhật đầy đủ thông tin giao hàng!');
        setIsValidOrder(false);
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
  }, [orderItems, user, selectedAddress, hasOrdered, navigate]);

  // Load user details khi mở modal
  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      const current = selectedAddress || defaultAddress || user
      setStateUserDetails({
        name: current?.name || user?.data?.name || user?.name || '',
        phone: current?.phone || user?.data?.phone || user?.phone || '',
        address: current?.address || user?.data?.address || user?.address || '',
        city: current?.city || user?.data?.city || user?.city || '',
      });
    }
  }, [isOpenModalUpdateInfo, user, defaultAddress, selectedAddress]);

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      form.setFieldsValue(stateUserDetails);
    }
  }, [form, stateUserDetails, isOpenModalUpdateInfo]);

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

  // Update thông tin user
  const handleUpdateInfoUser = () => {
    const { name, address, city, phone } = stateUserDetails;
    if (name && address && city && phone) {
      mutationUpdate.mutate(
        {
          id: user?.id || user?.data?._id,
          token: user?.access_token,
          ...stateUserDetails
        },
        {
          onSuccess: (response) => {
            dispatch(updateUser(response?.data));
            setIsOpenModalUpdateInfo(false);
            setIsValidOrder(true);
            message.success('Cập nhật thông tin thành công!');
          },
          onError: () => {
            message.error('Cập nhật thông tin thất bại!');
          }
        }
      );
    } else {
      message.warning('Vui lòng điền đầy đủ thông tin!');
    }
  };

  const handleCancelUpdate = () => {
    form.resetFields();
    setIsOpenModalUpdateInfo(false);
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
        orderId: orderData._id || createdOrderId
      },
      replace: true
    });
  }, [orderItems, dispatch, navigate, delivery, totalPriceMemo, createdOrderId, resetStripeAndState]);

  // Tạo đơn hàng
  const handleCreateOrder = async (paymentMethodType = paymentMethod) => {
    if (!isValidOrder || hasOrdered || !orderItems?.length) {
      throw new Error('Đơn hàng không hợp lệ hoặc đã được xử lý');
    }

    // Xác định trạng thái thanh toán dựa trên paymentMethod
    const isPaid = paymentMethodType === 'Stripe';

    const currentAddr = selectedAddress || (user && ((user.address && user.city && user.phone && user.name) ? { name: user.name, phone: user.phone, address: user.address, city: user.city } : null))

    const payload = {
      orderItems,
      fullName: currentAddr?.name || user?.name,
      email: user?.email,
      phone: currentAddr?.phone || user?.phone,
      paymentMethod: paymentMethodType, // 'COD' hoặc 'Stripe'
      itemsPrice: priceMemo,
      shippingPrice: deliveryPriceMemo,
      totalPrice: totalPriceMemo,
      delivery,
      user: user?.id,
      address: currentAddr?.address || user?.address,
      city: currentAddr?.city || user?.city,
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

    // require a chosen address (either selectedAddress or fallback info on user)
    const currentAddr = selectedAddress || (user && ((user.address && user.city && user.phone && user.name) ? { name: user.name, address: user.address, city: user.city, phone: user.phone } : null))

    if (!user?.access_token || !orderItems?.length || !currentAddr || !user?.id) {
      message.warning('Vui lòng kiểm tra thông tin giao hàng và sản phẩm!');
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

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    });
  };

  // Address selector markup
  const AddressSelectorModal = () => (
    <Modal
      title="Chọn địa chỉ giao hàng"
      visible={showAddressSelector}
      onCancel={() => setShowAddressSelector(false)}
      footer={null}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {addresses && addresses.length ? (
          addresses.map(addr => (
            <div key={addr._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: selectedAddress && selectedAddress._id === addr._id ? '2px solid #1890ff' : '1px solid #f0f0f0', borderRadius: '6px' }}>
              <div>
                <div style={{ fontWeight: '600' }}>{addr.name} {addr.isDefault && <span style={{ color: '#1890ff', marginLeft: '8px' }}>(Mặc định)</span>}</div>
                <div style={{ color: '#666' }}>{addr.phone} • {addr.address}, {addr.city}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button type="primary" onClick={() => { setSelectedAddress(addr); setShowAddressSelector(false); setStateUserDetails({ name: addr.name, phone: addr.phone, address: addr.address, city: addr.city }); }}>
                  Chọn
                </Button>
                {!addr.isDefault && <Button onClick={async () => { await UserService.setDefaultAddress(user.id, addr._id, user.access_token); await fetchAddresses(); }}>
                  Đặt mặc định
                </Button>}
                <Button onClick={() => { setSelectedAddress(addr); setShowAddressSelector(false); setIsOpenModalUpdateInfo(true); }}>
                  Sửa
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div>Chưa có địa chỉ nào</div>
        )}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button onClick={() => { setShowAddressSelector(false); setIsOpenModalUpdateInfo(true); fetchAddresses(); }}>
            Thêm / Sửa địa chỉ
          </Button>
          <Button onClick={() => setShowAddressSelector(false)}>Đóng</Button>
        </div>
      </div>
    </Modal>
  )

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
              {/* Thông tin giao hàng */}
              <PaymentSection>
                <h3>🚚 Thông tin giao hàng</h3>
                <PaymentInfoCard onClick={() => { setShowAddressSelector(true); fetchAddresses() }}>
                  <div className="info-header">
                    <span className="title">Địa chỉ nhận hàng</span>
                    <span className="change-btn">Thay đổi</span>
                  </div>
                  <div className="info-content">
                    <div className="info-item">
                      <strong>{(selectedAddress || defaultAddress)?.name || 'Chưa có thông tin'}</strong>
                      <span>|</span>
                      <span>{(selectedAddress || defaultAddress)?.phone || 'Chưa có số điện thoại'}</span>
                    </div>
                    <div className="info-item">
                      {(selectedAddress || defaultAddress)?.address && (selectedAddress || defaultAddress)?.city ? `${(selectedAddress || defaultAddress).address}, ${(selectedAddress || defaultAddress).city}` : 'Chưa có địa chỉ'}
                    </div>
                  </div>
                </PaymentInfoCard>
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

      {/* Address selector modal */}
      <AddressSelectorModal />

      {/* Modal cập nhật thông tin */}
      <ModalComponent
        title="Cập nhật thông tin giao hàng"
        open={isOpenModalUpdateInfo}
        onCancel={handleCancelUpdate}
        onOk={handleUpdateInfoUser}
        width={screens.xs ? '90%' : 600}
      >
        <Loading isLoading={isLoading}>
          <Form
            form={form}
            labelCol={{ span: screens.xs ? 4 : 6 }}
            wrapperCol={{ span: screens.xs ? 20 : 18 }}
            initialValues={stateUserDetails}
          >
            <Form.Item
              label="Họ tên"
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
              <InputComponent
                value={stateUserDetails.name}
                onChange={handleOnchangeDetails}
                name="name"
              />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
            >
              <InputComponent
                value={stateUserDetails.phone}
                onChange={handleOnchangeDetails}
                name="phone"
              />
            </Form.Item>
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
            >
              <InputComponent
                value={stateUserDetails.address}
                onChange={handleOnchangeDetails}
                name="address"
              />
            </Form.Item>
            <Form.Item
              label="Thành phố"
              name="city"
              rules={[{ required: true, message: 'Vui lòng nhập thành phố!' }]}
            >
              <InputComponent
                value={stateUserDetails.city}
                onChange={handleOnchangeDetails}
                name="city"
              />
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
    </PaymentContainer>
  );
};

export default PaymentPage;