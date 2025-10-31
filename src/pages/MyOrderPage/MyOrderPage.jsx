import React from 'react';
import { useQuery } from '@tanstack/react-query';
import * as OrderService from './../../services/OrderService';
import { useSelector } from 'react-redux';
import Loading from './../../components/LoadingComponent/Loading';
import {
    WrapperContainer,
    WrapperListOrder,
    WrapperItemOrder,
    WrapperHeaderItem,
    WrapperFooterItem,
    WrapperOrderHeader,
    WrapperProductInfo,
    WrapperPriceInfo,
    WrapperActionButtons,
    EmptyOrder
} from './style';
import ButtonComponent from './../../components/ButtonComponent/ButtonComponent';
import { useNavigate } from 'react-router-dom';
import { useMutationHooks } from './../../hooks/useMutationHook';
import * as message from '../../components/Message/Message';
import { useEffect } from 'react';
import { Card, Tag, Divider, Empty } from 'antd';
import {
    ShoppingOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
    EyeOutlined,
    DeleteOutlined
} from '@ant-design/icons';

const convertPrice = (num) => {
    if (!num || isNaN(num)) return '0 VND';
    return num.toLocaleString('vi-VN') + ' VND';
};

const MyOrderPage = () => {
    const user = useSelector((state) => state.user);

    const fetchMyOrder = async () => {
        const res = await OrderService.getOrderbyUserId(user?.id, user?.token);
        if (Array.isArray(res?.data)) return res.data;
        if (res?.data && Array.isArray(res.data.orders)) return res.data.orders;
        return [];
    };

    const queryOrder = useQuery({
        queryKey: ['orders'],
        queryFn: fetchMyOrder,
        enabled: !!(user?.id && user?.access_token),
    });

    const { isLoading, data } = queryOrder;
    const navigate = useNavigate();

    const handleDetailsOrder = (orderId) => {
        navigate(`/details-order/${orderId}`, {
            state: {
                token: user?.access_token
            }
        });
    };

    const mutation = useMutationHooks(async (data) => {
        const { id, token, orderItems } = data;
        const res = await OrderService.cancelOrder(id, token, orderItems);
        return res;
    });

    const handleCancelOrder = (order) => {
        if (window.confirm('Bạn có chắc muốn hủy đơn hàng này không?')) {
            mutation.mutate(
                { id: order._id, token: user?.access_token, orderItems: order?.orderItems },
                { onSuccess: () => queryOrder.refetch() }
            );
        }
    };

    const { isLoading: isLoadingCancel, isSuccess: isSuccessCancel, isError: isErrorCancel, data: dataCancel } = mutation;

    useEffect(() => {
        if (isSuccessCancel && dataCancel?.status === 'OK') {
            message.success('Hủy đơn hàng thành công!');
        } else if (isErrorCancel) {
            message.error('Hủy đơn hàng thất bại!');
        }
    }, [isSuccessCancel, dataCancel, isErrorCancel]);

    const getStatusTag = (order) => {
        if (order.isDelivered) {
            return <Tag icon={<CheckCircleOutlined />} color="success">Đã giao hàng</Tag>;
        } else if (order.isPaid) {
            return <Tag icon={<ClockCircleOutlined />} color="processing">Đang giao hàng</Tag>;
        } else {
            return <Tag icon={<ClockCircleOutlined />} color="default">Chờ xử lý</Tag>;
        }
    };

    const getPaymentTag = (order) => {
        return order.isPaid ?
            <Tag icon={<CheckCircleOutlined />} color="green">Đã thanh toán</Tag> :
            <Tag icon={<CloseCircleOutlined />} color="red">Chưa thanh toán</Tag>;
    };

    const renderProduct = (items) => {
        return items?.map((item) => {
            const quantity = item?.amount || item?.quantity || 1;
            const price = item?.price || item?.product?.price || 0;
            const discount = item?.discount || 0;
            const priceAfterDiscount = price - (price * discount) / 100;
            const totalItemPrice = priceAfterDiscount * quantity;

            return (
                <WrapperHeaderItem key={item?.product?._id || item?._id || item?.name}>
                    <img
                        src={item?.image || '/default-product.jpg'}
                        alt={item?.name}
                        style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '1px solid #f0f0f0',
                        }}
                    />
                    <WrapperProductInfo>
                        <div className="product-name">{item?.name}</div>
                        <div className="product-details">
                            Số lượng: {quantity}
                            {discount > 0 && (
                                <span className="discount">-{discount}%</span>
                            )}
                        </div>
                    </WrapperProductInfo>
                    <WrapperPriceInfo>
                        {discount > 0 && (
                            <div className="original-price">{convertPrice(price)}</div>
                        )}
                        <div className="final-price">{convertPrice(totalItemPrice)}</div>
                    </WrapperPriceInfo>
                </WrapperHeaderItem>
            );
        });
    };

    return (
        <Loading isLoading={isLoading || isLoadingCancel}>
            <WrapperContainer>
                <div className="order-container">
                    <div className="page-header">
                        <ShoppingOutlined style={{ fontSize: '24px', color: '#1890ff', marginRight: '12px' }} />
                        <h1>Đơn hàng của tôi</h1>
                    </div>

                    {Array.isArray(data) && data.length > 0 ? (
                        <WrapperListOrder>
                            {data.map((order) => (
                                <Card
                                    key={order?._id}
                                    className="order-card"
                                    title={
                                        <WrapperOrderHeader>
                                            <div className="order-info">
                                                <div className="order-id">Mã đơn hàng: #{order?._id?.slice(-8)?.toUpperCase()}</div>
                                                <div className="order-date">
                                                    {order?.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : ''}
                                                </div>
                                            </div>
                                            <div className="order-status">
                                                {getStatusTag(order)}
                                                {getPaymentTag(order)}
                                            </div>
                                        </WrapperOrderHeader>
                                    }
                                    extra={<div className="total-amount">{convertPrice(order?.totalPrice)}</div>}
                                >
                                    {/* Danh sách sản phẩm */}
                                    <div className="products-list">
                                        {renderProduct(order?.orderItems)}
                                    </div>

                                    <Divider style={{ margin: '16px 0' }} />

                                    {/* Footer với nút hành động */}
                                    <WrapperFooterItem>
                                        <WrapperActionButtons>
                                            <ButtonComponent
                                                onClick={() => handleCancelOrder(order)}
                                                size={40}
                                                styleButton={{
                                                    height: '40px',
                                                    border: '1px solid #ff4d4f',
                                                    borderRadius: '6px',
                                                    background: '#fff',
                                                    padding: '0 20px'
                                                }}
                                                textButton={'Hủy đơn hàng'}
                                                styleTextButton={{
                                                    color: '#ff4d4f',
                                                    fontSize: '14px',
                                                    fontWeight: '500'
                                                }}
                                                icon={<DeleteOutlined />}
                                            />
                                            <ButtonComponent
                                                onClick={() => handleDetailsOrder(order?._id)}
                                                size={40}
                                                styleButton={{
                                                    height: '40px',
                                                    background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    padding: '0 20px'
                                                }}
                                                textButton={'Xem chi tiết'}
                                                styleTextButton={{
                                                    color: '#fff',
                                                    fontSize: '14px',
                                                    fontWeight: '500'
                                                }}
                                                icon={<EyeOutlined />}
                                            />
                                        </WrapperActionButtons>
                                    </WrapperFooterItem>
                                </Card>
                            ))}
                        </WrapperListOrder>
                    ) : (
                        <EmptyOrder>
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <div>
                                        <div style={{ fontSize: '16px', marginBottom: '8px', color: '#666' }}>
                                            Chưa có đơn hàng nào
                                        </div>
                                        <ButtonComponent
                                            onClick={() => navigate('/')}
                                            size={40}
                                            styleButton={{
                                                height: '44px',
                                                background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '0 32px',
                                                marginTop: '16px'
                                            }}
                                            styleTextButton={{
                                                color: '#fff',
                                                fontSize: '14px',
                                                fontWeight: '600'
                                            }}
                                            textButton={'Tiếp tục mua sắm'}
                                        />
                                    </div>
                                }
                            />
                        </EmptyOrder>
                    )}
                </div>
            </WrapperContainer>
        </Loading>
    );
};

export default MyOrderPage;