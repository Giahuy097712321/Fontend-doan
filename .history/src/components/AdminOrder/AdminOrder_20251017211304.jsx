import { Button, Form, Select, Input } from 'antd';
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

const convertPrice = (num) => (num?.toLocaleString('vi-VN') || '0') + ' VND';

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

    const handleEditOrder = (order) => {
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
            paymentMethod: item.paymentMethod || '',
            totalPrice: convertPrice(item.totalPrice || 0),
            products: item.orderItems?.map((i) => `${i.name} x${i.amount}`).join(', '),
        }))
        : [];

    const columns = [
        {
            title: 'Tên khách hàng',
            dataIndex: 'fullName',
            sorter: (a, b) => a.fullName.localeCompare(b.fullName),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',

        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            ellipsis: true,

        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            sorter: (a, b) => {
                const getNumber = (str) => Number(str.replace(/[^\d]/g, ''));
                return getNumber(a.totalPrice) - getNumber(b.totalPrice);
            },
        },
        {
            title: 'Trạng thái giao hàng',
            dataIndex: 'status',
            filters: [
                { text: 'Chưa giao hàng', value: 'Chưa giao hàng' },
                { text: 'Đã giao hàng', value: 'Đã giao hàng' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Trạng thái thanh toán',
            dataIndex: 'payment',
            filters: [
                { text: 'Chưa thanh toán', value: 'Chưa thanh toán' },
                { text: 'Đã thanh toán', value: 'Đã thanh toán' },
            ],
            onFilter: (value, record) => record.payment === value,
        },
        {
            title: 'Phương thức thanh toán',
            dataIndex: 'paymentMethod',
            ellipsis: true,
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'products',
            ellipsis: true,
        },
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
                title="Chi tiết đơn hàng"
                isOpen={isOpenDrawer}
                onClose={handleCloseDrawer}
                width="500px"
            >
                <Loading isLoading={mutationUpdate.isLoading}>
                    {rowSelected && (
                        <Form form={form} layout="vertical" onFinish={onUpdateStatus}>
                            <Form.Item label="Tên khách hàng">
                                <Input value={rowSelected.fullName} disabled />
                            </Form.Item>
                            <Form.Item label="Số điện thoại">
                                <Input value={rowSelected.phone} disabled />
                            </Form.Item>
                            <Form.Item label="Địa chỉ">
                                <Input value={rowSelected.address} disabled />
                            </Form.Item>
                            <Form.Item label="Tổng tiền">
                                <Input value={rowSelected.totalPrice} disabled />
                            </Form.Item>
                            <Form.Item label="Phương thức thanh toán">
                                <Input value={rowSelected.paymentMethod} disabled />
                            </Form.Item>
                            <Form.Item label="Danh sách sản phẩm">
                                <Input.TextArea value={rowSelected.products} autoSize={{ minRows: 3 }} disabled />
                            </Form.Item>

                            {/* Chỉ cho phép cập nhật */}
                            <Form.Item
                                label="Trạng thái giao hàng"
                                name="status"
                                rules={[{ required: true }]}
                            >
                                <Select>
                                    <Option value="Chưa giao hàng">Chưa giao hàng</Option>
                                    <Option value="Đã giao hàng">Đã giao hàng</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Trạng thái thanh toán"
                                name="isPaid"
                                rules={[{ required: true }]}
                            >
                                <Select>
                                    <Option value="Chưa thanh toán">Chưa thanh toán</Option>
                                    <Option value="Đã thanh toán">Đã thanh toán</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Cập nhật
                                </Button>
                            </Form.Item>
                        </Form>
                    )}
                </Loading>
            </DrawerComponent>
        </div>
    );
};

export default AdminOrder;
