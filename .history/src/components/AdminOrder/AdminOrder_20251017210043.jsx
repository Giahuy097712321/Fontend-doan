import { Button, Form, Select } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { WrapperHeader } from './style';
import TableComponent from '../TableComponent/TableComponent';
import * as OrderService from '../../services/OrderService';
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../LoadingComponent/Loading';
import * as message from '../Message/Message';
import { useQuery } from '@tanstack/react-query';
import DrawerComponent from '../DrawerCompoenent/DrawerComponent';
import { useSelector } from 'react-redux';

const { Option } = Select;

const convertPrice = (num) => {
    if (!num || isNaN(num)) return '0 VND';
    return num.toLocaleString('vi-VN') + ' VND';
};

const AdminOrder = () => {
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [rowSelected, setRowSelected] = useState(null);
    const [form] = Form.useForm();
    const user = useSelector((state) => state?.user);

    const mutationUpdate = useMutationHooks(({ id, token, status }) =>
        OrderService.updateOrder(id, { status }, token)
    );

    const getAllOrders = async () => await OrderService.getAllOrder(user?.access_token);
    const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrders });
    const { isLoading: isLoadingOrders, data: orders } = queryOrder;

    const handleEditOrder = (order) => {
        setRowSelected(order);
        setIsOpenDrawer(true);
        form.setFieldsValue({
            status: order.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng',
        });
    };

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        form.resetFields();
        setRowSelected(null);
    };

    const onUpdateStatus = (values) => {
        mutationUpdate.mutate(
            { id: rowSelected._id, token: user?.access_token, status: values.status },
            {
                onSuccess: () => {
                    message.success('Cập nhật trạng thái thành công!');
                    handleCloseDrawer();
                    queryOrder.refetch();
                },
                onError: () => message.error('Cập nhật thất bại!'),
            }
        );
    };

    // Tạo dataTable cho bảng
    const dataTable = Array.isArray(orders?.data)
        ? orders.data.map((item) => ({
            key: item._id,
            _id: item._id,
            fullName: item.shippingAddress?.fullName || '',
            phone: item.shippingAddress?.phone || '',
            address: item.shippingAddress?.address || '',
            status: item.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng',
            payment: item.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán',
            paymentMethod: item.paymentMethod || '',
            totalPrice: convertPrice(item.totalPrice || 0),
            products: item.orderItems?.map((i) => `${i.name} x${i.amount}`).join(', '),
        }))
        : [];

    const columns = [
        { title: 'Tên khách hàng', dataIndex: 'fullName' },
        { title: 'Số điện thoại', dataIndex: 'phone' },
        { title: 'Địa chỉ', dataIndex: 'address' },
        { title: 'Tổng tiền', dataIndex: 'totalPrice' },
        { title: 'Trạng thái giao hàng', dataIndex: 'status' },
        { title: 'Trạng thái thanh toán', dataIndex: 'payment' },
        { title: 'Phương thức thanh toán', dataIndex: 'paymentMethod' },
        { title: 'Sản phẩm', dataIndex: 'products', ellipsis: true },
        {
            title: 'Hành động',
            render: (_, record) => (
                <EditOutlined
                    style={{ color: 'orange', fontSize: '18px', cursor: 'pointer' }}
                    onClick={() => handleEditOrder(record)}
                />
            ),
        },
    ];

    return (
        <div>
            <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
            <TableComponent columns={columns} data={dataTable} isLoading={isLoadingOrders} />

            <DrawerComponent
                title="Cập nhật trạng thái giao hàng"
                isOpen={isOpenDrawer}
                onClose={handleCloseDrawer}
                width="400px"
            >
                <Form form={form} layout="vertical" onFinish={onUpdateStatus}>
                    <Form.Item label="Trạng thái giao hàng" name="status" rules={[{ required: true }]}>
                        <Select>
                            <Option value="Chưa giao hàng">Chưa giao hàng</Option>
                            <Option value="Đã giao hàng">Đã giao hàng</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Form>
                <Loading isLoading={mutationUpdate.isLoading} />
            </DrawerComponent>
        </div>
    );
};

export default AdminOrder;
