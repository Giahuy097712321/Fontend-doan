import { Button, Form } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { WrapperHeader } from './style';
import TableComponent from '../TableComponent/TableComponent';
import * as OrderService from '../../services/OrderService';
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../LoadingComponent/Loading';
import * as message from '../Message/Message';
import { useQuery } from '@tanstack/react-query';
import DrawerComponent from '../DrawerCompoenent/DrawerComponent';
import { useSelector } from 'react-redux';
import { converPrice } from '../../utils';
import InputComponent from '../InputComponent/InputComponent';

const AdminOrder = () => {
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [rowSelected, setRowSelected] = useState('');
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [form] = Form.useForm();
    const user = useSelector((state) => state?.user);

    const [stateOrderDetails, setStateOrderDetails] = useState({
        fullName: '',
        phone: '',
        address: '',
        totalPrice: 0,
        status: '',
        paymentMethod: '',
        delivery: '',
        orderItems: [],
    });

    // 🟢 Mutation update order
    const mutationUpdate = useMutationHooks((data) => {
        const { id, token, ...rests } = data;
        return OrderService.updateOrder(id, rests, token);
    });

    // 🟢 Fetch all orders
    const getAllOrders = async () => await OrderService.getAllOrder(user?.access_token);
    const queryOrder = useQuery({
        queryKey: ['orders'],
        queryFn: getAllOrders,
    });

    const { isLoading: isLoadingOrders, data: orders } = queryOrder;

    // 🟢 Khi click Edit
    const handleEditOrder = async (id) => {
        if (!id) {
            message.error("ID đơn hàng không hợp lệ!");
            return;
        }

        console.log("🔹 Click Edit, ID gửi API:", id);
        console.log("🔹 Token hiện tại:", user?.access_token);

        setIsOpenDrawer(true);
        setIsLoadingUpdate(true);
        try {
            const res = await OrderService.getDetailsOrder(id, user?.access_token);
            console.log("🔹 Kết quả API chi tiết đơn hàng:", res);

            const order = res?.data?.data;

            if (order) {
                const info = order.shippingAddress || {};
                setStateOrderDetails({
                    fullName: info.fullName || "",
                    phone: info.phone || "",
                    address: info.address || "",
                    totalPrice: order.totalPrice || 0,
                    status: order.isCancelled
                        ? "Đã hủy"
                        : order.isDelivered
                            ? "Đã giao hàng"
                            : order.isPaid
                                ? "Đã thanh toán"
                                : "Đang xử lý",
                    paymentMethod: order.paymentMethod || "",
                    delivery: order.delivery || "",
                    orderItems: order.orderItems || [],
                });

                form.setFieldsValue({
                    fullName: info.fullName,
                    phone: info.phone,
                    address: info.address,
                    totalPrice: order.totalPrice,
                    paymentMethod: order.paymentMethod,
                    delivery: order.delivery,
                    status: order.isCancelled
                        ? "Đã hủy"
                        : order.isDelivered
                            ? "Đã giao hàng"
                            : order.isPaid
                                ? "Đã thanh toán"
                                : "Đang xử lý",
                });

                setRowSelected(id);
            } else {
                message.error("Không tìm thấy đơn hàng!");
            }
        } catch (error) {
            console.error("❌ Lỗi khi lấy chi tiết đơn hàng:", error);
            message.error("Không thể lấy chi tiết đơn hàng");
        } finally {
            setIsLoadingUpdate(false);
        }
    };

    // 🟢 Cập nhật form mỗi khi state thay đổi
    useEffect(() => {
        form.setFieldsValue(stateOrderDetails);
    }, [stateOrderDetails, form]);

    // 🟢 Render action
    const renderAction = (record) => (
        <EditOutlined
            style={{ color: 'orange', fontSize: '20px', cursor: 'pointer' }}
            onClick={() => handleEditOrder(record._id)}
        />
    );

    // 🟢 Dữ liệu bảng
    const dataTable =
        orders?.data?.length > 0
            ? orders.data.map((item) => ({
                key: item._id,
                _id: item._id, // ✅ thêm ID
                fullName: item.shippingAddress?.fullName || '',
                phone: item.shippingAddress?.phone || '',
                address: item.shippingAddress?.address || '',
                paymentMethod: item.paymentMethod,
                delivery: item.delivery,
                totalPrice: converPrice(item.totalPrice),
                status: item.isCancelled
                    ? 'Đã hủy'
                    : item.isDelivered
                        ? 'Đã giao hàng'
                        : item.isPaid
                            ? 'Đã thanh toán'
                            : 'Đang xử lý',
            }))
            : [];

    // 🟢 Đóng Drawer
    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        form.resetFields();
        setStateOrderDetails({
            fullName: '',
            phone: '',
            address: '',
            totalPrice: 0,
            status: '',
            paymentMethod: '',
            delivery: '',
            orderItems: [],
        });
    };

    // 🟢 Khi nhấn nút cập nhật
    const onUpdateOrder = () => {
        mutationUpdate.mutate(
            { id: rowSelected, token: user?.access_token, ...stateOrderDetails },
            {
                onSuccess: () => {
                    message.success('Cập nhật đơn hàng thành công!');
                    handleCloseDrawer();
                    queryOrder.refetch();
                },
                onError: () => message.error('Cập nhật đơn hàng thất bại!'),
            }
        );
    };

    // 🟢 Xử lý khi gõ trong form
    const handleOnchangeDetails = (e) =>
        setStateOrderDetails({ ...stateOrderDetails, [e.target.name]: e.target.value });

    // 🟢 Cột bảng
    const columns = [
        { title: 'Tên khách hàng', dataIndex: 'fullName', sorter: (a, b) => a.fullName.length - b.fullName.length },
        { title: 'Số điện thoại', dataIndex: 'phone' },
        { title: 'Địa chỉ', dataIndex: 'address' },
        { title: 'Phương thức thanh toán', dataIndex: 'paymentMethod' },
        { title: 'Hình thức giao hàng', dataIndex: 'delivery' },
        { title: 'Tổng tiền', dataIndex: 'totalPrice' },
        { title: 'Trạng thái', dataIndex: 'status' },
        { title: 'Hành động', key: 'action', render: (_, record) => renderAction(record) },
    ];

    return (
        <div>
            <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
            <div style={{ marginTop: 20 }}>
                <TableComponent columns={columns} isLoading={isLoadingOrders} data={dataTable} />
            </div>

            {/* Drawer cập nhật đơn hàng */}
            <DrawerComponent
                title="Chi tiết đơn hàng"
                isOpen={isOpenDrawer}
                onClose={handleCloseDrawer}
                width="50%"
            >
                <Loading isLoading={isLoadingUpdate}>
                    <Form
                        name="order"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        onFinish={onUpdateOrder}
                        autoComplete="off"
                        form={form}
                    >
                        <Form.Item label="Tên khách hàng" name="fullName">
                            <InputComponent
                                value={stateOrderDetails.fullName}
                                onChange={handleOnchangeDetails}
                                name="fullName"
                            />
                        </Form.Item>
                        <Form.Item label="Số điện thoại" name="phone">
                            <InputComponent
                                value={stateOrderDetails.phone}
                                onChange={handleOnchangeDetails}
                                name="phone"
                            />
                        </Form.Item>
                        <Form.Item label="Địa chỉ" name="address">
                            <InputComponent
                                value={stateOrderDetails.address}
                                onChange={handleOnchangeDetails}
                                name="address"
                            />
                        </Form.Item>
                        <Form.Item label="Phương thức thanh toán" name="paymentMethod">
                            <InputComponent
                                value={stateOrderDetails.paymentMethod}
                                onChange={handleOnchangeDetails}
                                name="paymentMethod"
                            />
                        </Form.Item>
                        <Form.Item label="Hình thức giao hàng" name="delivery">
                            <InputComponent
                                value={stateOrderDetails.delivery}
                                onChange={handleOnchangeDetails}
                                name="delivery"
                            />
                        </Form.Item>
                        <Form.Item label="Trạng thái" name="status">
                            <InputComponent
                                value={stateOrderDetails.status}
                                onChange={handleOnchangeDetails}
                                name="status"
                            />
                        </Form.Item>

                        {/* Hiển thị danh sách sản phẩm */}
                        <Form.Item label="Sản phẩm">
                            {stateOrderDetails.orderItems && stateOrderDetails.orderItems.length > 0 ? (
                                <ul style={{ paddingLeft: 20 }}>
                                    {stateOrderDetails.orderItems.map((item, index) => (
                                        <li key={index}>
                                            {item.name} x {item.amount} - {converPrice(item.price || 0)}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <span>Không có sản phẩm</span>
                            )}
                        </Form.Item>

                        <Form.Item label="Tổng tiền" name="totalPrice">
                            <InputComponent
                                value={stateOrderDetails.totalPrice}
                                onChange={handleOnchangeDetails}
                                name="totalPrice"
                            />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Cập nhật
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </DrawerComponent>
        </div>
    );
};

export default AdminOrder;
