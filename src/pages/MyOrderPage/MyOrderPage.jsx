import React, { useState, useEffect } from 'react';
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
import { Card, Tag, Divider, Empty, Alert, Modal, Tooltip, Steps } from 'antd';
import {
    ShoppingOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
    EyeOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    TruckOutlined,
    SyncOutlined,
    RedoOutlined,
    UndoOutlined,
    CheckOutlined
} from '@ant-design/icons';

const convertPrice = (num) => {
    if (!num || isNaN(num)) return '0 VND';
    return num.toLocaleString('vi-VN') + ' VND';
};

const MyOrderPage = () => {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [reorderLoading, setReorderLoading] = useState(null);
    const [cancelModal, setCancelModal] = useState({ visible: false, order: null });

    // Fetch orders
    const fetchMyOrder = async () => {
        try {
            const res = await OrderService.getOrderbyUserId(user?.id, user?.access_token);
            if (Array.isArray(res?.data)) return res.data;
            if (res?.data && Array.isArray(res.data.orders)) return res.data.orders;
            return [];
        } catch (error) {
            console.error('Lỗi khi lấy đơn hàng:', error);
            return [];
        }
    };

    const { isLoading, data, refetch } = useQuery({
        queryKey: ['orders'],
        queryFn: fetchMyOrder,
        enabled: !!(user?.id && user?.access_token),
    });

    const handleDetailsOrder = (orderId) => {
        navigate(`/details-order/${orderId}`, {
            state: {
                token: user?.access_token
            }
        });
    };

    // Mutation hủy đơn hàng
    const mutationCancel = useMutationHooks(async ({ id, token }) => {
        const res = await OrderService.cancelOrder(id, token);
        return res;
    });

    // Mutation mua lại đơn hàng - ĐÃ SỬA: Tự động kích hoạt lại đơn hàng
    const mutationReorder = useMutationHooks(async ({ id, token }) => {
        const res = await OrderService.reorder(id, token);
        return res;
    });

    // Hàm lấy trạng thái giao hàng
    const getDeliveryStatus = (order) => {
        if (!order) return 'pending';

        // Ưu tiên dùng trạng thái mới
        if (order.deliveryStatus) return order.deliveryStatus;

        // Tương thích với trạng thái cũ
        if (order.isCancelled) return 'cancelled';
        if (order.isDelivered) return 'delivered';
        return 'pending';
    };

    // Hàm lấy trạng thái thanh toán - FIX: COD luôn là 'unpaid'
    const getPaymentStatus = (order) => {
        if (!order) return 'unpaid';

        // Ưu tiên dùng trạng thái mới
        if (order.paymentStatus) return order.paymentStatus;

        // Tương thích với trạng thái cũ
        // COD luôn là chưa thanh toán, online là đã thanh toán
        return order.isPaid ? 'paid' : 'unpaid';
    };

    // Render trạng thái giao hàng
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

        return (
            <Tag color={config.color} icon={config.icon}>
                {config.text}
            </Tag>
        );
    };

    // Render trạng thái thanh toán
    const getPaymentStatusTag = (order) => {
        const status = getPaymentStatus(order);

        const statusConfig = {
            'unpaid': { color: 'red', icon: <CloseCircleOutlined />, text: 'Chưa thanh toán' },
            'paid': { color: 'green', icon: <CheckCircleOutlined />, text: 'Đã thanh toán' },
            'partial': { color: 'orange', icon: <ExclamationCircleOutlined />, text: 'Thanh toán một phần' },
            'refunded': { color: 'blue', icon: <UndoOutlined />, text: 'Đã hoàn tiền' }
        };

        const config = statusConfig[status] || statusConfig.unpaid;

        return (
            <Tag color={config.color} icon={config.icon}>
                {order.paymentMethod === 'COD' && status === 'unpaid'
                    ? 'Chưa thanh toán (COD)'
                    : order.paymentMethod === 'COD' && status === 'paid'
                        ? 'Đã thanh toán (COD)'
                        : config.text}
            </Tag>
        );
    };

    // Kiểm tra có thể hủy đơn hàng không
    const canCancelOrder = (order) => {
        const deliveryStatus = getDeliveryStatus(order);
        const paymentStatus = getPaymentStatus(order);

        // Không thể hủy nếu:
        if (deliveryStatus === 'delivered') return false;
        if (deliveryStatus === 'cancelled') return false;
        if (paymentStatus === 'refunded') return false;

        // Nếu đã thanh toán online thì không thể hủy
        if (paymentStatus === 'paid' && order.paymentMethod !== 'COD') return false;

        return true;
    };

    // Kiểm tra có thể mua lại không
    const canReorder = (order) => {
        const deliveryStatus = getDeliveryStatus(order);
        return deliveryStatus === 'cancelled';
    };

    // Xử lý click hủy đơn hàng
    const handleCancelClick = (order) => {
        setCancelModal({ visible: true, order });
    };

    // Xác nhận hủy đơn hàng
    const handleConfirmCancel = () => {
        if (!cancelModal.order) return;

        mutationCancel.mutate(
            {
                id: cancelModal.order._id,
                token: user?.access_token
            },
            {
                onSuccess: (data) => {
                    if (data?.status === 'OK') {
                        message.success('Hủy đơn hàng thành công!');
                        setCancelModal({ visible: false, order: null });
                        refetch();
                    } else {
                        message.error(data?.message || 'Hủy đơn hàng thất bại!');
                    }
                },
                onError: () => {
                    message.error('Có lỗi xảy ra khi hủy đơn hàng!');
                }
            }
        );
    };

    // Xử lý mua lại đơn hàng - ĐÃ SỬA: Tự động kích hoạt lại đơn hàng
    const handleReorder = (order) => {
        setReorderLoading(order._id);
        mutationReorder.mutate(
            {
                id: order._id,
                token: user?.access_token
            },
            {
                onSuccess: (data) => {
                    setReorderLoading(null);
                    if (data?.status === 'OK') {
                        message.success('Mua lại đơn hàng thành công! Đơn hàng đã được kích hoạt lại.');
                        refetch(); // Refresh danh sách
                    } else {
                        message.error(data?.message || 'Mua lại thất bại!');
                    }
                },
                onError: () => {
                    setReorderLoading(null);
                    message.error('Lỗi khi mua lại đơn hàng!');
                }
            }
        );
    };

    // Hiển thị timeline trạng thái
    const renderStatusTimeline = (order) => {
        const currentStatus = getDeliveryStatus(order);
        const statuses = ['pending', 'processing', 'shipping', 'delivered'];

        const currentIndex = statuses.indexOf(currentStatus);

        return (
            <div style={{ marginTop: '16px' }}>
                <Steps
                    size="small"
                    current={currentIndex >= 0 ? currentIndex : 0}
                    status={currentStatus === 'cancelled' ? 'error' : 'process'}
                >
                    <Steps.Step
                        title="Chờ xử lý"
                        icon={<ClockCircleOutlined />}
                        status={currentStatus === 'cancelled' ? 'error' :
                            currentIndex >= 0 ? 'finish' : 'wait'}
                    />
                    <Steps.Step
                        title="Đang xử lý"
                        icon={<SyncOutlined />}
                        status={currentStatus === 'cancelled' ? 'error' :
                            currentIndex >= 1 ? 'finish' : 'wait'}
                    />
                    <Steps.Step
                        title="Đang giao hàng"
                        icon={<TruckOutlined />}
                        status={currentStatus === 'cancelled' ? 'error' :
                            currentIndex >= 2 ? 'finish' : 'wait'}
                    />
                    <Steps.Step
                        title="Đã giao hàng"
                        icon={<CheckCircleOutlined />}
                        status={currentStatus === 'cancelled' ? 'error' :
                            currentIndex >= 3 ? 'finish' : 'wait'}
                    />
                </Steps>
            </div>
        );
    };

    const renderProduct = (items) => {
        if (!items || !Array.isArray(items)) return null;

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
        <Loading isLoading={isLoading || mutationCancel.isLoading || mutationReorder.isLoading}>
            <WrapperContainer>
                <div className="order-container">
                    <div className="page-header">
                        <ShoppingOutlined style={{ fontSize: '24px', color: '#1890ff', marginRight: '12px' }} />
                        <h1>Đơn hàng của tôi</h1>
                    </div>

                    {Array.isArray(data) && data.length > 0 ? (
                        <WrapperListOrder>
                            {data.map((order) => {
                                const canCancel = canCancelOrder(order);
                                const canReOrder = canReorder(order);

                                return (
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
                                                    {getDeliveryStatusTag(order)}
                                                    {getPaymentStatusTag(order)}
                                                </div>
                                            </WrapperOrderHeader>
                                        }
                                        extra={<div className="total-amount">{convertPrice(order?.totalPrice)}</div>}
                                    >
                                        {/* Timeline trạng thái */}
                                        {renderStatusTimeline(order)}

                                        {/* Hiển thị cảnh báo nếu không thể hủy */}
                                        {!canCancel && getDeliveryStatus(order) !== 'cancelled' && (
                                            <Alert
                                                message={
                                                    getPaymentStatus(order) === 'paid' && order.paymentMethod !== 'COD'
                                                        ? "Không thể hủy đơn hàng đã thanh toán online"
                                                        : getDeliveryStatus(order) === 'delivered'
                                                            ? "Không thể hủy đơn hàng đã giao"
                                                            : "Không thể hủy đơn hàng này"
                                                }
                                                type="warning"
                                                showIcon
                                                icon={<ExclamationCircleOutlined />}
                                                style={{
                                                    marginBottom: '16px',
                                                    borderRadius: '6px'
                                                }}
                                            />
                                        )}

                                        {/* Danh sách sản phẩm */}
                                        <div className="products-list">
                                            {renderProduct(order?.orderItems)}
                                        </div>

                                        <Divider style={{ margin: '16px 0' }} />

                                        {/* Thông tin thanh toán */}
                                        <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f6ffed', borderRadius: '6px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <strong>Phương thức thanh toán:</strong> {order.paymentMethod || 'COD'}
                                                    {order.paymentMethod === 'COD' && (
                                                        <Tag color="orange" style={{ marginLeft: '8px' }}>
                                                            Thanh toán khi nhận hàng
                                                        </Tag>
                                                    )}
                                                </div>
                                                <div>
                                                    <strong>Tổng tiền:</strong> {convertPrice(order?.totalPrice || 0)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer với nút hành động */}
                                        <WrapperFooterItem>
                                            <WrapperActionButtons>
                                                {/* Nút hủy đơn hàng - chỉ hiển thị khi có thể hủy */}
                                                {canCancel ? (
                                                    <Tooltip title="Hủy đơn hàng">
                                                        <ButtonComponent
                                                            onClick={() => handleCancelClick(order)}
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
                                                            disabled={mutationCancel.isLoading}
                                                        />
                                                    </Tooltip>
                                                ) : getDeliveryStatus(order) === 'cancelled' ? (
                                                    <Tooltip title="Đơn hàng này đã bị hủy">
                                                        <ButtonComponent
                                                            disabled
                                                            size={40}
                                                            styleButton={{
                                                                height: '40px',
                                                                border: '1px solid #d9d9d9',
                                                                borderRadius: '6px',
                                                                background: '#f5f5f5',
                                                                padding: '0 20px',
                                                                cursor: 'not-allowed'
                                                            }}
                                                            textButton={'Đã hủy'}
                                                            styleTextButton={{
                                                                color: '#bfbfbf',
                                                                fontSize: '14px',
                                                                fontWeight: '500'
                                                            }}
                                                            icon={<CloseCircleOutlined />}
                                                        />
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip title="Không thể hủy đơn hàng này">
                                                        <ButtonComponent
                                                            disabled
                                                            size={40}
                                                            styleButton={{
                                                                height: '40px',
                                                                border: '1px solid #d9d9d9',
                                                                borderRadius: '6px',
                                                                background: '#f5f5f5',
                                                                padding: '0 20px',
                                                                cursor: 'not-allowed'
                                                            }}
                                                            textButton={'Không thể hủy'}
                                                            styleTextButton={{
                                                                color: '#bfbfbf',
                                                                fontSize: '14px',
                                                                fontWeight: '500'
                                                            }}
                                                            icon={<ExclamationCircleOutlined />}
                                                        />
                                                    </Tooltip>
                                                )}

                                                {/* Nút mua lại - chỉ hiển thị cho đơn hàng đã hủy */}
                                                {canReOrder && (
                                                    <Tooltip title="Kích hoạt lại đơn hàng này">
                                                        <ButtonComponent
                                                            onClick={() => handleReorder(order)}
                                                            loading={reorderLoading === order._id}
                                                            size={40}
                                                            styleButton={{
                                                                height: '40px',
                                                                border: '1px solid #52c41a',
                                                                borderRadius: '6px',
                                                                background: '#f6ffed',
                                                                padding: '0 20px'
                                                            }}
                                                            textButton={'Kích hoạt lại'}
                                                            styleTextButton={{
                                                                color: '#52c41a',
                                                                fontSize: '14px',
                                                                fontWeight: '500'
                                                            }}
                                                            icon={<RedoOutlined />}
                                                            disabled={mutationReorder.isLoading}
                                                        />
                                                    </Tooltip>
                                                )}

                                                {/* Nút xem chi tiết */}
                                                <Tooltip title="Xem chi tiết đơn hàng">
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
                                                        textButton={'Chi tiết'}
                                                        styleTextButton={{
                                                            color: '#fff',
                                                            fontSize: '14px',
                                                            fontWeight: '500'
                                                        }}
                                                        icon={<EyeOutlined />}
                                                    />
                                                </Tooltip>
                                            </WrapperActionButtons>
                                        </WrapperFooterItem>
                                    </Card>
                                );
                            })}
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

            {/* Modal xác nhận hủy đơn hàng */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                        <span>Xác nhận hủy đơn hàng</span>
                    </div>
                }
                open={cancelModal.visible}
                onOk={handleConfirmCancel}
                onCancel={() => setCancelModal({ visible: false, order: null })}
                okText="Xác nhận hủy"
                cancelText="Quay lại"
                okButtonProps={{
                    danger: true,
                    loading: mutationCancel.isLoading
                }}
                cancelButtonProps={{ disabled: mutationCancel.isLoading }}
            >
                {cancelModal.order && (
                    <div style={{ padding: '20px 0' }}>
                        <p style={{ fontSize: '16px', marginBottom: '10px' }}>
                            Bạn có chắc chắn muốn hủy đơn hàng:
                        </p>

                        <div style={{
                            backgroundColor: '#fff2f0',
                            padding: '15px',
                            borderRadius: '6px',
                            marginBottom: '20px'
                        }}>
                            <p><strong>Mã đơn hàng:</strong> #{cancelModal.order._id?.slice(-8)?.toUpperCase()}</p>
                            <p><strong>Tổng tiền:</strong> {convertPrice(cancelModal.order.totalPrice || 0)}</p>
                            <p><strong>Trạng thái:</strong> {getDeliveryStatusTag(cancelModal.order)}</p>
                            <p><strong>Thanh toán:</strong> {getPaymentStatusTag(cancelModal.order)}</p>
                            <p><strong>Phương thức:</strong> {cancelModal.order.paymentMethod || 'COD'}</p>
                        </div>

                        <Alert
                            message="Lưu ý quan trọng"
                            description={
                                <ul style={{ margin: 0, paddingLeft: '15px' }}>
                                    <li>Hành động này không thể hoàn tác</li>
                                    <li>Sản phẩm sẽ được tự động trả lại kho</li>
                                    {getPaymentStatus(cancelModal.order) === 'paid' && cancelModal.order.paymentMethod !== 'COD' && (
                                        <li>Tiền sẽ được hoàn lại trong vòng 3-5 ngày làm việc</li>
                                    )}
                                </ul>
                            }
                            type="warning"
                            showIcon
                        />
                    </div>
                )}
            </Modal>
        </Loading>
    );
};

export default MyOrderPage;