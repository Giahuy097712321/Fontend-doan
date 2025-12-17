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
    ShoppingOutlined,
    ClockCircleOutlined,
    SyncOutlined,
    ExclamationCircleOutlined
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

    // Trả về trạng thái giao hàng ('pending'|'processing'|'shipping'|'delivered'|'cancelled')
    const getDeliveryStatus = (order) => {
        if (!order) return 'pending';
        if (order.deliveryStatus) return order.deliveryStatus;
        if (order.isCancelled) return 'cancelled';
        if (order.isDelivered) return 'delivered';
        return 'pending';
    }

    const getDeliveryStatusTag = (order) => {
        const status = getDeliveryStatus(order);
        const statusConfig = {
            'pending': { color: 'orange', icon: <ClockCircleOutlined />, text: 'Chờ xử lý' },
            'processing': { color: 'blue', icon: <SyncOutlined />, text: 'Đang xử lý' },
            'shipping': { color: 'purple', icon: <TruckOutlined />, text: 'Đang giao hàng' },
            'delivered': { color: 'green', icon: <CheckCircleOutlined />, text: 'Đã giao hàng' },
            'cancelled': { color: 'red', icon: <CloseCircleOutlined />, text: 'Đã hủy' }
        };

        const config = statusConfig[status] || statusConfig.pending;
        return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>;
    }

    // Trả về chuỗi trạng thái thanh toán: 'paid'|'unpaid'|'partial'|'refunded'
    const getPaymentStatus = (order) => {
        if (!order) return 'unpaid';
        if (order.paymentStatus) return order.paymentStatus;
        return order.isPaid ? 'paid' : 'unpaid';
    }

    // Trả về Tag cho trạng thái thanh toán, tương thích với MyOrderPage
    const getPaymentStatusTag = (order) => {
        const status = getPaymentStatus(order);

        // Đặc biệt: COD hiển thị rõ ràng 'Chưa thanh toán (COD)' hoặc 'Đã thanh toán (COD)'
        if (order?.paymentMethod === 'COD') {
            if (status === 'paid') return <Tag icon={<CheckCircleOutlined />} color="success">Đã thanh toán (COD)</Tag>;
            return <Tag icon={<CloseCircleOutlined />} color="error">Chưa thanh toán (COD)</Tag>;
        }

        const statusConfig = {
            'unpaid': { color: 'red', icon: <CloseCircleOutlined />, text: 'Chưa thanh toán' },
            'paid': { color: 'green', icon: <CheckCircleOutlined />, text: 'Đã thanh toán' },
            'partial': { color: 'orange', icon: <ExclamationCircleOutlined />, text: 'Thanh toán một phần' },
            'refunded': { color: 'blue', icon: <ShoppingOutlined />, text: 'Đã hoàn tiền' }
        };

        const config = statusConfig[status] || statusConfig.unpaid;
        return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>;
    }

    // Format phone so leading zeros are preserved and '84' country code is handled
    const formatPhone = (phone) => {
        if (!phone && phone !== 0) return ''
        let s = String(phone)
        // Remove spaces and common separators
        s = s.replace(/[^0-9+]/g, '')
        // If starts with +84 or 84, convert to starting 0
        if (s.startsWith('+84')) s = '0' + s.slice(3)
        else if (s.startsWith('84') && s.length > 2) s = '0' + s.slice(2)
        // If it's 9 digits (missing leading zero), add it
        if (s.length === 9) s = '0' + s
        return s
    }

    // Hàm lấy thông tin sản phẩm - QUAN TRỌNG
    const getProductInfo = (item) => {
        // Trường hợp 1: Sản phẩm đã bị xóa nhưng vẫn có thông tin trong orderItems
        // Giống như trong OrderPage, item có thể có các thuộc tính trực tiếp
        if (item.name) {
            return {
                name: item.name,
                price: item.price || 0,
                discount: item.discount || 0,
                image: item.image || '/images/default-product.jpg',
                isDeleted: false
            };
        }

        // Trường hợp 2: Có thông tin product từ populate
        if (item.product && item.product.name) {
            return {
                name: item.product.name,
                price: item.product.price || 0,
                discount: item.product.discount || item.discount || 0,
                image: item.product.image || '/images/default-product.jpg',
                isDeleted: false
            };
        }

        // Trường hợp 3: Sản phẩm đã bị xóa hoàn toàn
        return {
            name: 'Sản phẩm đã ngừng kinh doanh',
            price: 0,
            discount: 0,
            image: '/images/product-deleted.png',
            isDeleted: true
        };
    }

    const calculateSubtotal = () => {
        return orderItems?.reduce((sum, item) => {
            const productInfo = getProductInfo(item);
            const price = productInfo.price || 0;
            const discount = productInfo.discount || 0;
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
                    {getPaymentStatusTag(orderDetails)}
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
                                <span>{formatPhone(shippingAddress?.phone)}</span>
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
                            <div className="info-item">
                                <strong>Trạng thái:</strong>
                                {getDeliveryStatusTag(orderDetails)}
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
                                {getPaymentStatusTag(orderDetails)}
                            </div>
                        </div>
                    </InfoCard>
                </InfoSection>

                {/* Products Section - SỬA PHẦN NÀY */}
                <ProductSection>
                    <ProductCard>
                        <div className="card-header">
                            <h3>Danh sách sản phẩm</h3>
                            <span className="product-count">{orderItems?.length} sản phẩm</span>
                        </div>
                        <div className="products-list">
                            {orderItems?.map((item, index) => {
                                // Lấy thông tin sản phẩm theo cách giống OrderPage
                                const productInfo = getProductInfo(item);
                                const price = productInfo.price;
                                const discount = productInfo.discount;
                                const priceAfterDiscount = price - (price * discount) / 100;
                                const amount = item?.amount || 1;
                                const totalItemPrice = priceAfterDiscount * amount;

                                return (
                                    <ProductItem key={index}>
                                        <div className="product-info">
                                            <img
                                                src={productInfo.image}
                                                alt={productInfo.name}
                                                className="product-image"
                                                onError={(e) => {
                                                    e.target.src = '/images/default-product.jpg';
                                                }}
                                            />
                                            <div className="product-details">
                                                <div className="product-name">
                                                    {productInfo.name}
                                                    {productInfo.isDeleted && (
                                                        <Tag
                                                            color="default"
                                                            style={{
                                                                marginLeft: '8px',
                                                                fontSize: '12px'
                                                            }}
                                                        >
                                                            Đã ngừng kinh doanh
                                                        </Tag>
                                                    )}
                                                </div>
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
                                            {price > 0 && discount > 0 && (
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