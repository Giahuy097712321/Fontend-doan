import React, { useState, useEffect, useMemo } from 'react'
import { Checkbox, Form } from 'antd'
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import {
  WrapperCountOrder,
  WrapperInfo,
  WrapperItemOrder,
  WrapperLeft,
  WrapperRight,
  WrapperStyleHeader,
  WrapperListOrder,
  WrapperTotal,
  WrapperInputNumber,
  WrapperStyleHeaderDilivery
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

const OrderPage = () => {
  const navigate = useNavigate();
  const order = useSelector((state) => state?.order)
  const user = useSelector((state) => state?.user)
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  const [listChecked, setListChecked] = useState([])
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
  })

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
            // ✅ Cập nhật redux ngay lập tức — không cần reload
            dispatch(updateUser(response?.data))
            setIsOpenModalUpdateInfo(false)
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
    if (listChecked.length > 0) dispatch(removeAllOrderProduct({ listChecked }))
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

  // Bỏ dispatch tự động khi listChecked thay đổi, chỉ dispatch khi nhấn Mua hàng

  // 🧩 Tính toán giá
  // 🧩 Tính toán giá
  const [priceMemo, setPriceMemo] = useState(0);
  const [priceDiscountMemo, setPriceDiscountMemo] = useState(0);
  const [totalPriceMemo, setTotalPriceMemo] = useState(0);

  // 🧩 Tính phí giao hàng (delivery) bằng useMemo
  const deliveryPriceMemo = useMemo(() => {
    if (!order?.orderItems || listChecked.length === 0) return 0; // Không có sản phẩm nào được chọn
    if (priceMemo < 1000000) return 50000;        // Dưới 1 triệu: 50k
    if (priceMemo >= 1000000 && priceMemo < 5000000) return 20000; // 1-5 triệu: 20k
    if (priceMemo >= 5000000) return 0;           // Trên 5 triệu: miễn phí
    return 50000;
  }, [priceMemo, order?.orderItems, listChecked]);

  // 🧩 Tính tổng giá trị đơn hàng
  useEffect(() => {
    const selectedItems = order?.orderItems?.filter(item =>
      listChecked.includes(item.product)
    );

    // Tính tổng giá gốc
    const price = selectedItems.reduce((total, cur) => total + cur.price * cur.amount, 0);

    // Tính tổng số tiền giảm giá theo phần trăm
    const discount = selectedItems.reduce(
      (total, cur) => total + ((cur.price * cur.amount * (cur.discount || 0)) / 100),
      0
    );

    // Tổng tiền sau giảm + phí giao hàng
    const total = price - discount + deliveryPriceMemo;

    setPriceMemo(price);
    setPriceDiscountMemo(discount);
    setTotalPriceMemo(total);

  }, [listChecked, order?.orderItems, deliveryPriceMemo]);


  // 🧩 Khi nhấn “Mua hàng”
  const handleAddCard = () => {
    if (!order?.orderItems?.length) {
      message.error('Giỏ hàng trống!');
    } else if (listChecked.length === 0) {
      message.error('Vui lòng chọn sản phẩm trước khi mua hàng!');
    } else if (!user?.phone || !user?.address || !user?.name || !user?.city) {
      setIsOpenModalUpdateInfo(true);
    } else {
      // ✅ Lấy trực tiếp danh sách sản phẩm đã chọn
      const selectedItems = order?.orderItems?.filter(item =>
        listChecked.includes(item.product)
      );

      // ✅ Cập nhật Redux (tùy chọn)
      dispatch(selectedOrder({ listChecked }));
      console.log("✅ selectedItems gửi sang payment:", selectedItems);

      // ✅ Điều hướng và truyền dữ liệu ngay lập tức
      navigate('/payment', {
        state: {
          orders: selectedItems, // Truyền sản phẩm chọn qua state
        },
      });
    }
  };


  const handleOnchangeDetails = (e) => {
    setStateUserDetails({ ...stateUserDetails, [e.target.name]: e.target.value })
  }
  console.log("🧠 Dữ liệu user từ Redux:", user);
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

    if (priceMemo < 1000000) return 1;        // Dưới 1 triệu
    if (priceMemo >= 1000000 && priceMemo < 5000000) return 2; // 1-5 triệu
    return 3; // Trên 5 triệu
  }

  return (
    <div style={{ background: '#f5f5fa', width: '100%', minHeight: '100vh' }}>
      <div style={{ width: '1270px', margin: '0 auto', height: '100%' }}>
        <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '20px' }}>Giỏ hàng</h3>
        <WrapperStyleHeaderDilivery>
          <Step
            items={itemsDelivery}
            current={getCurrentStep()}
          />
        </WrapperStyleHeaderDilivery>
        <div style={{ display: 'flex', justifyContent: 'center' }}>

          {/* LEFT SIDE */}
          <WrapperLeft>
            <WrapperStyleHeader>
              <span style={{ display: 'inline-block', width: '390px' }}>
                <Checkbox
                  onChange={handleOnchangeCheckAll}
                  checked={listChecked?.length === order?.orderItems?.length}
                />
                <span style={{ marginLeft: '8px' }}>
                  Tất cả ({order?.orderItems?.length} sản phẩm)
                </span>
              </span>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Đơn giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
                <span>Thao tác</span>
                <DeleteOutlined style={{ cursor: 'pointer' }} onClick={handleRemoveAllOrder} />
              </div>
            </WrapperStyleHeader>

            <WrapperListOrder>
              {order?.orderItems?.map((orderItem) => (
                <WrapperItemOrder key={orderItem?.product}>
                  <div style={{ width: '390px', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Checkbox
                      onChange={onChange}
                      value={orderItem?.product}
                      checked={listChecked.includes(orderItem?.product)}
                    />
                    <img
                      src={orderItem?.image}
                      style={{ width: '77px', height: '79px', objectFit: 'cover' }}
                      alt={orderItem?.name}
                    />
                    <div
                      style={{
                        width: 260,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {orderItem?.name}
                    </div>
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Giá gốc và giảm giá */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ textDecoration: orderItem?.discount ? 'line-through' : 'none', color: '#888' }}>
                        {converPrice(orderItem?.price)}
                      </span>
                      {orderItem?.discount > 0 && (
                        <span style={{ color: 'rgb(255, 66, 78)', fontWeight: 500 }}>
                          {`-${orderItem?.discount}%`}
                        </span>
                      )}
                    </div>

                    <WrapperCountOrder>
                      <button onClick={() => handleChangeCount('decrease', orderItem?.product)}>
                        <MinusOutlined />
                      </button>
                      <WrapperInputNumber value={orderItem?.amount} size="small" />
                      <button onClick={() => handleChangeCount('increase', orderItem?.product)}>
                        <PlusOutlined />
                      </button>
                    </WrapperCountOrder>

                    {/* Giá sau khi giảm */}
                    <span style={{ color: 'rgb(255, 66, 78)', fontWeight: 500 }}>
                      {(
                        orderItem?.price *
                        (1 - (orderItem?.discount || 0) / 100) *
                        orderItem?.amount
                      ).toLocaleString('vi-VN')}
                      ₫
                    </span>

                    <DeleteOutlined
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDeleteOrder(orderItem?.product)}
                    />
                  </div>

                </WrapperItemOrder>
              ))}
            </WrapperListOrder>
          </WrapperLeft>

          {/* RIGHT SIDE */}
          <WrapperRight>
            <div style={{ width: '100%' }}>
              {/* 🏠 Địa chỉ giao hàng */}
              <WrapperInfo
                style={{
                  backgroundColor: '#fafafa',
                  padding: '16px 20px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  marginBottom: '16px',
                  lineHeight: '1.6',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>Địa chỉ giao hàng</span>
                  <span
                    onClick={
                      handleChangeAddress
                    }
                    style={{
                      color: '#007bff',
                      fontSize: '14px',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Thay đổi
                  </span>
                </div>

                <div style={{ marginTop: '8px', fontSize: '15px', color: '#555' }}>
                  <div>
                    <strong>Người nhận:</strong> {user?.name || 'Chưa có'}
                  </div>
                  <div>
                    <strong>Số điện thoại:</strong> {user?.phone || 'Chưa có'}
                  </div>
                  <div>
                    <strong>Địa chỉ:</strong>{' '}
                    <span style={{ color: '#007bff' }}>
                      {user?.address && user?.city
                        ? `${user.address} - ${user.city}`
                        : 'Chưa có thông tin'}
                    </span>
                  </div>
                </div>
              </WrapperInfo>

              {/* 💰 Tóm tắt đơn hàng */}
              <WrapperInfo
                style={{
                  fontSize: '16px',
                  lineHeight: '1.8',
                  backgroundColor: '#fafafa',
                  padding: '16px 20px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '500' }}>Tạm tính</span>
                  <span style={{ fontWeight: '600' }}>{converPrice(priceMemo)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                  <span style={{ fontWeight: '500' }}>Giảm giá</span>
                  <span style={{ color: 'red', fontWeight: '600' }}>{converPrice(priceDiscountMemo)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                  <span style={{ fontWeight: '500' }}>Phí giao hàng</span>
                  <span style={{ fontWeight: '600' }}>{converPrice(deliveryPriceMemo)}</span>
                </div>
              </WrapperInfo>
            </div>

            {/* 💸 Tổng tiền */}
            <WrapperTotal>
              <span>Tổng tiền</span>
              <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold' }}>
                  {converPrice(totalPriceMemo)}
                </span>
                <span style={{ color: '#000', fontSize: '11px' }}>(Đã bao gồm VAT)</span>
              </span>
            </WrapperTotal>

            {/* 🛒 Nút mua hàng */}
            <ButtonComponent
              onClick={handleAddCard}
              size={40}
              styleButton={{
                background: 'rgb(255, 57, 69)',
                height: '48px',
                width: '220px',
                border: 'none',
                borderRadius: '4px',
              }}
              textButton={'Mua hàng'}
              styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
            />
          </WrapperRight>

        </div>
      </div>

      {/* 🧩 MODAL CẬP NHẬT THÔNG TIN */}
      <ModalComponent
        title="Cập nhật thông tin giao hàng"
        open={isOpenModalUpdateInfo}
        onCancel={handleCancelUpdate}
        onOk={handleUpdateInfoUser}
      >
        <Loading isLoading={isLoading}>
          <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Nhập tên!' }]}>
              <InputComponent value={stateUserDetails.name} onChange={handleOnchangeDetails} name="name" />
            </Form.Item>
            <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Nhập số điện thoại!' }]}>
              <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
            </Form.Item>
            <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Nhập địa chỉ!' }]}>
              <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
            </Form.Item>
            <Form.Item label="City" name="city" rules={[{ required: true, message: 'Nhập thành phố!' }]}>
              <InputComponent value={stateUserDetails.city} onChange={handleOnchangeDetails} name="city" />
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
    </div>
  )
}

export default OrderPage
