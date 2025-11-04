import React, { useState, useEffect, useMemo } from 'react'
import { Checkbox, Form, Grid } from 'antd'
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import {
  WrapperContainer,
  WrapperCountOrder,
  WrapperInfo,
  WrapperItemOrder,
  WrapperLeft,
  WrapperRight,
  WrapperStyleHeader,
  WrapperListOrder,
  WrapperInputNumber,
  WrapperStyleHeaderDilivery,
  ActionButton,
  MobileProductCard,
  MobileProductInfo,
  OrderSummary
} from './style'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useSelector, useDispatch } from 'react-redux'
import {
  increaseAmount,
  decreaseAmount,
  removeOrderProduct,
  removeAllOrderProduct,
  selectedOrder,
} from '../../redux/sildes/orderSlide'
import { updateUser } from '../../redux/sildes/userSlide'

import { converPrice } from './../../utils'
import ModalComponent from './../../components/ModalComponent/ModalComponent'
import InputComponent from './../../components/InputComponent/InputComponent'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from './../../hooks/useMutationHook'
import Loading from './../../components/LoadingComponent/Loading'
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import Step from '../../components/Step/StepComponent';

const { useBreakpoint } = Grid;

const OrderPage = () => {
  const navigate = useNavigate();
  const order = useSelector((state) => state?.order)
  const user = useSelector((state) => state?.user)
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const screens = useBreakpoint();

  const [listChecked, setListChecked] = useState([])
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
  })

  // 🧩 Tính toán giá
  const [priceMemo, setPriceMemo] = useState(0);
  const [priceDiscountMemo, setPriceDiscountMemo] = useState(0);
  const [totalPriceMemo, setTotalPriceMemo] = useState(0);

  // 🧩 Tính phí giao hàng
  const deliveryPriceMemo = useMemo(() => {
    if (!order?.orderItems || listChecked.length === 0) return 0;
    if (priceMemo < 1000000) return 50000;
    if (priceMemo >= 1000000 && priceMemo < 5000000) return 20000;
    if (priceMemo >= 5000000) return 0;
    return 50000;
  }, [priceMemo, order?.orderItems, listChecked]);

  // 🧩 Mutation update user
  const mutationUpdate = useMutationHooks(async ({ id, token, ...userData }) => {
    return await UserService.updateUser(id, userData, token)
  })

  const { isLoading } = mutationUpdate

  // 🧩 Cập nhật thông tin giao hàng
  const handleUpdateInfoUser = () => {
    const { name, address, city, phone } = stateUserDetails
    if (name && address && city && phone) {
      mutationUpdate.mutate(
        {
          id: user?.id || user?.data?._id,
          token: user?.access_token,
          ...stateUserDetails,
        },
        {
          onSuccess: (response) => {
            dispatch(updateUser(response?.data))
            setIsOpenModalUpdateInfo(false)
            message.success('Cập nhật thông tin thành công!')
          },
        }
      )
    }
  }

  // 🧩 Reset modal
  const handleCancelUpdate = () => {
    form.resetFields()
    setIsOpenModalUpdateInfo(false)
  }

  // 🧩 Checkbox chọn sản phẩm
  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      setListChecked(listChecked.filter((item) => item !== e.target.value))
    } else {
      setListChecked([...listChecked, e.target.value])
    }
  }

  const handleOnchangeCheckAll = (e) => {
    if (e.target.checked) {
      const newListChecked = order?.orderItems?.map((item) => item.product)
      setListChecked(newListChecked)
    } else {
      setListChecked([])
    }
  }

  // 🧩 Tăng giảm sản phẩm
  const handleChangeCount = (type, idProduct) => {
    if (type === 'increase') dispatch(increaseAmount({ idProduct }))
    else dispatch(decreaseAmount({ idProduct }))
  }

  const handleDeleteOrder = (idProduct) => dispatch(removeOrderProduct({ idProduct }))
  const handleRemoveAllOrder = () => {
    if (listChecked.length > 0) {
      dispatch(removeAllOrderProduct({ listChecked }))
      message.success('Đã xóa sản phẩm đã chọn!')
    }
  }

  // 🧩 Khi mở modal cập nhật
  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({
        name: user?.data?.name || user?.name || '',
        phone: user?.data?.phone || user?.phone || '',
        address: user?.data?.address || user?.address || '',
        city: user?.data?.city || user?.city || '',
      })
    }
  }, [isOpenModalUpdateInfo, user])

  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])

  // 🧩 Tính toán giá trị đơn hàng
  useEffect(() => {
    const selectedItems = order?.orderItems?.filter(item =>
      listChecked.includes(item.product)
    );

    const price = selectedItems.reduce((total, cur) => total + cur.price * cur.amount, 0);
    const discount = selectedItems.reduce(
      (total, cur) => total + ((cur.price * cur.amount * (cur.discount || 0)) / 100),
      0
    );
    const total = price - discount + deliveryPriceMemo;

    setPriceMemo(price);
    setPriceDiscountMemo(discount);
    setTotalPriceMemo(total);
  }, [listChecked, order?.orderItems, deliveryPriceMemo]);

  // 🧩 Khi nhấn "Mua hàng"
  const handleAddCard = () => {
    if (!order?.orderItems?.length) {
      message.error('Giỏ hàng trống!');
    } else if (listChecked.length === 0) {
      message.error('Vui lòng chọn sản phẩm trước khi mua hàng!');
    } else if (!user?.phone || !user?.address || !user?.name || !user?.city) {
      setIsOpenModalUpdateInfo(true);
    } else {
      const selectedItems = order?.orderItems?.filter(item =>
        listChecked.includes(item.product)
      );
      dispatch(selectedOrder({ listChecked }));
      navigate('/payment', {
        state: {
          orders: selectedItems,
        },
      });
    }
  };

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({ ...stateUserDetails, [e.target.name]: e.target.value })
  }

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true)
  }

  const itemsDelivery = [
    {
      title: '50.000 VND',
      description: 'Dưới 1.000.000 VND',
    },
    {
      title: '20.000 VND',
      description: 'Từ 1.000.000 - 5.000.000 VND',
    },
    {
      title: 'Miễn phí',
      description: 'Trên 5.000.000 VND',
    },
  ]

  const getCurrentStep = () => {
    if (listChecked.length === 0) return 0;
    if (priceMemo < 1000000) return 1;
    if (priceMemo >= 1000000 && priceMemo < 5000000) return 2;
    return 3;
  }

  // 🧩 Component tóm tắt đơn hàng
  const OrderSummaryComponent = () => (
    <OrderSummary>
      <div className="summary-header">Tóm tắt đơn hàng</div>
      <div className="summary-item">
        <span>Tạm tính</span>
        <span>{converPrice(priceMemo)}</span>
      </div>
      <div className="summary-item">
        <span>Giảm giá</span>
        <span className="discount">-{converPrice(priceDiscountMemo)}</span>
      </div>
      <div className="summary-item">
        <span>Phí giao hàng</span>
        <span>{converPrice(deliveryPriceMemo)}</span>
      </div>
      <div className="divider"></div>
      <div className="total">
        <span>Tổng tiền</span>
        <span className="total-price">{converPrice(totalPriceMemo)}</span>
      </div>
    </OrderSummary>
  )

  // 🧩 Component địa chỉ giao hàng
  const DeliveryAddressComponent = () => (
    <WrapperInfo
      style={{ cursor: 'pointer' }}
      onClick={handleChangeAddress}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '16px', fontWeight: '600' }}>Địa chỉ giao hàng</span>
        <span style={{ color: '#1890ff', fontSize: '14px' }}>Thay đổi</span>
      </div>
      <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
        <div><strong>{user?.name || 'Chưa có'}</strong> | {user?.phone || 'Chưa có'}</div>
        <div>{user?.address && user?.city ? `${user.address}, ${user.city}` : 'Chưa có địa chỉ'}</div>
      </div>
    </WrapperInfo>
  )

  // 🧩 Render sản phẩm cho cả mobile và desktop
  const renderProductList = () => (
    <>
      <WrapperStyleHeader>
        <span style={{ display: 'inline-block', width: screens.md ? '390px' : '100%' }}>
          <Checkbox
            onChange={handleOnchangeCheckAll}
            checked={listChecked?.length === order?.orderItems?.length}
          />
          <span style={{ marginLeft: '8px', fontWeight: '500' }}>
            Tất cả ({order?.orderItems?.length} sản phẩm)
          </span>
        </span>
        {screens.md && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Đơn giá</span>
            <span>Số lượng</span>
            <span>Thành tiền</span>
            <span>Thao tác</span>
            <DeleteOutlined
              style={{ cursor: 'pointer', color: '#ff4d4f' }}
              onClick={handleRemoveAllOrder}
            />
          </div>
        )}
      </WrapperStyleHeader>

      <WrapperListOrder>
        {order?.orderItems?.map((orderItem) => (
          screens.md ? (
            // 🖥️ Desktop View
            <WrapperItemOrder key={orderItem?.product} checked={listChecked.includes(orderItem?.product)}>
              <div style={{ width: '390px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <Checkbox
                  onChange={onChange}
                  value={orderItem?.product}
                  checked={listChecked.includes(orderItem?.product)}
                />
                <img
                  src={orderItem?.image}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                  alt={orderItem?.name}
                />
                <div
                  style={{
                    width: 240,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  {orderItem?.name}
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{
                    textDecoration: orderItem?.discount ? 'line-through' : 'none',
                    color: '#888',
                    fontSize: '14px'
                  }}>
                    {converPrice(orderItem?.price)}
                  </span>
                  {orderItem?.discount > 0 && (
                    <span style={{
                      color: 'rgb(255, 66, 78)',
                      fontWeight: 500,
                      fontSize: '13px',
                      background: 'rgba(255, 66, 78, 0.1)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      marginTop: '4px'
                    }}>
                      -{orderItem?.discount}%
                    </span>
                  )}
                </div>

                <WrapperCountOrder>
                  <button onClick={() => handleChangeCount('decrease', orderItem?.product)}>
                    <MinusOutlined style={{ fontSize: '12px' }} />
                  </button>
                  <WrapperInputNumber value={orderItem?.amount} readOnly />
                  <button onClick={() => handleChangeCount('increase', orderItem?.product)}>
                    <PlusOutlined style={{ fontSize: '12px' }} />
                  </button>
                </WrapperCountOrder>

                <span style={{
                  color: 'rgb(255, 66, 78)',
                  fontWeight: 600,
                  fontSize: '15px'
                }}>
                  {converPrice(
                    orderItem?.price *
                    (1 - (orderItem?.discount || 0) / 100) *
                    orderItem?.amount
                  )}
                </span>

                <DeleteOutlined
                  style={{ cursor: 'pointer', color: '#ff4d4f' }}
                  onClick={() => handleDeleteOrder(orderItem?.product)}
                />
              </div>
            </WrapperItemOrder>
          ) : (
            // 📱 Mobile View
            <MobileProductCard key={orderItem?.product} checked={listChecked.includes(orderItem?.product)}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <Checkbox
                  onChange={onChange}
                  value={orderItem?.product}
                  checked={listChecked.includes(orderItem?.product)}
                />
                <img
                  src={orderItem?.image}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                  alt={orderItem?.name}
                />
                <MobileProductInfo>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '4px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {orderItem?.name}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{
                      color: 'rgb(255, 66, 78)',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>
                      {converPrice(orderItem?.price * (1 - (orderItem?.discount || 0) / 100))}
                    </span>
                    {orderItem?.discount > 0 && (
                      <span style={{
                        textDecoration: 'line-through',
                        color: '#999',
                        fontSize: '12px'
                      }}>
                        {converPrice(orderItem?.price)}
                      </span>
                    )}
                  </div>
                  {orderItem?.discount > 0 && (
                    <span style={{
                      color: 'rgb(255, 66, 78)',
                      fontSize: '12px',
                      background: 'rgba(255, 66, 78, 0.1)',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      -{orderItem?.discount}%
                    </span>
                  )}
                </MobileProductInfo>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <WrapperCountOrder>
                  <button onClick={() => handleChangeCount('decrease', orderItem?.product)}>
                    <MinusOutlined style={{ fontSize: '12px' }} />
                  </button>
                  <WrapperInputNumber value={orderItem?.amount} readOnly />
                  <button onClick={() => handleChangeCount('increase', orderItem?.product)}>
                    <PlusOutlined style={{ fontSize: '12px' }} />
                  </button>
                </WrapperCountOrder>

                <DeleteOutlined
                  style={{ cursor: 'pointer', color: '#ff4d4f', fontSize: '18px' }}
                  onClick={() => handleDeleteOrder(orderItem?.product)}
                />
              </div>
            </MobileProductCard>
          )
        ))}
      </WrapperListOrder>
    </>
  )

  return (
    <WrapperContainer>
      <div style={{
        maxWidth: '1270px',
        margin: '0 auto',
        padding: screens.xs ? '12px' : '20px'
      }}>
        <h3 style={{
          fontSize: screens.xs ? '20px' : '24px',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: '#333'
        }}>
          Giỏ hàng
        </h3>

        {/* 🚚 Step Component - CHỈ HIỂN THỊ 1 LẦN DUY NHẤT */}
        <WrapperStyleHeaderDilivery>
          <Step items={itemsDelivery} current={getCurrentStep()} />
        </WrapperStyleHeaderDilivery>

        <div style={{
          display: 'flex',
          flexDirection: screens.md ? 'row' : 'column',
          gap: '24px',
          alignItems: 'flex-start'
        }}>
          {/* LEFT SIDE - Sản phẩm */}
          <WrapperLeft>
            {renderProductList()}
          </WrapperLeft>

          {/* RIGHT SIDE - Thông tin đơn hàng */}
          <WrapperRight>
            <DeliveryAddressComponent />
            <OrderSummaryComponent />
            <ActionButton onClick={handleAddCard}>
              {screens.xs ? `Mua hàng (${converPrice(totalPriceMemo)})` : 'Mua hàng'}
            </ActionButton>
          </WrapperRight>
        </div>
      </div>

      {/* MODAL CẬP NHẬT THÔNG TIN */}
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
    </WrapperContainer>
  )
}

export default OrderPage