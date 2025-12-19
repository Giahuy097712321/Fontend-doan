// AdminOrder.jsx
import { Button, Form, Select, Input, Empty, Tag, Alert, Tooltip, Modal } from 'antd';
import { EditOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, SyncOutlined, TruckOutlined, ExclamationCircleOutlined, ShoppingOutlined, SearchOutlined } from '@ant-design/icons';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import TableComponent from '../TableComponent/TableComponent';
import InputComponent from '../InputComponent/InputComponent';
import * as OrderService from '../../services/OrderService';
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../LoadingComponent/Loading';
import * as message from '../Message/Message';
import { useQuery } from '@tanstack/react-query';
import DrawerComponent from '../DrawerCompoenent/DrawerComponent';
import { useSelector } from 'react-redux';
import { parsePrice, converPrice } from '../../utils';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend } from 'recharts';
import {
    WrapperHeader,
    ChartContainer,
    ChartCard,
    ChartTitle,
    TableWrapper,
    InfoCardContainer,
    InfoCard,
    InfoNumber,
    InfoLabel
} from './style';

const { Option } = Select;
const COLORS_DELIVERY = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
const COLORS_PAYMENT = ['#00C49F', '#FFBB28', '#8884D8', '#FF6666', '#AA00FF'];

// Cấu hình các trạng thái giao hàng (mới)
const DELIVERY_STATUSES = [
    { value: 'pending', label: 'Chờ xử lý', color: '#faad14', icon: <ClockCircleOutlined /> },
    { value: 'processing', label: 'Đang xử lý', color: '#1890ff', icon: <SyncOutlined /> },
    { value: 'shipping', label: 'Đang giao hàng', color: '#722ed1', icon: <TruckOutlined /> },
    { value: 'delivered', label: 'Đã giao hàng', color: '#52c41a', icon: <CheckCircleOutlined /> },
    { value: 'cancelled', label: 'Đã hủy', color: '#ff4d4f', icon: <CloseCircleOutlined /> }
];

// Cấu hình các trạng thái thanh toán (mới)
const PAYMENT_STATUSES = [
    { value: 'unpaid', label: 'Chưa thanh toán', color: '#ff4d4f', icon: <CloseCircleOutlined /> },
    { value: 'paid', label: 'Đã thanh toán', color: '#52c41a', icon: <CheckCircleOutlined /> }
];

const AdminOrder = () => {
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [rowSelected, setRowSelected] = useState(null);
    const [isModalConfirm, setIsModalConfirm] = useState(false);
    const [confirmAction, setConfirmAction] = useState('');
    const [form] = Form.useForm();
    const user = useSelector((state) => state?.user);

    // Search state and helpers for table columns (search by order code)
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <InputComponent
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        size="small"
                        style={{ width: '90px' }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: '90px' }}
                    >
                        Reset
                    </Button>
                </div>
            </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
        onFilter: (value, record) => {
            const recordValue = record[dataIndex];
            if (!recordValue) return false;
            return recordValue.toString().toLowerCase().includes(value.toLowerCase());
        },
        filterDropdownProps: {
            onOpenChange(open) {
                if (open) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
        },
    });

    const mutationUpdate = useMutationHooks(({ id, token, deliveryStatus, paymentStatus, isPaid }) =>
        OrderService.updateOrder(id, { deliveryStatus, paymentStatus, isPaid }, token)
    );

    const mutationCancel = useMutationHooks(({ id, token, orderItems }) =>
        OrderService.cancelOrder(id, token, orderItems)
    );

    const getAllOrders = async () => await OrderService.getAllOrder(user?.access_token);
    const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrders });
    const { isLoading: isLoadingOrders, data: orders } = queryOrder;

    // Hàm lấy trạng thái giao hàng hiện tại
    const getDeliveryStatus = (order) => {
        if (!order) return 'pending';

        // Ưu tiên dùng trạng thái mới, nếu không có thì dùng trạng thái cũ
        if (order.deliveryStatus) return order.deliveryStatus;

        if (order.isCancelled) return 'cancelled';
        if (order.isDelivered) return 'delivered';
        return 'pending';
    };

    // Hàm lấy trạng thái thanh toán hiện tại
    const getPaymentStatus = (order) => {
        if (!order) return 'unpaid';

        // Ưu tiên dùng trạng thái mới, nếu không có thì dùng trạng thái cũ
        if (order.paymentStatus) return order.paymentStatus;

        return order.isPaid ? 'paid' : 'unpaid';
    };

    const handleEditOrder = (orderId) => {
        const order = orders?.data?.find(o => o._id === orderId);
        if (!order) return;

        setRowSelected(order);
        setIsOpenDrawer(true);

        const deliveryStatus = getDeliveryStatus(order);
        const paymentStatus = getPaymentStatus(order);

        form.setFieldsValue({
            deliveryStatus: deliveryStatus,
            paymentStatus: paymentStatus,
        });
    };

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        form.resetFields();
        setRowSelected(null);
    };

    const onUpdateStatus = async (values) => {
        const { deliveryStatus, paymentStatus } = values;
        const currentDeliveryStatus = getDeliveryStatus(rowSelected);

        // Kiểm tra logic chuyển trạng thái
        if (deliveryStatus === 'cancelled') {
            // Hiển thị modal xác nhận hủy
            setConfirmAction('cancel');
            setIsModalConfirm(true);
            return;
        }

        if (deliveryStatus === 'delivered') {
            // Xác nhận trước khi đánh dấu đã giao
            setConfirmAction('delivered');
            setIsModalConfirm(true);
            return;
        }

        // Kiểm tra: Nếu đã giao hàng thì phải đã thanh toán
        if (deliveryStatus === 'delivered' && paymentStatus !== 'paid') {
            message.error('Đơn hàng đã giao phải ở trạng thái đã thanh toán!');
            return;
        }

        // Kiểm tra: Nếu đã hủy thì không thể chuyển sang trạng thái khác
        if (currentDeliveryStatus === 'cancelled' && deliveryStatus !== 'cancelled') {
            if (!window.confirm('Đơn hàng này đã bị hủy. Bạn có chắc muốn kích hoạt lại?')) {
                return;
            }
        }

        // Kiểm tra: COD khi đang giao hàng không được tự động chuyển sang "Đã thanh toán"
        if (deliveryStatus === 'shipping' && rowSelected.paymentMethod === 'COD' && paymentStatus === 'paid') {
            message.error('Đơn hàng COD khi đang giao hàng không thể ở trạng thái đã thanh toán!');
            return;
        }

        await processUpdate(deliveryStatus, paymentStatus);
    };

    const processUpdate = async (deliveryStatus, paymentStatus) => {

        let finalPaymentStatus = paymentStatus;

        // Nếu là COD và đang giao hàng, giữ nguyên trạng thái thanh toán
        if (deliveryStatus === 'shipping' && rowSelected.paymentMethod === 'COD') {
            // COD khi đang giao hàng vẫn là "Chưa thanh toán"
            finalPaymentStatus = 'unpaid';
        }
        // Nếu đã giao hàng, tự động set thành "Đã thanh toán"
        else if (deliveryStatus === 'delivered') {
            finalPaymentStatus = 'paid';
        }

        mutationUpdate.mutate(
            {
                id: rowSelected._id,
                token: user?.access_token,
                deliveryStatus: deliveryStatus,
                paymentStatus: finalPaymentStatus
            },
            {
                onSuccess: (data) => {
                    if (data?.status === 'OK') {
                        message.success('Cập nhật thành công!');
                        handleCloseDrawer();
                        queryOrder.refetch();
                    } else {
                        message.error(data?.message || 'Cập nhật thất bại!');
                    }
                },
                onError: () => message.error('Cập nhật thất bại!'),
            }
        );
    };

    const handleConfirmAction = () => {
        const values = form.getFieldsValue();

        if (confirmAction === 'cancel') {
            // Xử lý hủy đơn hàng
            mutationCancel.mutate(
                {
                    id: rowSelected._id,
                    token: user?.access_token,
                    orderItems: rowSelected?.orderItems || []
                },
                {
                    onSuccess: (data) => {
                        if (data?.status === 'OK') {
                            message.success('Hủy đơn hàng thành công!');
                            setIsModalConfirm(false);
                            handleCloseDrawer();
                            queryOrder.refetch();
                        } else {
                            message.error(data?.message || 'Hủy đơn hàng thất bại!');
                        }
                    },
                    onError: () => message.error('Hủy đơn hàng thất bại!'),
                }
            );
        } else if (confirmAction === 'delivered') {
            // Tự động set thanh toán khi đã giao
            values.paymentStatus = 'paid';
            processUpdate('delivered', 'paid');
            setIsModalConfirm(false);
        }
    };

    // Hàm render trạng thái giao hàng
    const renderDeliveryStatus = (order) => {
        const status = getDeliveryStatus(order);
        const statusConfig = DELIVERY_STATUSES.find(s => s.value === status);

        if (!statusConfig) return null;

        return (
            <Tag color={statusConfig.color} icon={statusConfig.icon}>
                {statusConfig.label}
            </Tag>
        );
    };

    // Hàm render trạng thái thanh toán
    const renderPaymentStatus = (order) => {
        const status = getPaymentStatus(order);
        const statusConfig = PAYMENT_STATUSES.find(s => s.value === status);

        if (!statusConfig) return null;

        return (
            <Tag color={statusConfig.color} icon={statusConfig.icon}>
                {statusConfig.label}
            </Tag>
        );
    };

    const dataTable = Array.isArray(orders?.data)
        ? orders.data.map((item) => {
            return {
                key: item._id,
                _id: item._id,
                orderCode: item._id?.slice(-8)?.toUpperCase() || '',
                fullName: item.shippingAddress?.fullName || '',
                phone: item.shippingAddress?.phone || '',
                address: item.shippingAddress?.address || '',
                deliveryStatus: renderDeliveryStatus(item),
                paymentStatus: renderPaymentStatus(item),
                paymentMethod: item.paymentMethod || 'Khác',
                totalPrice: converPrice(item.totalPrice || 0),
                products: item.orderItems?.map((i) => `${i.name} x${i.amount}`).join(', '),
                orderDate: item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : '',
                itemsCount: item.orderItems?.reduce((sum, item) => sum + item.amount, 0) || 0
            };
        })
        : [];

    // Thống kê
    const totalRevenue = useMemo(() => {
        if (!orders?.data) return 0;
        return orders.data
            .filter(o => getDeliveryStatus(o) !== 'cancelled')
            .reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    }, [orders]);

    const orderStats = useMemo(() => {
        if (!orders?.data) return { pending: 0, processing: 0, shipping: 0, delivered: 0, cancelled: 0 };

        const stats = {
            pending: 0,
            processing: 0,
            shipping: 0,
            delivered: 0,
            cancelled: 0
        };

        orders.data.forEach(order => {
            const status = getDeliveryStatus(order);
            stats[status] = (stats[status] || 0) + 1;
        });

        return stats;
    }, [orders]);

    const paymentStats = useMemo(() => {
        if (!orders?.data) return { unpaid: 0, paid: 0 };

        const stats = {
            unpaid: 0,
            paid: 0
        };

        orders.data.forEach(order => {
            const status = getPaymentStatus(order);
            if (status === 'unpaid' || status === 'paid') {
                stats[status] = (stats[status] || 0) + 1;
            }
        });

        return stats;
    }, [orders]);

    // Dữ liệu biểu đồ trạng thái giao hàng
    const deliveryChartData = useMemo(() => {
        return DELIVERY_STATUSES.map(status => ({
            name: status.label,
            value: orderStats[status.value] || 0,
            color: status.color
        })).filter(item => item.value > 0);
    }, [orderStats]);

    // Dữ liệu biểu đồ phương thức thanh toán
    const paymentMethodChartData = useMemo(() => {
        if (!orders?.data) return [];
        const grouped = {};
        orders.data.forEach(o => {
            const method = o.paymentMethod || 'Khác';
            grouped[method] = (grouped[method] || 0) + (o.totalPrice || 0);
        });
        return Object.keys(grouped).map((key, index) => ({
            name: key,
            revenue: grouped[key],
            color: COLORS_PAYMENT[index % COLORS_PAYMENT.length]
        }));
    }, [orders]);

    const columns = [
        {
            title: 'Mã đơn',
            dataIndex: 'orderCode',
            width: 100,
            ...getColumnSearchProps('orderCode'),
            render: (code) => <strong style={{ color: '#1890ff' }}>{code}</strong>
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'fullName',
            sorter: (a, b) => a.fullName.localeCompare(b.fullName),
            width: 150
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            width: 120
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            sorter: (a, b) => parsePrice(a.totalPrice) - parsePrice(b.totalPrice),
            width: 130,
            render: (price) => <strong style={{ color: '#ff4d4f' }}>{price}</strong>
        },
        {
            title: 'Giao hàng',
            dataIndex: 'deliveryStatus',
            width: 120
        },
        {
            title: 'Thanh toán',
            dataIndex: 'paymentStatus',
            width: 130
        },
        {
            title: 'Phương thức',
            dataIndex: 'paymentMethod',
            width: 100
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'orderDate',
            width: 100
        },
        {
            title: 'Hành động',
            render: (_, record) => (
                <Tooltip title="Chỉnh sửa đơn hàng">
                    <EditOutlined
                        style={{
                            color: 'orange',
                            fontSize: '18px',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            backgroundColor: '#fff7e6'
                        }}
                        onClick={() => handleEditOrder(record._id)}
                    />
                </Tooltip>
            ),
            width: 80,
            fixed: 'right'
        },
    ];

    return (
        <div>
            <WrapperHeader>Quản lý đơn hàng</WrapperHeader>

            {/* Info Card */}
            <InfoCardContainer>
                <InfoCard>
                    <InfoLabel>Tổng doanh thu</InfoLabel>
                    <InfoNumber>{totalRevenue.toLocaleString('vi-VN')} VND</InfoNumber>
                </InfoCard>
                <InfoCard>
                    <InfoLabel>Tổng đơn hàng</InfoLabel>
                    <InfoNumber>{orders?.data?.length || 0}</InfoNumber>
                </InfoCard>
                <InfoCard>
                    <InfoLabel>Chờ xử lý</InfoLabel>
                    <InfoNumber style={{ color: '#faad14' }}>{orderStats.pending}</InfoNumber>
                </InfoCard>
                <InfoCard>
                    <InfoLabel>Đang giao</InfoLabel>
                    <InfoNumber style={{ color: '#722ed1' }}>{orderStats.shipping + orderStats.processing}</InfoNumber>
                </InfoCard>
                <InfoCard>
                    <InfoLabel>Đã giao</InfoLabel>
                    <InfoNumber style={{ color: '#52c41a' }}>{orderStats.delivered}</InfoNumber>
                </InfoCard>
                <InfoCard>
                    <InfoLabel>Đã hủy</InfoLabel>
                    <InfoNumber style={{ color: '#ff4d4f' }}>{orderStats.cancelled}</InfoNumber>
                </InfoCard>
            </InfoCardContainer>

            {/* Charts */}
            <ChartContainer>
                <ChartCard>
                    <ChartTitle>Phân bố trạng thái đơn hàng</ChartTitle>
                    <PieChart width={350} height={300}>
                        <Pie
                            dataKey="value"
                            data={deliveryChartData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label={({ name, value }) => `${name}: ${value}`}
                            isAnimationActive
                        >
                            {deliveryChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <RechartsTooltip formatter={(value) => [`${value} đơn`, 'Số lượng']} />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ChartCard>

                <ChartCard>
                    <ChartTitle>Doanh thu theo phương thức thanh toán</ChartTitle>
                    <PieChart width={350} height={300}>
                        <Pie
                            dataKey="revenue"
                            data={paymentMethodChartData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label={({ name, revenue }) => `${name}: ${revenue.toLocaleString('vi-VN')} VND`}
                            isAnimationActive
                        >
                            {paymentMethodChartData.map((entry, index) => (
                                <Cell key={`cell-payment-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <RechartsTooltip formatter={(value) => value.toLocaleString('vi-VN') + ' VND'} />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ChartCard>
            </ChartContainer>

            {/* Table */}
            <TableWrapper>
                {dataTable.length ? (
                    <TableComponent
                        columns={columns}
                        data={dataTable}
                        isLoading={isLoadingOrders}
                        scroll={{ x: 1200 }}
                        showSelection={false} // Ẩn checkbox chọn nhiều
                    />
                ) : (
                    <Empty description="Chưa có đơn hàng nào" />
                )}
            </TableWrapper>

            {/* Drawer chi tiết đơn hàng */}
            <DrawerComponent
                title={`Chi tiết đơn hàng #${rowSelected?._id?.slice(-8)?.toUpperCase() || ''}`}
                isOpen={isOpenDrawer}
                onClose={handleCloseDrawer}
                width="500px"
            >
                <Loading isLoading={mutationUpdate.isLoading}>
                    {rowSelected && (
                        <Form form={form} layout="vertical" onFinish={onUpdateStatus}>
                            {/* Thông tin khách hàng */}
                            <div style={{ marginBottom: 20, padding: 15, backgroundColor: '#f6ffed', borderRadius: 8 }}>
                                <h4 style={{ color: '#52c41a', marginBottom: 10 }}>Thông tin khách hàng</h4>
                                <Form.Item label="Tên khách hàng">
                                    <Input value={rowSelected.shippingAddress?.fullName || ''} disabled />
                                </Form.Item>
                                <Form.Item label="Số điện thoại">
                                    <Input value={rowSelected.shippingAddress?.phone || ''} disabled />
                                </Form.Item>
                                <Form.Item label="Địa chỉ">
                                    <Input.TextArea
                                        value={rowSelected.shippingAddress?.address || ''}
                                        disabled
                                        autoSize={{ minRows: 2 }}
                                    />
                                </Form.Item>
                            </div>

                            {/* Thông tin đơn hàng */}
                            <div style={{ marginBottom: 20, padding: 15, backgroundColor: '#e6f7ff', borderRadius: 8 }}>
                                <h4 style={{ color: '#1890ff', marginBottom: 10 }}>Thông tin đơn hàng</h4>
                                <Form.Item label="Tổng tiền">
                                    <Input value={converPrice(rowSelected.totalPrice || 0)} disabled />
                                </Form.Item>
                                <Form.Item label="Phương thức thanh toán">
                                    <Input value={rowSelected.paymentMethod || ''} disabled />
                                </Form.Item>
                                <Form.Item label="Ngày đặt hàng">
                                    <Input
                                        value={rowSelected.createdAt ? new Date(rowSelected.createdAt).toLocaleString('vi-VN') : ''}
                                        disabled
                                    />
                                </Form.Item>
                            </div>

                            {/* Danh sách sản phẩm */}
                            <div style={{ marginBottom: 20, padding: 15, backgroundColor: '#fff7e6', borderRadius: 8 }}>
                                <h4 style={{ color: '#faad14', marginBottom: 10 }}>
                                    Danh sách sản phẩm ({rowSelected.orderItems?.length || 0})
                                </h4>
                                <Form.Item>
                                    <Input.TextArea
                                        value={rowSelected.orderItems?.map(i => `• ${i.name} x${i.amount} = ${converPrice(i.price * i.amount)}`).join('\n')}
                                        disabled
                                        autoSize={{ minRows: 3 }}
                                    />
                                </Form.Item>
                            </div>

                            {/* Cập nhật trạng thái */}
                            <div style={{ padding: 15, backgroundColor: '#f9f0ff', borderRadius: 8 }}>
                                <h4 style={{ color: '#722ed1', marginBottom: 15 }}>Cập nhật trạng thái</h4>

                                {/* Hiển thị cảnh báo nếu đơn hàng đã hoàn thành */}
                                {getDeliveryStatus(rowSelected) === 'cancelled' && (
                                    <Alert
                                        message="Thông báo"
                                        description="Đơn hàng đã bị hủy. Thay đổi trạng thái sẽ kích hoạt lại đơn hàng."
                                        type="warning"
                                        showIcon
                                        style={{ marginBottom: 15 }}
                                    />
                                )}

                                {getDeliveryStatus(rowSelected) === 'delivered' && (
                                    <Alert
                                        message="Thông báo"
                                        description="Đơn hàng đã được giao. Thay đổi trạng thái có thể gây nhầm lẫn."
                                        type="info"
                                        showIcon
                                        style={{ marginBottom: 15 }}
                                    />
                                )}

                                <Form.Item
                                    label="Trạng thái giao hàng"
                                    name="deliveryStatus"
                                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái giao hàng!' }]}
                                >
                                    <Select placeholder="Chọn trạng thái giao hàng">
                                        {DELIVERY_STATUSES.map(status => (
                                            <Option key={status.value} value={status.value}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    {status.icon}
                                                    {status.label}
                                                </span>
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="Trạng thái thanh toán"
                                    name="paymentStatus"
                                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái thanh toán!' }]}
                                >
                                    <Select placeholder="Chọn trạng thái thanh toán">
                                        {PAYMENT_STATUSES.map(status => (
                                            <Option key={status.value} value={status.value}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    {status.icon}
                                                    {status.label}
                                                </span>
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                {/* Ghi chú logic tự động */}
                                <div style={{ marginBottom: 15, padding: 10, backgroundColor: '#f6ffed', borderRadius: 4 }}>
                                    <small style={{ color: '#52c41a' }}>
                                        <ExclamationCircleOutlined /> Lưu ý:
                                        <ul style={{ margin: '5px 0 0 15px', padding: 0 }}>
                                            <li>Khi đánh dấu "Đã giao hàng", trạng thái thanh toán sẽ tự động chuyển thành "Đã thanh toán"</li>
                                            <li>Hủy đơn hàng đã thanh toán online sẽ thực hiện hoàn tiền cho khách</li>
                                            <li>Đơn hàng COD có thể hủy khi chưa thanh toán</li>
                                        </ul>
                                    </small>
                                </div>

                                <Form.Item>
                                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                                        <Button onClick={handleCloseDrawer}>
                                            Hủy
                                        </Button>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={mutationUpdate.isLoading}
                                        >
                                            Cập nhật
                                        </Button>
                                    </div>
                                </Form.Item>
                            </div>
                        </Form>
                    )}
                </Loading>
            </DrawerComponent>

            {/* Modal xác nhận */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ExclamationCircleOutlined style={{ color: confirmAction === 'cancel' ? '#ff4d4f' : '#52c41a' }} />
                        <span>
                            {confirmAction === 'cancel' ? 'Xác nhận hủy đơn hàng' : 'Xác nhận đã giao hàng'}
                        </span>
                    </div>
                }
                open={isModalConfirm}
                onOk={handleConfirmAction}
                onCancel={() => setIsModalConfirm(false)}
                okText="Xác nhận"
                cancelText="Hủy"
                okButtonProps={{
                    danger: confirmAction === 'cancel',
                    type: 'primary'
                }}
            >
                <div style={{ padding: '20px 0', textAlign: 'center' }}>
                    <p style={{ fontSize: '16px', marginBottom: '10px' }}>
                        {confirmAction === 'cancel'
                            ? `Bạn có chắc chắn muốn hủy đơn hàng #${rowSelected?._id?.slice(-8)?.toUpperCase() || ''}?`
                            : `Xác nhận đơn hàng #${rowSelected?._id?.slice(-8)?.toUpperCase() || ''} đã được giao thành công?`
                        }
                    </p>

                    {confirmAction === 'delivered' && (
                        <p style={{ color: '#52c41a', fontWeight: '500', backgroundColor: '#f6ffed', padding: '8px', borderRadius: '4px' }}>
                            ⚠️ Lưu ý: Khi xác nhận giao hàng, hệ thống sẽ tự động chuyển trạng thái thanh toán thành "Đã thanh toán"
                        </p>
                    )}

                    {confirmAction === 'cancel' && (
                        <p style={{ color: '#ff4d4f', fontWeight: '500', backgroundColor: '#fff2f0', padding: '8px', borderRadius: '4px' }}>
                            ⚠️ Cảnh báo: Hành động này không thể hoàn tác và sẽ trả lại sản phẩm vào kho!
                        </p>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default AdminOrder;