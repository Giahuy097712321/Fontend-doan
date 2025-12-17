import React, { useState, useEffect, useMemo } from 'react'
import { Checkbox, Form, Grid, Button } from 'antd'
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

  // Address management (for selector/edit from cart)
  const [addresses, setAddresses] = useState([])
  const [isAddressSelectorOpen, setIsAddressSelectorOpen] = useState(false)
  const [isAddressEditOpen, setIsAddressEditOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [addrName2, setAddrName2] = useState('')
  const [addrPhone2, setAddrPhone2] = useState('')
  const [addrAddress2, setAddrAddress2] = useState('')
  const [addrCity2, setAddrCity2] = useState('')
  const [addrIsDefault2, setAddrIsDefault2] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState(null)

  const fetchAddresses = async () => {
    if (!user?.id) return []
    try {
      const res = await UserService.getAddresses(user.id, user.access_token)
      if (res?.data) {
        setAddresses(res.data)
        return res.data
      }
      return []
    } catch (err) {
      console.log('❌ Lỗi fetch addresses (OrderPage)', err)
      message.error('Không thể tải danh sách địa chỉ')
      return []
    }
  }



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

  // Fetch addresses when user logs in / changes
  useEffect(() => {
    if (user?.id) {
      fetchAddresses()
    }
  }, [user?.id])

  // Also refetch when user's addresses in redux change (keeps UI consistent after edits)
  useEffect(() => {
    if (user?.addresses) {
      fetchAddresses()
    }
  }, [user?.addresses])

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

  // 🧩 Xử lý sử dụng thông tin cá nhân làm địa chỉ giao hàng
  const handleUsePersonalInfo = () => {
    const personalInfo = {
      name: user?.data?.name || user?.name,
      phone: user?.data?.phone || user?.phone,
      address: user?.data?.address || user?.address,
      city: user?.data?.city || user?.city,
    };

    // Kiểm tra xem thông tin cá nhân có đủ không
    if (!personalInfo.name || !personalInfo.phone || !personalInfo.address || !personalInfo.city) {
      message.error('Thông tin cá nhân chưa đầy đủ. Vui lòng cập nhật thông tin cá nhân trước.');
      setIsAddressSelectorOpen(false);
      setIsOpenModalUpdateInfo(true);
      return;
    }

    // Tạo địa chỉ tạm từ thông tin cá nhân
    const tempAddress = {
      _id: 'personal-info', // ID đặc biệt để phân biệt
      ...personalInfo,
      isDefault: false,
      isPersonalInfo: true // Thêm flag để biết đây là thông tin cá nhân
    };

    setSelectedAddress(tempAddress);
    setIsAddressSelectorOpen(false);
    message.success('Đã sử dụng thông tin cá nhân làm địa chỉ giao hàng!');
  };

  // 🧩 Khi nhấn "Mua hàng"
  const handleAddCard = () => {
    if (!order?.orderItems?.length) {
      message.error('Giỏ hàng trống!');
    } else if (listChecked.length === 0) {
      message.error('Vui lòng chọn sản phẩm trước khi mua hàng!');
    } else if (!(selectedAddress || defaultAddress)) {
      setIsAddressSelectorOpen(true)
      fetchAddresses()
    } else {
      const selectedItems = order?.orderItems?.filter(item =>
        listChecked.includes(item.product)
      );
      dispatch(selectedOrder({ listChecked }));
      navigate('/payment', {
        state: {
          orders: selectedItems,
          address: selectedAddress || defaultAddress
        },
      });
    }
  };

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({ ...stateUserDetails, [e.target.name]: e.target.value })
  }

  // Open address selector when available; fallback to legacy update modal
  const handleChangeAddress = () => {
    if (typeof setIsAddressSelectorOpen === 'function') {
      setIsAddressSelectorOpen(true)
      if (typeof fetchAddresses === 'function') fetchAddresses()
      return
    }
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
  // Determine default address for user (prefers addresses array default, otherwise fallback to user.address)
  const defaultAddress = useMemo(() => {
    // prefer locally-fetched addresses (keeps UI responsive after changes)
    const localDefault = (addresses || []).find(a => a.isDefault)
    if (localDefault) return localDefault

    // fallback to any addresses on user from redux
    const defaultAddr = (user?.addresses || []).find(a => a.isDefault)
    if (defaultAddr) return defaultAddr

    // final fallback - legacy single address fields
    if (user?.address || user?.city || user?.phone || user?.name) {
      return {
        _id: 'personal-info',
        name: user?.name,
        phone: user?.phone,
        address: user?.address,
        city: user?.city,
        isPersonalInfo: true
      }
    }
    return null
  }, [user, addresses])

  const DeliveryAddressComponent = () => {
    const display = selectedAddress || defaultAddress

    // Kiểm tra xem có phải là thông tin cá nhân không
    const isPersonalInfo = display?._id === 'personal-info' || display?.isPersonalInfo;

    return (
      <WrapperInfo
        style={{ cursor: 'pointer' }}
        onClick={handleChangeAddress}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '16px', fontWeight: '600' }}>Địa chỉ giao hàng</span>
          <span style={{ color: '#1890ff', fontSize: '14px' }}>Thay đổi</span>
        </div>
        <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
          <div>
            <strong>{display?.name || 'Chưa có'}</strong> | {display?.phone || 'Chưa có'}
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
          <div>{display?.address && display?.city ? `${display.address}, ${display.city}` : 'Chưa có địa chỉ'}</div>
        </div>
      </WrapperInfo>
    )
  }

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

      {/* Address selector modal */}

      {/* ADDRESS SELECTOR MODAL */}
      <ModalComponent
        title="Chọn địa chỉ giao hàng"
        open={isAddressSelectorOpen}
        onCancel={() => setIsAddressSelectorOpen(false)}
        width={screens.xs ? '90%' : 800}
        footer={[
          <Button key="add-new" type="dashed" onClick={() => {
            setIsAddressSelectorOpen(false);
            setIsAddressEditOpen(true);
          }}>
            + Thêm địa chỉ mới
          </Button>
        ]}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 600 }}>Địa chỉ của bạn</div>
            <div>
              <Button type="primary" onClick={handleUsePersonalInfo}>
                Sử dụng thông tin cá nhân
              </Button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {addresses && addresses.length > 0 ? addresses.map(addr => (
              <div key={addr._id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 12,
                border: '1px solid #f0f0f0',
                borderRadius: 6,
                backgroundColor: selectedAddress?._id === addr._id ? '#f0f9ff' : 'white'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>
                    {addr.name}
                    {addr.isDefault && (
                      <span style={{ color: '#1890ff', marginLeft: 8 }}>(Mặc định)</span>
                    )}
                  </div>
                  <div style={{ color: '#666' }}>{addr.phone} • {addr.address}, {addr.city}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button
                    type={selectedAddress?._id === addr._id ? 'primary' : 'default'}
                    onClick={() => {
                      setSelectedAddress(addr);
                      setIsAddressSelectorOpen(false);
                      message.success(`Đã chọn địa chỉ: ${addr.name}`);
                    }}
                  >
                    {selectedAddress?._id === addr._id ? 'Đã chọn' : 'Chọn'}
                  </Button>
                  {!addr.isDefault && (
                    <Button onClick={async () => {
                      try {
                        await UserService.setDefaultAddress(user.id, addr._id, user.access_token)
                        message.success('Đã đặt làm địa chỉ mặc định')
                        const newAddrs = await fetchAddresses()
                        const updated = (newAddrs || []).find(a => a.isDefault)
                        setSelectedAddress(updated || null)
                        // refresh global user details
                        const details = await UserService.getDetailsUser(user.id, user.access_token)
                        dispatch(updateUser({ ...details.data, id: details.data._id, access_token: user.access_token }))
                      } catch (err) {
                        console.log('❌ Lỗi set default (OrderPage)', err)
                        message.error('Lỗi khi đặt mặc định')
                      }
                    }}>Đặt mặc định</Button>
                  )}
                  <Button onClick={() => {
                    // open edit modal
                    setEditingAddress(addr)
                    setAddrName2(addr.name || '')
                    setAddrPhone2(addr.phone || '')
                    setAddrAddress2(addr.address || '')
                    setAddrCity2(addr.city || '')
                    setAddrIsDefault2(!!addr.isDefault)
                    setIsAddressSelectorOpen(false)
                    setIsAddressEditOpen(true)
                  }}>Sửa</Button>
                  <Button danger onClick={async () => {
                    try {
                      await UserService.deleteAddress(user.id, addr._id, user.access_token)
                      message.success('Xóa địa chỉ thành công')
                      const newAddrs = await fetchAddresses()
                      // if deleted address was selected, clear or set to default
                      if (selectedAddress && selectedAddress._id === addr._id) {
                        const def = (newAddrs || []).find(a => a.isDefault)
                        setSelectedAddress(def || null)
                      }
                      const details = await UserService.getDetailsUser(user.id, user.access_token)
                      dispatch(updateUser({ ...details.data, id: details.data._id, access_token: user.access_token }))
                    } catch (err) {
                      console.log('❌ Lỗi xóa (OrderPage)', err)
                      message.error('Lỗi khi xóa địa chỉ')
                    }
                  }}>Xóa</Button>
                </div>
              </div>
            )) : <div>Chưa có địa chỉ nào</div>}
          </div>
        </div>
      </ModalComponent>

      {/* ADDRESS EDIT MODAL */}
      <ModalComponent
        title={editingAddress ? 'Sửa địa chỉ' : 'Thêm địa chỉ'}
        open={isAddressEditOpen}
        onCancel={() => { setIsAddressEditOpen(false); setEditingAddress(null) }}
        onOk={async () => {
          if (!user?.id) return message.error('User không hợp lệ')
          const payload = { name: addrName2, phone: addrPhone2, address: addrAddress2, city: addrCity2, isDefault: addrIsDefault2 }
          try {
            if (editingAddress) {
              await UserService.updateAddress(user.id, editingAddress._id, payload, user.access_token)
              message.success('Cập nhật địa chỉ thành công')
            } else {
              await UserService.addAddress(user.id, payload, user.access_token)
              message.success('Thêm địa chỉ thành công')
            }
            setIsAddressEditOpen(false)
            setEditingAddress(null)
            await fetchAddresses()
            const details = await UserService.getDetailsUser(user.id, user.access_token)
            dispatch(updateUser({ ...details.data, id: details.data._id, access_token: user.access_token }))
          } catch (err) {
            console.log('❌ Lỗi lưu địa chỉ (OrderPage)', err)
            message.error('Lỗi khi lưu địa chỉ')
          }
        }}
        width={screens.xs ? '90%' : 600}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <InputComponent value={addrName2} onChange={(e) => setAddrName2(e.target.value)} name="name" placeholder="Họ tên" />
          <InputComponent value={addrPhone2} onChange={(e) => setAddrPhone2(e.target.value)} name="phone" placeholder="Số điện thoại" />
          <InputComponent value={addrAddress2} onChange={(e) => setAddrAddress2(e.target.value)} name="address" placeholder="Địa chỉ" />
          <InputComponent value={addrCity2} onChange={(e) => setAddrCity2(e.target.value)} name="city" placeholder="Thành phố" />
        </div>
        <div style={{ marginTop: 12 }}>
          <Checkbox
            checked={addrIsDefault2}
            onChange={(e) => setAddrIsDefault2(e.target.checked)}
          >
            Đặt làm địa chỉ mặc định
          </Checkbox>
        </div>
      </ModalComponent>

      {/* MODAL CẬP NHẬT THÔNG TIN CÁ NHÂN */}
      <ModalComponent
        title="Cập nhật thông tin cá nhân"
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