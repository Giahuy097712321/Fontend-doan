// src/pages/PaymentPage/PaymentPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, message } from 'antd';
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
import { WrapperInfo, WrapperLeft, WrapperRight, WrapperTotal } from './style';

// Stripe
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeCheckoutComponent from '../../components/StripeCheckoutComponent/StripeCheckoutComponent';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentPage = () => {
  const order = useSelector(state => state?.order);
  const user = useSelector(state => state?.user);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();

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
  const mutationUpdate = useMutationHooks(async ({ id, token, ...userData }) => UserService.updateUser(id, userData, token));
  const mutationAddOrder = useMutationHooks((data) => {
    const { token, ...rest } = data;
    return OrderService.createOrder(rest, token);
  });

  const { isLoading } = mutationUpdate;
  const { isLoading: isLoadingAddOrder, isSuccess, isError, data: newOrder } = mutationAddOrder;

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
  const priceMemo = useMemo(() => orderItems.reduce((total, cur) => total + cur.price * cur.amount, 0), [orderItems]);
  const priceDiscountMemo = useMemo(() => orderItems.reduce((total, cur) => total + (cur.price * cur.amount * (cur.discount || 0)) / 100, 0), [orderItems]);
  const deliveryPriceMemo = useMemo(() => {
    if (!orderItems.length) return 0;
    if (priceMemo >= 200000 && priceMemo < 500000) return 10000;
    if (priceMemo >= 500000) return 0;
    return 20000;
  }, [priceMemo, orderItems]);
  const totalPriceMemo = useMemo(() => priceMemo - priceDiscountMemo + deliveryPriceMemo, [priceMemo, priceDiscountMemo, deliveryPriceMemo]);
  const totalDiscountPercent = useMemo(() => (priceMemo === 0 ? 0 : Math.round((priceDiscountMemo / priceMemo) * 100)), [priceDiscountMemo, priceMemo]);

  // Nếu không có sản phẩm thì chuyển trang
  useEffect(() => {
    if (!orderItems?.length) {
      message.error('Vui lòng chọn sản phẩm ở giỏ hàng!');
      navigate('/order');
    }
  }, [orderItems, navigate]);

  // Update thông tin user
  const handleUpdateInfoUser = () => {
    const { name, address, city, phone } = stateUserDetails;
    if (name && address && city && phone) {
      mutationUpdate.mutate(
        { id: user?.id || user?.data?._id, token: user?.access_token, ...stateUserDetails },
        { onSuccess: (response) => { dispatch(updateUser(response?.data)); setIsOpenModalUpdateInfo(false); } }
      );
    } else message.warning('Vui lòng điền đầy đủ thông tin!');
  };

  const handleCancelUpdate = () => { form.resetFields(); setIsOpenModalUpdateInfo(false); };

  // Tạo đơn hàng
  // ... giữ nguyên imports và logic cũ
  // Trong handleCreateOrder
  const handleCreateOrder = async (paymentMethodType = payment) => {
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
          // Nếu StripePaid, cập nhật payOrder để Stripe server confirm
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
    if (!user?.access_token || !orderItems?.length || !user?.name || !user?.address || !user?.phone || !user?.city || !user?.id) {
      return message.warning('Vui lòng kiểm tra thông tin giao hàng và sản phẩm!');
    }

    setIsPlacingOrder(true); // Bật loading

    if (payment === 'Thanh toán tiền mặt khi nhận hàng') {
      try {
        await handleCreateOrder(); // Tạo order
      } catch (err) {
        message.error('Đặt hàng thất bại!');
      } finally {
        setIsPlacingOrder(false); // Tắt loading
      }
    } else if (payment === 'Stripe') {
      try {
        const res = await PaymentService.createPaymentIntent(totalPriceMemo, user?.access_token);
        if (res?.status === 'OK' && res?.clientSecret) {
          setClientSecret(res.clientSecret);
          setIsStripeReady(true);
        } else {
          message.error('Không thể tạo payment Stripe!');
        }
      } catch (err) {
        console.error(err);
        message.error('Lỗi tạo payment Stripe!');
      } finally {
        setIsPlacingOrder(false);
      }
    }
  };




  // Xử lý sau khi order thành công
  useEffect(() => {
    if (isSuccess && payment === 'Thanh toán tiền mặt khi nhận hàng') {
      message.success('Đặt hàng thành công!');
      const arrayOrdered = orderItems.map(item => item.product);
      dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }));
      setTimeout(() => navigate('/orderSuccess', { state: { delivery, payment, orders: orderItems, totalPriceMemo } }), 500);
    } else if (isError) message.error('Đặt hàng thất bại!');
  }, [isSuccess, isError, payment, orderItems, dispatch, navigate, delivery, totalPriceMemo]);

  const handleOnchangeDetails = (e) => { setStateUserDetails({ ...stateUserDetails, [e.target.name]: e.target.value }); };

  return (
    <div style={{ background: '#f5f6fa', width: '100%', minHeight: '100vh', padding: '30px 0' }}>
      <Loading isLoading={isLoadingAddOrder || isLoading}>
        <div style={{ width: '1250px', margin: '0 auto', background: '#fff', borderRadius: '10px', padding: '30px 40px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#222', marginBottom: '30px' }}>🧾 Thanh toán đơn hàng</h2>

          <div style={{ display: 'flex', gap: '25px', alignItems: 'flex-start' }}>
            {/* LEFT */}
            <WrapperLeft style={{ flex: 1 }}>
              <WrapperInfo style={{ backgroundColor: '#fafafa', padding: '16px 20px', borderRadius: '8px', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '15px' }}>🚚 Phương thức giao hàng</h4>
                <label>
                  <input type="radio" name="delivery" value="FAST" checked={delivery === 'FAST'} onChange={(e) => setDelivery(e.target.value)} /> FAST - Giao hàng nhanh
                </label>
                <br />
                <label>
                  <input type="radio" name="delivery" value="GO_JEK" checked={delivery === 'GO_JEK'} onChange={(e) => setDelivery(e.target.value)} /> GO_JEK - Giao hàng tiết kiệm
                </label>
              </WrapperInfo>

              <WrapperInfo style={{ backgroundColor: '#fafafa', padding: '16px 20px', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '15px' }}>💳 Phương thức thanh toán</h4>
                <label>
                  <input type="radio" name="payment" value="Thanh toán tiền mặt khi nhận hàng" checked={payment === 'Thanh toán tiền mặt khi nhận hàng'} onChange={(e) => setPayment(e.target.value)} /> Thanh toán COD
                </label>
                <br />
                <label>
                  <input type="radio" name="payment" value="Stripe" checked={payment === 'Stripe'} onChange={(e) => setPayment(e.target.value)} /> Thanh toán online (Stripe)
                </label>

                {/* Stripe Form */}
                {isStripeReady && clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <StripeCheckoutComponent
                      totalPrice={totalPriceMemo}
                      user={user}
                      clientSecret={clientSecret}
                      onSuccess={async () => {
                        // Tạo order + mark isPaid = true
                        const resOrder = await handleCreateOrder('StripePaid'); // chỉnh isPaid = true trong handleCreateOrder
                        message.success('Thanh toán thành công!');
                        const arrayOrdered = orderItems.map(item => item.product);
                        dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }));
                        navigate('/orderSuccess', { state: { delivery, payment, orders: orderItems, totalPriceMemo } });
                      }}
                    />
                  </Elements>
                )}



              </WrapperInfo>
            </WrapperLeft>

            {/* RIGHT */}
            <WrapperRight>
              <WrapperInfo style={{ backgroundColor: '#fafafa', padding: '16px 20px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '600' }}>Địa chỉ giao hàng</span>
                  <span onClick={() => setIsOpenModalUpdateInfo(true)} style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>Thay đổi</span>
                </div>
                <div style={{ marginTop: '10px' }}>
                  <div><strong>Người nhận:</strong> {user?.name}</div>
                  <div><strong>SĐT:</strong> {user?.phone}</div>
                  <div><strong>Địa chỉ:</strong> {user?.address} - {user?.city}</div>
                </div>
              </WrapperInfo>

              <WrapperInfo style={{ backgroundColor: '#fafafa', padding: '16px 20px', borderRadius: '8px', marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tạm tính</span><span>{converPrice(priceMemo)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}><span>Giảm giá %</span><span style={{ color: 'red' }}>- {converPrice(priceDiscountMemo)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}><span>Phí giao hàng</span><span>{converPrice(deliveryPriceMemo)}</span></div>
              </WrapperInfo>

              <WrapperTotal>
                <span>Tổng tiền</span>
                <span style={{ color: 'rgb(254, 56, 52)', fontSize: '22px', fontWeight: '700' }}>{converPrice(totalPriceMemo)}</span>
              </WrapperTotal>

              <Loading isLoading={isPlacingOrder || isLoadingAddOrder || isLoading}>
                <ButtonComponent
                  onClick={handleAddOrder}
                  size={40}
                  styleButton={{ background: 'rgb(255, 57, 69)', height: '48px', width: '100%', border: 'none', borderRadius: '6px', marginTop: '15px' }}
                  textButton={'Đặt hàng ngay'}
                  styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                />
              </Loading>

            </WrapperRight>
          </div>
        </div>
      </Loading>

      {/* Modal cập nhật thông tin */}
      <ModalComponent title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancelUpdate} onOk={handleUpdateInfoUser}>
        <Loading isLoading={isLoading}>
          <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
            <Form.Item label="Tên" name="name" rules={[{ required: true, message: 'Nhập tên!' }]}>
              <InputComponent value={stateUserDetails.name} onChange={handleOnchangeDetails} name="name" />
            </Form.Item>
            <Form.Item label="SĐT" name="phone" rules={[{ required: true, message: 'Nhập số điện thoại!' }]}>
              <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
            </Form.Item>
            <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: 'Nhập địa chỉ!' }]}>
              <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
            </Form.Item>
            <Form.Item label="Thành phố" name="city" rules={[{ required: true, message: 'Nhập thành phố!' }]}>
              <InputComponent value={stateUserDetails.city} onChange={handleOnchangeDetails} name="city" />
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default PaymentPage;
