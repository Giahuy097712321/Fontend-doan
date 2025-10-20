// AdminOrder.jsx
import { Button, Form, Select, Input, Empty } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import React, { useState, useMemo } from 'react';
import TableComponent from '../TableComponent/TableComponent';
import * as OrderService from '../../services/OrderService';
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../LoadingComponent/Loading';
import * as message from '../Message/Message';
import { useQuery } from '@tanstack/react-query';
import DrawerComponent from '../DrawerCompoenent/DrawerComponent';
import { useSelector } from 'react-redux';
import { parsePrice, converPrice } from '../../utils';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import {
    WrapperHeader,
    ChartContainer,
    ChartCard,
    ChartTitle,
    TableWrapper
} from './style';

const { Option } = Select;
const COLORS_DELIVERY = ['#0088FE', '#FF8042'];
const COLORS_PAYMENT = ['#00C49F', '#FFBB28', '#8884D8', '#FF6666', '#AA00FF'];

const AdminOrder = () => {
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [rowSelected, setRowSelected] = useState(null);
    const [form] = Form.useForm();
    const user = useSelector((state) => state?.user);

    const mutationUpdate = useMutationHooks(({ id, token, status, isPaid }) =>
        OrderService.updateOrder(id, { status, isPaid }, token)
    );

    const getAllOrders = async () => await OrderService.getAllOrder(user?.access_token);
    const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrders });
    const { isLoading: isLoadingOrders, data: orders } = queryOrder;

    const handleEditOrder = (orderId) => {
        const order = orders?.data?.find(o => o._id === orderId);
        if (!order) return;
        setRowSelected(order);
        setIsOpenDrawer(true);
        form.setFieldsValue({
            status: order.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng',
            isPaid: order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán',
        });
    };

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        form.resetFields();
        setRowSelected(null);
    };

    const onUpdateStatus = (values) => {
        mutationUpdate.mutate(
            {
                id: rowSelected._id,
                token: user?.access_token,
                status: values.status,
                isPaid: values.isPaid === 'Đã thanh toán',
            },
            {
                onSuccess: () => {
                    message.success('Cập nhật thành công!');
                    handleCloseDrawer();
                    queryOrder.refetch();
                },
                onError: () => message.error('Cập nhật thất bại!'),
            }
        );
    };

    const dataTable = Array.isArray(orders?.data)
        ? orders.data.map((item) => ({
            key: item._id,
            _id: item._id,
            fullName: item.shippingAddress?.fullName || '',
            phone: item.shippingAddress?.phone || '',
            address: item.shippingAddress?.address || '',
            status: item.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng',
            payment: item.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán',
            paymentMethod: item.paymentMethod || 'Khác',
            totalPrice: converPrice(item.totalPrice || 0),
            products: item.orderItems?.map((i) => `${i.name} x${i.amount}`).join(', '),
        }))
        : [];

    const totalRevenue = useMemo(() => {
        if (!orders?.data) return 0;
        return orders.data.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    }, [orders]);

    const deliveryChartData = useMemo(() => {
        if (!orders?.data) return [];
        const delivered = orders.data
            .filter(o => o.isDelivered)
            .reduce((sum, o) => sum + (o.totalPrice || 0), 0);
        const notDelivered = orders.data
            .filter(o => !o.isDelivered)
            .reduce((sum, o) => sum + (o.totalPrice || 0), 0);
        return [
            { name: 'Đã giao hàng', revenue: delivered },
            { name: 'Chưa giao hàng', revenue: notDelivered },
        ];
    }, [orders]);

    const paymentChartData = useMemo(() => {
        if (!orders?.data) return [];
        const grouped = {};
        orders.data.forEach(o => {
            const method = o.paymentMethod || 'Khác';
            grouped[method] = (grouped[method] || 0) + (o.totalPrice || 0);
        });
        return Object.keys(grouped).map(key => ({ name: key, revenue: grouped[key] }));
    }, [orders]);

    const columns = [
        { title: 'Tên khách hàng', dataIndex: 'fullName', sorter: (a, b) => a.fullName.localeCompare(b.fullName) },
        { title: 'Số điện thoại', dataIndex: 'phone' },
        { title: 'Địa chỉ', dataIndex: 'address', ellipsis: true },
        { title: 'Tổng tiền', dataIndex: 'totalPrice', sorter: (a, b) => parsePrice(a.totalPrice) - parsePrice(b.totalPrice) },
        { title: 'Trạng thái giao hàng', dataIndex: 'status' },
        { title: 'Trạng thái thanh toán', dataIndex: 'payment' },
        { title: 'Phương thức thanh toán', dataIndex: 'paymentMethod' },
        { title: 'Sản phẩm', dataIndex: 'products', ellipsis: true },
        {
            title: 'Hành động', render: (_, record) => (
                <EditOutlined style={{ color: 'orange', fontSize: '18px', cursor: 'pointer' }} onClick={() => handleEditOrder(record._id)} />
            )
        },
    ];

    return (
        <div>
            <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
            <ChartContainer>
                <ChartCard>
                    <ChartTitle>Doanh thu theo trạng thái giao hàng</ChartTitle>
                    <PieChart width={350} height={300}>
                        <Pie
                            dataKey="revenue"
                            data={deliveryChartData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            label={({ name, revenue }) => `${name}: ${revenue.toLocaleString('vi-VN')} VND`}
                            isAnimationActive
                        >
                            {deliveryChartData.map((entry, index) => (
                                <Cell key={`cell-delivery-${index}`} fill={COLORS_DELIVERY[index % COLORS_DELIVERY.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => value.toLocaleString('vi-VN') + ' VND'} />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ChartCard>

                <ChartCard>
                    <ChartTitle>Doanh thu theo phương thức thanh toán</ChartTitle>
                    <PieChart width={350} height={300}>
                        <Pie
                            dataKey="revenue"
                            data={paymentChartData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#82ca9d"
                            label={({ name, revenue }) => `${name}: ${revenue.toLocaleString('vi-VN')} VND`}
                            isAnimationActive
                        >
                            {paymentChartData.map((entry, index) => (
                                <Cell key={`cell-payment-${index}`} fill={COLORS_PAYMENT[index % COLORS_PAYMENT.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => value.toLocaleString('vi-VN') + ' VND'} />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ChartCard>
            </ChartContainer>

            <TableWrapper>
                {dataTable.length ? (
                    <TableComponent columns={columns} data={dataTable} isLoading={isLoadingOrders} />
                ) : (
                    <Empty description="Chưa có đơn hàng nào" />
                )}
            </TableWrapper>

            <DrawerComponent title="Chi tiết đơn hàng" isOpen={isOpenDrawer} onClose={handleCloseDrawer} width="500px">
                <Loading isLoading={mutationUpdate.isLoading}>
                    {rowSelected && (
                        <Form form={form} layout="vertical" onFinish={onUpdateStatus}>
                            <Form.Item label="Tên khách hàng"><Input value={rowSelected.shippingAddress?.fullName || ''} disabled /></Form.Item>
                            <Form.Item label="Số điện thoại"><Input value={rowSelected.shippingAddress?.phone || ''} disabled /></Form.Item>
                            <Form.Item label="Địa chỉ"><Input value={rowSelected.shippingAddress?.address || ''} disabled /></Form.Item>
                            <Form.Item label="Tổng tiền"><Input value={converPrice(rowSelected.totalPrice || 0)} disabled /></Form.Item>
                            <Form.Item label="Phương thức thanh toán"><Input value={rowSelected.paymentMethod || ''} disabled /></Form.Item>
                            <Form.Item label="Danh sách sản phẩm">
                                <Input.TextArea value={rowSelected.orderItems?.map(i => `${i.name} x${i.amount}`).join(', ')} autoSize={{ minRows: 3 }} disabled />
                            </Form.Item>
                            <Form.Item label="Trạng thái giao hàng" name="status" rules={[{ required: true }]}>
                                <Select>
                                    <Option value="Chưa giao hàng">Chưa giao hàng</Option>
                                    <Option value="Đã giao hàng">Đã giao hàng</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="Trạng thái thanh toán" name="isPaid" rules={[{ required: true }]}>
                                <Select>
                                    <Option value="Chưa thanh toán">Chưa thanh toán</Option>
                                    <Option value="Đã thanh toán">Đã thanh toán</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">Cập nhật</Button>
                            </Form.Item>
                        </Form>
                    )}
                </Loading>
            </DrawerComponent>
        </div>
    );
};

export default AdminOrder;
