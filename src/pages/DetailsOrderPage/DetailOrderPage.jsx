import React from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import * as OrderService from '../../services/OrderService'
import Loading from '../../components/LoadingComponent/Loading'
import {
    PageContainer,
    OrderHeader,
    InfoSection,
    ProductSection,
    PriceSection,
    InfoCard,
    ProductCard,
    PriceCard,
    ProductItem,
    PriceRow,
    StatusBadge
} from './style'

import { Tag, Divider } from 'antd'
import {
    UserOutlined,
    EnvironmentOutlined,
    PhoneOutlined,
    TruckOutlined,
    CreditCardOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ShoppingOutlined
} from '@ant-design/icons'

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

    const { shippingAddress, orderItems, shippingPrice } = orderDetails

    const getDeliveryText = (delivery) => {
        switch (delivery) {
            case 'FAST':
                return 'Giao hàng tiết kiệm'
            case 'GO_JEK':
                return 'Giao hàng nhanh'
            default:
                return 'Giao hàng tiêu chuẩn'
        }
    }

    const getPaymentStatus = (isPaid) => {
        return isPaid ?
            <Tag icon={<CheckCircleOutlined />} color="success">Đã thanh toán</Tag> :
            <Tag icon={<CloseCircleOutlined />} color="error">Chưa thanh toán</Tag>
    }

    const calculateSubtotal = () => {
        return orderItems?.reduce((sum, item) => {
            const price = item?.product?.price || 0;
            const discount = item?.discount || 0;
            const priceAfterDiscount = price - (price * discount) / 100;
            return sum + priceAfterDiscount * (item?.amount || 1);
        }, 0) || 0
    }

    const calculateTotal = () => {
        return calculateSubtotal() + (shippingPrice || 0)
    }

    return (
        <PageContainer>
            <div className="container">
                {/* Header */}
                <OrderHeader>
                    <div className="header-content">
                        <ShoppingOutlined className="header-icon" />
                        <div className="header-text">
                            <h1>Chi tiết đơn hàng</h1>
                            <div className="order-id">Mã đơn hàng: #{id?.slice(-8)?.toUpperCase()}</div>
                        </div>
                    </div>
                    {getPaymentStatus(orderDetails?.isPaid)}
                </OrderHeader>

                {/* Information Section */}
                <InfoSection>
                    <InfoCard>
                        <div className="card-header">
                            <UserOutlined className="card-icon" />
                            <h3>Thông tin người nhận</h3>
                        </div>
                        <div className="card-content">
                            <div className="info-item">
                                <strong>Họ tên:</strong>
                                <span>{shippingAddress?.fullName}</span>
                            </div>
                            <div className="info-item">
                                <strong>Điện thoại:</strong>
                                <span>{shippingAddress?.phone}</span>
                            </div>
                            <div className="info-item">
                                <strong>Địa chỉ:</strong>
                                <span>{shippingAddress?.address}, {shippingAddress?.city}</span>
                            </div>
                        </div>
                    </InfoCard>

                    <InfoCard>
                        <div className="card-header">
                            <TruckOutlined className="card-icon" />
                            <h3>Thông tin giao hàng</h3>
                        </div>
                        <div className="card-content">
                            <div className="info-item">
                                <strong>Phương thức:</strong>
                                <span>{getDeliveryText(orderDetails?.delivery)}</span>
                            </div>
                            <div className="info-item">
                                <strong>Phí vận chuyển:</strong>
                                <span className={shippingPrice ? 'price' : 'free'}>
                                    {shippingPrice ? `${shippingPrice.toLocaleString()} ₫` : 'Miễn phí'}
                                </span>
                            </div>
                        </div>
                    </InfoCard>

                    <InfoCard>
                        <div className="card-header">
                            <CreditCardOutlined className="card-icon" />
                            <h3>Thông tin thanh toán</h3>
                        </div>
                        <div className="card-content">
                            <div className="info-item">
                                <strong>Phương thức:</strong>
                                <span>
                                    {orderDetails?.paymentMethod === 'Stripe'
                                        ? 'Thanh toán online (Stripe)'
                                        : 'Thanh toán khi nhận hàng'
                                    }
                                </span>
                            </div>
                            <div className="info-item">
                                <strong>Trạng thái:</strong>
                                {getPaymentStatus(orderDetails?.isPaid)}
                            </div>
                        </div>
                    </InfoCard>
                </InfoSection>

                {/* Products Section */}
                <ProductSection>
                    <ProductCard>
                        <div className="card-header">
                            <h3>Danh sách sản phẩm</h3>
                            <span className="product-count">{orderItems?.length} sản phẩm</span>
                        </div>
                        <div className="products-list">
                            {orderItems?.map((item, index) => {
                                const price = item?.product?.price || 0;
                                const discount = item?.discount || 0;
                                const priceAfterDiscount = price - (price * discount) / 100;
                                const amount = item?.amount || 1;
                                const totalItemPrice = priceAfterDiscount * amount;

                                return (
                                    <ProductItem key={index}>
                                        <div className="product-info">
                                            <img
                                                src={item?.product?.image}
                                                alt={item?.product?.name}
                                                className="product-image"
                                            />
                                            <div className="product-details">
                                                <div className="product-name">{item?.product?.name}</div>
                                                <div className="product-meta">
                                                    <span className="quantity">Số lượng: {amount}</span>
                                                    {discount > 0 && (
                                                        <StatusBadge type="discount">
                                                            -{discount}%
                                                        </StatusBadge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="price-info">
                                            {discount > 0 && (
                                                <div className="original-price">
                                                    {price.toLocaleString()} ₫
                                                </div>
                                            )}
                                            <div className="current-price">
                                                {priceAfterDiscount.toLocaleString()} ₫
                                            </div>
                                            <div className="total-price">
                                                {totalItemPrice.toLocaleString()} ₫
                                            </div>
                                        </div>
                                    </ProductItem>
                                );
                            })}
                        </div>
                    </ProductCard>
                </ProductSection>

                {/* Price Summary Section */}
                <PriceSection>
                    <PriceCard>
                        <h3>Tổng thanh toán</h3>
                        <div className="price-details">
                            <PriceRow>
                                <span>Tạm tính:</span>
                                <span>{calculateSubtotal().toLocaleString()} ₫</span>
                            </PriceRow>
                            <PriceRow>
                                <span>Phí vận chuyển:</span>
                                <span className={shippingPrice ? 'price' : 'free'}>
                                    {shippingPrice ? `${shippingPrice.toLocaleString()} ₫` : 'Miễn phí'}
                                </span>
                            </PriceRow>
                            <Divider />
                            <PriceRow className="total">
                                <span>Tổng cộng:</span>
                                <span className="total-amount">
                                    {calculateTotal().toLocaleString()} ₫
                                </span>
                            </PriceRow>
                        </div>
                    </PriceCard>
                </PriceSection>
            </div>
        </PageContainer>
    )
}

export default DetailOrderPage