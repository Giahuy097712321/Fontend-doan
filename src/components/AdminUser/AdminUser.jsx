// AdminUser.jsx
import { Button, Form, Select, Input, Empty, Modal } from 'antd';
import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
    WrapperHeader,
    WrapperUploadFile,
    TableWrapper,
    InfoCardContainer,
    InfoCard,
    InfoNumber,
    InfoLabel,
    ChartContainer,
    ChartCard,
    ChartTitle
} from './style';

import TableComponent from '../TableComponent/TableComponent';
import InputComponent from './../InputComponent/InputComponent';
import * as UserService from '../../services/UserService';
import { getBase64 } from '../../utils';
import { useMutationHooks } from './../../hooks/useMutationHook';
import Loading from './../LoadingComponent/Loading';
import * as message from '../../components/Message/Message';
import { useQuery } from '@tanstack/react-query';
import DrawerComponent from './../DrawerCompoenent/DrawerComponent';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS_ADMIN = ['#0088FE', '#00C49F'];

const AdminUser = () => {
    const [rowSelected, setRowSelected] = useState('');
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);

    const [formUpdate] = Form.useForm();

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const user = useSelector((state) => state?.user);

    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        email: '',
        phone: '',
        isAdmin: false,
        avatar: '',
        address: '',
    });

    // mutation chỉ update quyền
    const mutationUpdateRole = useMutationHooks((data) => {
        const { id, token, isAdmin } = data;
        // use existing updateUser service to update role
        return UserService.updateUser(id, { isAdmin }, token);
    });

    const {
        data: dataUpdated,
        isLoading: isLoadingUpdated,
        isSuccess: isSuccessUpdated,
        isError: isErrorUpdated,
    } = mutationUpdateRole;

    // fetch all users
    const getAllUsers = async () => await UserService.getAllUser(user?.access_token);

    const queryUser = useQuery({
        queryKey: ['user'],
        queryFn: getAllUsers,
    });

    const { isLoading: isLoadingUsers, data: users } = queryUser;

    // Thống kê
    const totalUsers = useMemo(() => users?.data?.length || 0, [users]);
    const adminUsers = useMemo(() =>
        users?.data?.filter(user => user?.isAdmin).length || 0,
        [users]
    );
    const regularUsers = useMemo(() =>
        users?.data?.filter(user => !user?.isAdmin).length || 0,
        [users]
    );

    // ✅ Hàm kiểm tra có phải user đang đăng nhập không
    const isCurrentUser = (userId) => {
        return userId === user?.id || userId === user?.data?._id;
    };

    // ✅ Hàm kiểm tra có phải là admin không
    const isAdminUser = (userId) => {
        const userData = users?.data?.find(u => u._id === userId);
        return userData?.isAdmin === true;
    };

    // Biểu đồ phân bố Admin/User
    const adminChartData = useMemo(() => [
        { name: 'Quản trị viên', count: adminUsers },
        { name: 'Người dùng thường', count: regularUsers }
    ], [adminUsers, regularUsers]);

    // Hàm mở drawer chỉ để phân quyền
    const handleEditUserRole = async (id) => {
        setIsOpenDrawer(true);
        setIsLoadingUpdate(true);
        try {
            const res = await UserService.getDetailsUser(id, user?.access_token);
            if (res?.data) {
                setStateUserDetails({
                    name: res.data.name || '',
                    email: res.data.email || '',
                    phone: res.data.phone || '',
                    isAdmin: res.data.isAdmin || false,
                    avatar: res.data.avatar || '',
                    address: res.data.address || '',
                });
                formUpdate.setFieldsValue({
                    name: res.data.name,
                    email: res.data.email,
                    phone: res.data.phone,
                    address: res.data.address,
                    isAdmin: res.data.isAdmin ? 'true' : 'false'
                });
                setRowSelected(id);
            }
        } catch (error) {
            message.error("Không thể lấy chi tiết người dùng");
        } finally {
            setIsLoadingUpdate(false);
        }
    };

    const renderAction = (record) => {
        const userId = record._id;
        const isSelf = isCurrentUser(userId);
        const isAdmin = record.isAdmin === 'Có' || record.isAdmin === true;

        return (
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <EditOutlined
                    style={{
                        color: 'orange',
                        fontSize: '18px',
                        cursor: 'pointer'
                    }}
                    onClick={() => handleEditUserRole(userId)}
                    title={isSelf ? "Chỉnh sửa tài khoản của chính mình" : "Phân quyền người dùng"}
                />
                {isSelf && (
                    <span style={{
                        fontSize: '12px',
                        color: '#1890ff',
                        cursor: 'default'
                    }}>
                        (Bạn)
                    </span>
                )}
                {isAdmin && !isSelf && (
                    <span style={{
                        fontSize: '12px',
                        color: '#52c41a',
                        cursor: 'default'
                    }}>
                        (Admin)
                    </span>
                )}
            </div>
        );
    };

    const dataTable = users?.data?.length > 0
        ? users.data.map((item) => {
            const isSelf = isCurrentUser(item._id);
            const isAdmin = item.isAdmin === true;
            let nameDisplay = item.name || 'Không có tên';

            if (isSelf) {
                nameDisplay += ' (Bạn)';
            } else if (isAdmin) {
                nameDisplay += ' (Admin)';
            }

            return {
                ...item,
                key: item._id,
                name: nameDisplay,
                email: item.email || 'Không có email',
                phone: item.phone || 'Không có số điện thoại',
                isAdmin: item.isAdmin ? 'Có' : 'Không',
            };
        })
        : [];

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
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
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

    const columns = [
        {
            title: 'Tên người dùng',
            dataIndex: 'name',
            sorter: (a, b) => {
                const nameA = a.name || '';
                const nameB = b.name || '';
                return nameA.localeCompare(nameB);
            },
            ...getColumnSearchProps('name')
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: (a, b) => {
                const emailA = a.email || '';
                const emailB = b.email || '';
                return emailA.localeCompare(emailB);
            },
            ...getColumnSearchProps('email')
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            sorter: (a, b) => {
                const phoneA = a.phone || '';
                const phoneB = b.phone || '';
                return phoneA.localeCompare(phoneB);
            },
            ...getColumnSearchProps('phone')
        },
        {
            title: 'Quyền admin',
            dataIndex: 'isAdmin',
            filters: [
                { text: 'Có', value: 'Có' },
                { text: 'Không', value: 'Không' }
            ],
            onFilter: (value, record) => record.isAdmin === value
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => renderAction(record),
            width: 140
        }
    ];

    // trạng thái update quyền
    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            message.success('Cập nhật quyền người dùng thành công!');
            queryUser.refetch();
            handleCloseDrawer();
        } else if (isErrorUpdated) {
            message.error('Cập nhật quyền người dùng thất bại!');
        }
    }, [isSuccessUpdated, isErrorUpdated, dataUpdated]);

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        formUpdate.resetFields();
        setRowSelected('');
    };

    const onUpdateUserRole = () => {
        // Chỉ gửi thông tin quyền admin
        mutationUpdateRole.mutate(
            {
                id: rowSelected,
                token: user?.access_token,
                isAdmin: stateUserDetails.isAdmin
            },
            { onSettled: () => queryUser.refetch() }
        );
    };

    const handleSelectChange = (value) => {
        setStateUserDetails({ ...stateUserDetails, isAdmin: value === 'true' });
    };

    return (
        <div>
            <WrapperHeader>Quản lý người dùng</WrapperHeader>

            {/* Info Card */}
            <InfoCardContainer>
                <InfoCard>
                    <InfoLabel>Tổng người dùng</InfoLabel>
                    <InfoNumber>{totalUsers}</InfoNumber>
                </InfoCard>
                <InfoCard>
                    <InfoLabel>Quản trị viên</InfoLabel>
                    <InfoNumber>{adminUsers}</InfoNumber>
                </InfoCard>
                <InfoCard>
                    <InfoLabel>Người dùng thường</InfoLabel>
                    <InfoNumber>{regularUsers}</InfoNumber>
                </InfoCard>
            </InfoCardContainer>

            {/* Charts */}
            <ChartContainer>
                <ChartCard>
                    <ChartTitle>Phân bố người dùng</ChartTitle>
                    <PieChart width={350} height={300}>
                        <Pie
                            dataKey="count"
                            data={adminChartData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            label={({ name, count }) => `${name}: ${count}`}
                            isAnimationActive
                        >
                            {adminChartData.map((entry, index) => (
                                <Cell key={`cell-admin-${index}`} fill={COLORS_ADMIN[index % COLORS_ADMIN.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ChartCard>
            </ChartContainer>

            {/* Table */}
            <TableWrapper>
                {dataTable.length ? (
                    <TableComponent
                        columns={columns}
                        isLoading={isLoadingUsers}
                        data={dataTable}
                        showSelection={false} // Ẩn checkbox chọn nhiều
                    />
                ) : (
                    <Empty description="Chưa có người dùng nào" />
                )}
            </TableWrapper>

            {/* Drawer chỉ để phân quyền */}
            <DrawerComponent
                title="Phân quyền người dùng"
                isOpen={isOpenDrawer}
                onClose={handleCloseDrawer}
                width="500px"
            >
                <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
                    <Form
                        form={formUpdate}
                        layout="vertical"
                        onFinish={onUpdateUserRole}
                    >
                        <Form.Item label="Tên người dùng" name="name">
                            <InputComponent
                                value={stateUserDetails.name}
                                disabled={true}
                                style={{ background: '#f5f5f5' }}
                            />
                        </Form.Item>
                        <Form.Item label="Email" name="email">
                            <InputComponent
                                value={stateUserDetails.email}
                                disabled={true}
                                style={{ background: '#f5f5f5' }}
                            />
                        </Form.Item>
                        <Form.Item label="Số điện thoại" name="phone">
                            <InputComponent
                                value={stateUserDetails.phone}
                                disabled={true}
                                style={{ background: '#f5f5f5' }}
                            />
                        </Form.Item>
                        <Form.Item label="Địa chỉ" name="address">
                            <InputComponent
                                value={stateUserDetails.address}
                                disabled={true}
                                style={{ background: '#f5f5f5' }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Quyền admin"
                            name="isAdmin"
                            rules={[{ required: true, message: 'Vui lòng chọn quyền!' }]}
                        >
                            <Select
                                value={stateUserDetails.isAdmin ? 'true' : 'false'}
                                onChange={handleSelectChange}
                            >
                                <Select.Option value="true">Có (Quản trị viên)</Select.Option>
                                <Select.Option value="false">Không (Người dùng thường)</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <Button onClick={handleCloseDrawer}>
                                    Hủy
                                </Button>
                                <Button type="primary" htmlType="submit" loading={isLoadingUpdated}>
                                    Cập nhật quyền
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Loading>
            </DrawerComponent>
        </div>
    )
};

export default AdminUser;