// src/pages/MyOrderPage/MyOrderPage.jsx
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as OrderService from './../../services/OrderService';
import * as ProductService from './../../services/ProductService';
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
import { Card, Tag, Divider, Empty, Alert, Modal, Tooltip, Steps, Button } from 'antd';
import {
    ShoppingOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
    EyeOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    InfoCircleOutlined,
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

    // Cache để lưu thông tin sản phẩm đã bị xóa
    const [deletedProductIds, setDeletedProductIds] = useState([]);
    // Cache để lưu thông tin sản phẩm còn tồn tại
    const [productCache, setProductCache] = useState({});
    // Để lưu trạng thái loading khi kiểm tra sản phẩm
    const [checkingProducts, setCheckingProducts] = useState({});

    // Normalize a product identifier
    const normalizeProductId = (raw) => {
        if (!raw && raw !== 0) return null;
        if (typeof raw === 'string') return raw;
        if (typeof raw === 'number') return String(raw);
        if (typeof raw === 'object') {
            // Kiểm tra nếu object có property _id hoặc id
            return raw?._id || raw?.id || null;
        }
        return null;
    };

    // Hàm kiểm tra sản phẩm có tồn tại không
    const checkProductExists = async (productId) => {
        if (!productId) return false;

        // Kiểm tra trong cache trước
        if (deletedProductIds.includes(productId)) {
            return false;
        }

        if (productCache[productId]) {
            return true;
        }

        // Đánh dấu đang kiểm tra
        setCheckingProducts(prev => ({ ...prev, [productId]: true }));

        try {
            const res = await ProductService.getDetailsProduct(productId);

            // Nếu API trả về thành công và có data
            if (res?.data) {
                setProductCache(prev => ({ ...prev, [productId]: res.data }));
                return true;
            }
            return false;
        } catch (err) {
            // Nếu lỗi 404, 500 hoặc sản phẩm không tồn tại
            if (err?.response?.status === 404 || err?.response?.status === 500 || err?.response?.data?.message?.includes('not found')) {
                setDeletedProductIds(prev => [...prev, productId]);
                return false;
            }
            return false;
        } finally {
            setCheckingProducts(prev => {
                const newState = { ...prev };
                delete newState[productId];
                return newState;
            });
        }
    };

    // Hàm xử lý click vào sản phẩm (xem nhanh)
    const handleOpenProductModal = async (rawProduct) => {
        const id = normalizeProductId(rawProduct);
        if (!id) {
            message.error('Sản phẩm không hợp lệ');
            return;
        }

        // Kiểm tra trong cache trước
        if (deletedProductIds.includes(id)) {
            showDeletedProductModal();
            return;
        }

        // Kiểm tra sản phẩm có tồn tại không
        const exists = await checkProductExists(id);
        if (exists) {
            // Nếu sản phẩm tồn tại, điều hướng đến trang chi tiết
            navigate(`/product-details/${id}`);
        } else {
            showDeletedProductModal();
        }
    };

    // Hàm hiển thị modal sản phẩm đã xóa
    const showDeletedProductModal = () => {
        Modal.warning({
            title: 'Sản phẩm không khả dụng',
            content: (
                <div style={{ padding: '20px 0' }}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <ExclamationCircleOutlined style={{ fontSize: '48px', color: '#faad14' }} />
                    </div>
                    <h3 style={{ color: '#faad14', textAlign: 'center' }}>Sản phẩm đã ngừng bán</h3>
                    <p style={{ textAlign: 'center', color: '#666' }}>
                        Sản phẩm này đã bị gỡ bỏ hoặc ngừng kinh doanh.
                    </p>
                    <p style={{ textAlign: 'center', color: '#999', fontSize: '14px' }}>
                        Bạn vẫn có thể xem thông tin đơn hàng nhưng không thể xem chi tiết sản phẩm.
                    </p>
                </div>
            ),
            okText: 'Đã hiểu',
            okType: 'default'
        });
    };

    // Hàm xử lý click nút đánh giá
    const handleRateClick = async (rawProduct) => {
        const id = normalizeProductId(rawProduct);
        if (!id) {
            message.error('Sản phẩm không hợp lệ');
            return;
        }

        // Kiểm tra trong cache trước
        if (deletedProductIds.includes(id)) {
            showCannotRateModal();
            return;
        }

        // Kiểm tra sản phẩm có tồn tại không
        const exists = await checkProductExists(id);
        if (exists) {
            // Điều hướng đến trang chi tiết sản phẩm với tab comments
            navigate(`/product-details/${id}`, {
                state: {
                    activeTab: 'comments'
                }
            });
        } else {
            showCannotRateModal();
        }
    };

    // Hàm hiển thị modal không thể đánh giá
    const showCannotRateModal = () => {
        Modal.warning({
            title: 'Không thể đánh giá',
            content: (
                <div style={{ padding: '20px 0' }}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <CloseCircleOutlined style={{ fontSize: '48px', color: '#ff4d4f' }} />
                    </div>
                    <h3 style={{ color: '#ff4d4f', textAlign: 'center' }}>Sản phẩm đã ngừng bán</h3>
                    <p style={{ textAlign: 'center', color: '#666' }}>
                        Không thể đánh giá sản phẩm đã bị gỡ bỏ.
                    </p>
                    <p style={{ textAlign: 'center', color: '#999', fontSize: '14px' }}>
                        Sản phẩm này đã không còn được bán trên hệ thống.
                    </p>
                </div>
            ),
            okText: 'Đã hiểu',
            okType: 'default'
        });
    };

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

    // Mutation mua lại đơn hàng
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

    // Hàm lấy trạng thái thanh toán
    const getPaymentStatus = (order) => {
        if (!order) return 'unpaid';

        // Ưu tiên dùng trạng thái mới
        if (order.paymentStatus) return order.paymentStatus;

        // Tương thích với trạng thái cũ
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

    // Xử lý mua lại đơn hàng
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

    const renderProduct = (items, order) => {
        if (!items || !Array.isArray(items)) return null;

        return items?.map((item, index) => {
            const quantity = item?.amount || item?.quantity || 1;
            const price = item?.price || item?.product?.price || 0;
            const discount = item?.discount || 0;
            const priceAfterDiscount = price - (price * discount) / 100;
            const totalItemPrice = priceAfterDiscount * quantity;

            // Lấy thông tin sản phẩm từ item
            const productInfo = item?.product || item || {};
            const productId = normalizeProductId(productInfo);

            // Kiểm tra xem sản phẩm có trong cache deleted không
            const isDeleted = productId ? deletedProductIds.includes(productId) : false;
            const isLoadingProduct = productId ? checkingProducts[productId] : false;

            // Lấy tên sản phẩm từ nhiều nguồn có thể
            const productName = item?.name || productInfo?.name || `Sản phẩm ${index + 1}`;
            // Lấy hình ảnh từ nhiều nguồn có thể
            const productImage = item?.image || productInfo?.image || '/default-product.jpg';

            return (
                <WrapperHeaderItem key={`${productId || item?._id || index}-${order?._id}`}>
                    <div
                        style={{
                            display: 'flex',
                            gap: 12,
                            alignItems: 'center',
                            cursor: isDeleted ? 'not-allowed' : 'pointer',
                            opacity: isDeleted ? 0.6 : 1
                        }}
                        onClick={() => !isDeleted && handleOpenProductModal(productInfo)}
                    >
                        <img
                            src={productImage}
                            alt={productName}
                            style={{
                                width: '80px',
                                height: '80px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '1px solid #f0f0f0',
                            }}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/80x80?text=Image+Not+Available';
                            }}
                        />
                        <WrapperProductInfo>
                            <div className="product-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {productName}
                                {isDeleted && (
                                    <Tag color="red" style={{ fontSize: '12px', margin: 0 }}>
                                        <CloseCircleOutlined /> Đã xóa
                                    </Tag>
                                )}
                                {isLoadingProduct && (
                                    <Tag color="blue" style={{ fontSize: '12px', margin: 0 }}>
                                        <SyncOutlined spin /> Đang kiểm tra...
                                    </Tag>
                                )}
                            </div>
                            <div className="product-details">
                                Số lượng: {quantity}
                                {discount > 0 && (
                                    <span className="discount">-{discount}%</span>
                                )}
                            </div>
                        </WrapperProductInfo>
                    </div>

                    <WrapperPriceInfo>
                        {discount > 0 && (
                            <div className="original-price">{convertPrice(price)}</div>
                        )}
                        <div className="final-price">{convertPrice(totalItemPrice)}</div>

                        {/* Nếu đơn hàng đã giao thì hiển thị nút Đánh giá cạnh mỗi sản phẩm */}
                        {getDeliveryStatus(order) === 'delivered' && (
                            <div style={{ marginTop: 8 }}>
                                <Button
                                    type="link"
                                    disabled={isDeleted || isLoadingProduct}
                                    loading={isLoadingProduct}
                                    onClick={(e) => {
                                        e.stopPropagation(); // Ngăn chặn sự kiện click từ parent
                                        handleRateClick(productInfo);
                                    }}
                                    style={{
                                        padding: '0',
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}
                                >
                                    {isDeleted ? (
                                        <>
                                            <CloseCircleOutlined />
                                            Không thể đánh giá
                                        </>
                                    ) : isLoadingProduct ? (
                                        <>
                                            <SyncOutlined spin />
                                            Đang kiểm tra...
                                        </>
                                    ) : (
                                        <>
                                            <CheckOutlined />
                                            Đánh giá sản phẩm
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}

                        {/* Nếu sản phẩm đã bị xóa/ngừng bán thì hiển thị thông báo */}
                        {isDeleted && (
                            <div style={{ marginTop: 8 }}>
                                <div style={{
                                    fontSize: '12px',
                                    color: '#ff4d4f',
                                    backgroundColor: '#fff2f0',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ffccc7'
                                }}>
                                    Sản phẩm đã ngừng bán
                                </div>
                            </div>
                        )}
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
                        <div style={{
                            marginTop: '8px',
                            fontSize: '14px',
                            color: '#666',
                            backgroundColor: '#f6ffed',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            border: '1px solid #b7eb8f'
                        }}>
                            <InfoCircleOutlined style={{ marginRight: '8px' }} />
                            Các sản phẩm đã ngừng bán vẫn được hiển thị trong đơn hàng để đảm bảo tính minh bạch.
                        </div>
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
                                            {renderProduct(order?.orderItems, order)}
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