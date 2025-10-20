import React from 'react';
import { useQuery } from '@tanstack/react-query';
import * as OrderService from './../../services/OrderService';
import { useSelector } from 'react-redux';
import Loading from './../../components/LoadingComponent/Loading';
import {
    WrapperContainer,
    WrapperListOrder,
    WrapperItemOrder,
    WrapperStatus,
    WrapperHeaderItem,
    WrapperFooterItem,
} from './style';
import ButtonComponent from './../../components/ButtonComponent/ButtonComponent';
import { useNavigate } from 'react-router-dom';
import { useMutationHooks } from './../../hooks/useMutationHook';
import * as message from '../../components/Message/Message';
import { useEffect } from 'react';

const convertPrice = (num) => {
    if (!num || isNaN(num)) return '0 VND';
    return num.toLocaleString('vi-VN') + ' VND';
};

const MyOrderPage = () => {
    const user = useSelector((state) => state.user);

    const fetchMyOrder = async () => {
        const res = await OrderService.getOrderbyUserId(user?.id, user?.token);
        return res?.data || [];
    };

    const queryOrder = useQuery({
        queryKey: ['orders'],
        queryFn: fetchMyOrder,
        enabled: !!(user?.id && user?.access_token),
    });
    const { isLoading, data } = queryOrder;
    const navigate = useNavigate()
    const handleDetailsOrder = (orderId) => {
        navigate(`/details-order/${orderId}`, {
            state: {
                token: user?.access_token  // ✅ token từ Redux
            }
        })
    }
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


    const { isLoading: isLoadingCancel, isSuccess: isSuccessCancel, isError: isErrorCancel, data: dataCancel } = mutation
    useEffect(() => {
        if (isSuccessCancel && dataCancel?.status === 'OK') {
            message.success('Hủy đơn hàng thành công!')
        } else if (isErrorCancel) {
            message.error('Hủy đơn hàng thất bại!')
        }
    }, [isSuccessCancel, dataCancel, isErrorCancel])

    /* 🧩 Hiển thị danh sách sản phẩm trong đơn */
    const renderProduct = (items) => {
        return items?.map((item) => {
            const quantity = item?.amount || item?.quantity || 1;
            const price = item?.price || item?.product?.price || 0;
            const discount = item?.discount || 0; // % giảm giá
            const priceAfterDiscount = price - (price * discount) / 100;
            const totalItemPrice = priceAfterDiscount * quantity;

            return (
                <WrapperHeaderItem key={item?.product?._id || item?._id || item?.name}>
                    <img
                        src={item?.image || '/default-product.jpg'}
                        alt={item?.name}
                        style={{
                            width: '70px',
                            height: '70px',
                            objectFit: 'cover',
                            border: '1px solid rgb(238,238,238)',
                            padding: '2px',
                            borderRadius: '6px',
                        }}
                    />
                    <div
                        style={{
                            flex: 1,
                            marginLeft: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '14px',
                                fontWeight: 500,
                                color: '#242424',
                                marginBottom: '4px',
                            }}
                        >
                            {item?.name}
                        </div>
                        <div style={{ fontSize: '13px', color: '#666' }}>
                            Số lượng: {quantity}
                            {discount > 0 && (
                                <span style={{ color: 'rgb(255, 66, 78)', marginLeft: '8px' }}>
                                    -{discount}%
                                </span>
                            )}
                        </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '13px', color: '#242424' }}>
                            {convertPrice(price)}
                        </div>
                        {discount > 0 && (
                            <div style={{ fontSize: '13px', color: 'rgb(255, 66, 78)', fontWeight: 600 }}>
                                {convertPrice(totalItemPrice)}
                            </div>
                        )}
                        {!discount && (
                            <div style={{ fontSize: '13px', color: 'rgb(255, 66, 78)', fontWeight: 600 }}>
                                {convertPrice(totalItemPrice)}
                            </div>
                        )}
                    </div>
                </WrapperHeaderItem>
            );
        });
    };

    return (
        <Loading isLoading={isLoading}>
            <WrapperContainer>
                <div style={{ width: '1270px', margin: '0 auto' }}>
                    <h4 style={{ fontSize: '18px', marginBottom: '16px' }}>Đơn hàng của tôi</h4>
                    <WrapperListOrder>
                        {data?.map((order) => (
                            <WrapperItemOrder key={order?._id}>
                                {/* Trạng thái */}
                                <WrapperStatus>
                                    <div>
                                        <span style={{ color: 'rgb(255, 66, 78)' }}>Giao hàng: </span>
                                        {order.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng'}
                                    </div>
                                    <div>
                                        <span style={{ color: 'rgb(255, 66, 78)' }}>Thanh toán: </span>
                                        <span style={{ color: order.isPaid ? 'green' : 'red', fontWeight: 600 }}>
                                            {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                        </span>
                                    </div>
                                </WrapperStatus>


                                {/* Danh sách sản phẩm */}
                                {renderProduct(order?.orderItems)}

                                {/* Tổng tiền + Nút */}
                                <WrapperFooterItem>
                                    <div>
                                        <span style={{ color: 'rgb(255, 66, 78)' }}>Tổng tiền: </span>
                                        <span
                                            style={{
                                                fontSize: '13px',
                                                color: 'rgb(56, 56, 61)',
                                                fontWeight: 700,
                                            }}
                                        >
                                            {convertPrice(order?.totalPrice)}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <ButtonComponent
                                            onClick={() => handleCancelOrder(order)}
                                            size={40}
                                            styleButton={{
                                                height: '36px',
                                                border: '1px solid rgb(11, 116, 229)',
                                                borderRadius: '4px',
                                            }}
                                            textButton={'Hủy đơn hàng'}
                                            styleTextButton={{
                                                color: 'rgb(11, 116, 229)',
                                                fontSize: '14px',
                                            }}
                                        />
                                        <ButtonComponent
                                            onClick={() => handleDetailsOrder(order?._id)}

                                            size={40}
                                            styleButton={{
                                                height: '36px',
                                                border: '1px solid rgb(11, 116, 229)',
                                                borderRadius: '4px',
                                            }}
                                            textButton={'Xem chi tiết'}
                                            styleTextButton={{
                                                color: 'rgb(11, 116, 229)',
                                                fontSize: '14px',
                                            }}
                                        />
                                    </div>
                                </WrapperFooterItem>
                            </WrapperItemOrder>
                        ))}
                    </WrapperListOrder>
                </div>
            </WrapperContainer>
        </Loading>
    );
};

export default MyOrderPage;
