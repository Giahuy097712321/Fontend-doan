// src/pages/PaymentPage/PaymentPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, message, Grid } from 'antd';
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
  const [stateUserDetails, setStateUserDetails] = useState({ name: '', phone: '', address: '', city: '' });
  const [payment, setPayment] = useState('Thanh toán tiền mặt khi nhận hàng');
  const [delivery, setDelivery] = useState('FAST');
  const [clientSecret, setClientSecret] = useState(null);
  const [isStripeReady, setIsStripeReady] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [hasOrdered, setHasOrdered] = useState(false);
  const [isValidOrder, setIsValidOrder] = useState(true); // 🔥 Thêm state kiểm tra tính hợp lệ

  const mutationUpdate = useMutationHooks(async ({ id, token, ...userData }) => UserService.updateUser(id, userData, token));
  const mutationAddOrder = useMutationHooks((data) => {
    const { token, ...rest } = data;
    return OrderService.createOrder(rest, token);
  });

  const { isLoading } = mutationUpdate;
  const { isLoading: isLoadingAddOrder, isSuccess, isError, data: newOrder } = mutationAddOrder;

  // 🔥 KIỂM TRA NGHIÊM NGẶT KHI COMPONENT MOUNT
  useEffect(() => {
    const checkOrderValidity = () => {
      // Kiểm tra có sản phẩm không
      if (!orderItems?.length) {
        message.error('Không có sản phẩm nào để thanh toán!');
        setIsValidOrder(false);
        setTimeout(() => navigate('/order', { replace: true }), 1500);
        return false;
      }

      // Kiểm tra thông tin user
      if (!user?.access_token || !user?.name || !user?.address || !user?.phone || !user?.city || !user?.id) {
        message.warning('Vui lòng cập nhật đầy đủ thông tin giao hàng!');
        setIsValidOrder(false);
        return false;
      }

      // Kiểm tra xem đã từng đặt hàng chưa (phòng trường hợp quay lại)
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
  }, [orderItems, user, hasOrdered, navigate]);

  // Load user details khi mở modal
  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({
        name: user?.data?.name || user?.name || '',
        phone: user?.data?.phone || user?.phone || '',
        address: user?.data?.address || user?.address || '',
        city: user?.data?.city || user?.city || '',
      });
    }
  }, [isOpenModalUpdateInfo, user]);

  useEffect(() => { form.setFieldsValue(stateUserDetails); }, [form, stateUserDetails]);

  // Tính toán giá
  const priceMemo = useMemo(() => {
    if (!isValidOrder || !orderItems?.length) return 0;
    return orderItems.reduce((total, cur) => total + cur.price * cur.amount, 0);
  }, [orderItems, isValidOrder]);

  const priceDiscountMemo = useMemo(() => {
    if (!isValidOrder || !orderItems?.length) return 0;
    return orderItems.reduce((total, cur) => total + (cur.price * cur.amount * (cur.discount || 0)) / 100, 0);
  }, [orderItems, isValidOrder]);

  const deliveryPriceMemo = useMemo(() => {
    if (!isValidOrder || !orderItems.length) return 0;
    if (priceMemo >= 200000 && priceMemo < 500000) return 10000;
    if (priceMemo >= 500000) return 0;
    return 20000;
  }, [priceMemo, orderItems, isValidOrder]);

  const totalPriceMemo = useMemo(() => priceMemo - priceDiscountMemo + deliveryPriceMemo, [priceMemo, priceDiscountMemo, deliveryPriceMemo]);
  const totalDiscountPercent = useMemo(() => (priceMemo === 0 ? 0 : Math.round((priceDiscountMemo / priceMemo) * 100)), [priceDiscountMemo, priceMemo]);

  // Update thông tin user
  const handleUpdateInfoUser = () => {
    const { name, address, city, phone } = stateUserDetails;
    if (name && address && city && phone) {
      mutationUpdate.mutate(
        { id: user?.id || user?.data?._id, token: user?.access_token, ...stateUserDetails },
        {
          onSuccess: (response) => {
            dispatch(updateUser(response?.data));
            setIsOpenModalUpdateInfo(false);
            setIsValidOrder(true); // 🔥 Cập nhật lại tính hợp lệ sau khi update thông tin
          }
        }
      );
    } else message.warning('Vui lòng điền đầy đủ thông tin!');
  };

  const handleCancelUpdate = () => { form.resetFields(); setIsOpenModalUpdateInfo(false); };

  // Tạo đơn hàng
  const handleCreateOrder = async (paymentMethodType = payment) => {
    // 🔥 KIỂM TRA LẠI TRƯỚC KHI TẠO ORDER
    if (!isValidOrder || hasOrdered || !orderItems?.length) {
      throw new Error('Đơn hàng không hợp lệ hoặc đã được xử lý');
    }

    const isPaid = paymentMethodType === 'Thanh toán tiền mặt khi nhận hàng' || paymentMethodType === 'StripePaid';
    const payload = {
      orderItems,
      fullName: user?.name,
      email: user?.email,
      phone: user?.phone,
      paymentMethod: paymentMethodType.startsWith('Stripe') ? 'Stripe' : paymentMethodType,
      itemsPrice: priceMemo,
      shippingPrice: deliveryPriceMemo,
      totalPrice: totalPriceMemo,
      delivery,
      user: user?.id,
      address: user?.address,
      city: user?.city,
      country: 'Việt Nam',
      taxPrice: 0,
      discount: totalDiscountPercent || 0,
      isPaid,
    };

    return new Promise((resolve, reject) => {
      mutationAddOrder.mutate({ ...payload, token: user?.access_token }, {
        onSuccess: async (res) => {
          setCreatedOrderId(res.data._id);
          if (paymentMethodType === 'StripePaid') {
            await OrderService.payOrder(res.data._id, user?.access_token);
          }
          resolve(res.data);
        },
        onError: reject
      });
    });
  };

  const handleAddOrder = async () => {
    // 🔥 KIỂM TRA NGHIÊM NGẶT TRƯỚC KHI ĐẶT HÀNG
    if (!isValidOrder) {
      message.error('Đơn hàng không hợp lệ!');
      return;
    }

    if (hasOrdered) {
      message.warning('Đơn hàng đã được xử lý!');
      return;
    }

    if (!user?.access_token || !orderItems?.length || !user?.name || !user?.address || !user?.phone || !user?.city || !user?.id) {
      message.warning('Vui lòng kiểm tra thông tin giao hàng và sản phẩm!');
      return;
    }

    setIsPlacingOrder(true);

    if (payment === 'Thanh toán tiền mặt khi nhận hàng') {
      try {
        await handleCreateOrder();
      } catch (err) {
        message.error('Đặt hàng thất bại!');
        setIsPlacingOrder(false);
      }
    } else if (payment === 'Stripe') {
      try {
        const res = await PaymentService.createPaymentIntent(totalPriceMemo, user?.access_token);
        if (res?.status === 'OK' && res?.clientSecret) {
          setClientSecret(res.clientSecret);
          setIsStripeReady(true);
        } else {
          message.error('Không thể tạo payment Stripe!');
          setIsPlacingOrder(false);
        }
      } catch (err) {
        console.error(err);
        message.error('Lỗi tạo payment Stripe!');
        setIsPlacingOrder(false);
      }
    }
  };

  // 🔥 Xử lý sau khi order thành công - CẢI TIẾN LOGIC
  useEffect(() => {
    if (isSuccess && !hasOrdered && isValidOrder) {
      setHasOrdered(true); // Đánh dấu đã đặt hàng
      setIsValidOrder(false); // Đánh dấu không hợp lệ nữa

      message.success('Đặt hàng thành công!');

      // Xóa sản phẩm khỏi giỏ hàng
      const arrayOrdered = orderItems.map(item => item.product);
      dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }));

      // 🔥 CHUYỂN HƯỚNG NGAY LẬP TỨC VỚI REPLACE
      navigate('/orderSuccess', {
        state: {
          delivery,
          payment,
          orders: orderItems,
          totalPriceMemo,
          orderId: createdOrderId
        },
        replace: true // QUAN TRỌNG: không thể quay lại
      });
    } else if (isError && !hasOrdered) {
      message.error('Đặt hàng thất bại!');
      setIsPlacingOrder(false);
    }
  }, [isSuccess, isError, payment, orderItems, dispatch, navigate, delivery, totalPriceMemo, hasOrdered, createdOrderId, isValidOrder]);

  const handleOnchangeDetails = (e) => { setStateUserDetails({ ...stateUserDetails, [e.target.name]: e.target.value }); };

  // 🔥 NẾU ORDER KHÔNG HỢP LỆ, HIỂN THị THÔNG BÁO
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
                <PaymentInfoCard onClick={() => setIsOpenModalUpdateInfo(true)}>
                  <div className="info-header">
                    <span className="title">Địa chỉ nhận hàng</span>
                    <span className="change-btn">Thay đổi</span>
                  </div>
                  <div className="info-content">
                    <div className="info-item">
                      <strong>{user?.name || 'Chưa có thông tin'}</strong>
                      <span>|</span>
                      <span>{user?.phone || 'Chưa có số điện thoại'}</span>
                    </div>
                    <div className="info-item">
                      {user?.address && user?.city ? `${user.address}, ${user.city}` : 'Chưa có địa chỉ'}
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
                    selected={payment === 'Thanh toán tiền mặt khi nhận hàng'}
                    onClick={() => setPayment('Thanh toán tiền mặt khi nhận hàng')}
                  >
                    <div className="option-content">
                      <div className="option-title">Thanh toán khi nhận hàng (COD)</div>
                      <div className="option-desc">Thanh toán bằng tiền mặt khi nhận hàng</div>
                    </div>
                  </PaymentOption>

                  <PaymentOption
                    selected={payment === 'Stripe'}
                    onClick={() => setPayment('Stripe')}
                  >
                    <div className="option-content">
                      <div className="option-title">Thẻ tín dụng/ghi nợ</div>
                      <div className="option-desc">Thanh toán an toàn qua Stripe</div>
                    </div>
                  </PaymentOption>
                </div>

                {/* Stripe Form */}
                {isStripeReady && clientSecret && (
                  <div style={{ marginTop: '20px' }}>
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <StripeCheckoutComponent
                        totalPrice={totalPriceMemo}
                        user={user}
                        clientSecret={clientSecret}
                        onSuccess={async () => {
                          // 🔥 KIỂM TRA LẠI TRƯỚC KHI XỬ LÝ STRIPE
                          if (hasOrdered || !isValidOrder) {
                            message.warning('Đơn hàng đã được xử lý!');
                            return;
                          }

                          setHasOrdered(true);
                          setIsValidOrder(false);
                          const resOrder = await handleCreateOrder('StripePaid');
                          message.success('Thanh toán thành công!');
                          const arrayOrdered = orderItems.map(item => item.product);
                          dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }));
                          navigate('/orderSuccess', {
                            state: {
                              delivery,
                              payment,
                              orders: orderItems,
                              totalPriceMemo,
                              orderId: resOrder._id
                            },
                            replace: true
                          });
                        }}
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

                <Loading isLoading={isPlacingOrder}>
                  <ButtonComponent
                    onClick={handleAddOrder}
                    size={40}
                    styleButton={{
                      background: hasOrdered ? '#ccc' : 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                      height: '52px',
                      width: '100%',
                      border: 'none',
                      borderRadius: '12px',
                      marginTop: '20px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: hasOrdered ? 'not-allowed' : 'pointer'
                    }}
                    textButton={hasOrdered ? 'ĐANG XỬ LÝ...' : 'ĐẶT HÀNG NGAY'}
                    styleTextButton={{ color: '#fff', fontSize: '16px', fontWeight: '600' }}
                    disabled={isPlacingOrder || hasOrdered || !isValidOrder}
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

      {/* Modal cập nhật thông tin */}
      <ModalComponent
        title="Cập nhật thông tin giao hàng"
        open={isOpenModalUpdateInfo}
        onCancel={handleCancelUpdate}
        onOk={handleUpdateInfoUser}
        width={screens.xs ? '90%' : 600}
      >
        <Loading isLoading={isLoading}>
          <Form form={form} labelCol={{ span: screens.xs ? 4 : 6 }} wrapperCol={{ span: screens.xs ? 20 : 18 }}>
            <Form.Item label="Họ tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
              <InputComponent value={stateUserDetails.name} onChange={handleOnchangeDetails} name="name" />
            </Form.Item>
            <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
              <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
            </Form.Item>
            <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
              <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
            </Form.Item>
            <Form.Item label="Thành phố" name="city" rules={[{ required: true, message: 'Vui lòng nhập thành phố!' }]}>
              <InputComponent value={stateUserDetails.city} onChange={handleOnchangeDetails} name="city" />
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
    </PaymentContainer>
  );
};

export default PaymentPage;