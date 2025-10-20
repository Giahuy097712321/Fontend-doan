import React from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import * as OrderService from '../../services/OrderService'
import Loading from '../../components/LoadingComponent/Loading'
import {
    WrapperHeaderUser,
    WrapperInfoUser,
    WrapperLabel,
    WrapperContentInfo,
    WrapperStyleContent,
    WrapperProductItem,
    WrapperPrice,
    WrapperTotalPrice,
} from './style' // nếu bạn có file style riêng

const DetailOrderPage = () => {
    const params = useParams()
    const location = useLocation()
    const { state } = location
    const { id } = params

    const fetchDetailsOrder = async () => {
        const res = await OrderService.getDetailsOrder(id, state?.token)
        return res.data
    }

    const { isLoading, data: orderDetails } = useQuery({
        queryKey: ['order-details', id],
        queryFn: fetchDetailsOrder,
        enabled: !!(id && state?.token)
    })

    if (isLoading) return <Loading />

    if (!orderDetails) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                Không tìm thấy đơn hàng.
            </div>
        )
    }
    console.log('🔥 orderDetails:', orderDetails)

    const { shippingAddress, orderItems, totalPrice, shippingPrice } = orderDetails

    return (
        <div style={{ width: '100%', background: '#f5f5fa', minHeight: '100vh', paddingBottom: '50px' }}>
            <div style={{ width: '1270px', margin: '0 auto', paddingTop: '20px' }}>
                <h4 style={{ marginBottom: '20px' }}>Chi tiết đơn hàng #{id}</h4>

                {/* --- Thông tin giao hàng --- */}
                <WrapperHeaderUser>
                    <WrapperInfoUser>
                        <WrapperLabel>Địa chỉ người nhận</WrapperLabel>
                        <WrapperContentInfo>
                            <div className='name-info'>{shippingAddress?.fullName}</div>
                            <div className='address-info'>
                                <span>Địa chỉ: </span>{`${shippingAddress?.address}, ${shippingAddress?.city}`}
                            </div>
                            <div className='phone-info'>
                                <span>Điện thoại: </span>{shippingAddress?.phone}
                            </div>
                        </WrapperContentInfo>
                    </WrapperInfoUser>

                    <WrapperInfoUser>
                        <WrapperLabel>Hình thức giao hàng</WrapperLabel>
                        <WrapperContentInfo>
                            <div className='delivery-info'>
                                <span className='name-delivery'>
                                    {orderDetails?.delivery || 'Chưa có thông tin'}
                                </span>{' '}
                                {orderDetails?.delivery === 'FAST'
                                    ? 'Giao hàng tiết kiệm'
                                    : orderDetails?.delivery === 'GO_JEK'
                                        ? 'Giao hàng nhanh'
                                        : ''}
                            </div>
                            <div className='delivery-fee'>
                                <span>Phí giao hàng: </span>
                                {shippingPrice ? `${shippingPrice.toLocaleString()} ₫` : 'Miễn phí'}
                            </div>
                        </WrapperContentInfo>
                    </WrapperInfoUser>


                    <WrapperInfoUser>
                        <WrapperLabel>Hình thức thanh toán</WrapperLabel>
                        <WrapperContentInfo>
                            <div className='payment-info'>
                                {orderDetails?.paymentMethod === 'Stripe' ? 'Thanh toán online (Stripe)' : 'Thanh toán khi nhận hàng'}
                            </div>
                            <div className='status-payment' style={{ color: orderDetails?.isPaid ? 'green' : 'red', fontWeight: 600 }}>
                                {orderDetails?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                            </div>
                        </WrapperContentInfo>
                    </WrapperInfoUser>

                </WrapperHeaderUser>

                {/* --- Danh sách sản phẩm --- */}
                {/* --- Danh sách sản phẩm --- */}
                <WrapperStyleContent>
                    {orderItems?.map((item, index) => {
                        const price = item?.product?.price || 0;
                        const discount = item?.discount || 0; // % giảm giá
                        const priceAfterDiscount = price - (price * discount) / 100;
                        const amount = item?.amount || 1;
                        const totalItemPrice = priceAfterDiscount * amount;

                        return (
                            <WrapperProductItem key={index}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <img
                                        src={item?.product?.image}
                                        alt={item?.product?.name}
                                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: '500' }}>{item?.product?.name}</div>
                                        <div style={{ fontSize: '14px', color: '#666' }}>
                                            Số lượng: <strong>{amount}</strong>
                                            {discount > 0 && (
                                                <span style={{ color: 'rgb(255, 66, 78)', marginLeft: '8px' }}>
                                                    -{discount}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <WrapperPrice>{price.toLocaleString()} ₫</WrapperPrice>
                                <WrapperPrice>{totalItemPrice.toLocaleString()} ₫</WrapperPrice>
                            </WrapperProductItem>
                        );
                    })}
                </WrapperStyleContent>

                {/* --- Tổng tiền --- */}
                <WrapperTotalPrice>
                    <div>
                        Tạm tính: {
                            orderItems?.reduce((sum, item) => {
                                const price = item?.product?.price || 0;
                                const discount = item?.discount || 0;
                                const priceAfterDiscount = price - (price * discount) / 100;
                                return sum + priceAfterDiscount * (item?.amount || 1);
                            }, 0).toLocaleString()
                        } ₫
                    </div>

                    <div>
                        Phí vận chuyển: {shippingPrice ? `${shippingPrice.toLocaleString()} ₫` : 'Miễn phí'}
                    </div>

                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ee4d2d' }}>
                        Tổng cộng: {(
                            orderItems?.reduce((sum, item) => {
                                const price = item?.product?.price || 0;
                                const discount = item?.discount || 0;
                                const priceAfterDiscount = price - (price * discount) / 100;
                                return sum + priceAfterDiscount * (item?.amount || 1);
                            }, 0) + (shippingPrice || 0)
                        ).toLocaleString()} ₫
                    </div>
                </WrapperTotalPrice>


            </div>
        </div>
    )
}

export default DetailOrderPage
