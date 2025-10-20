// AdminUser.jsx
import { Button, Form, Select, Input } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
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
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../redux/sildes/userSlide';
import ModalComponent from './../ModalComponent/ModalComponent';
import { Empty } from 'antd';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS_ADMIN = ['#0088FE', '#00C49F'];
const COLORS_GENERAL = ['#FF8042', '#8884D8', '#82CA9D', '#FFBB28'];

const AdminUser = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('');
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);

    const [formCreate] = Form.useForm();
    const [formUpdate] = Form.useForm();

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const user = useSelector((state) => state?.user);
    const dispatch = useDispatch();

    const [stateUser, setStateUser] = useState({
        name: '',
        email: '',
        phone: '',
        isAdmin: false,
        password: ''
    });

    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        email: '',
        phone: '',
        isAdmin: false,
        avatar: '',
        address: '',
    });

    // State lưu các id user được chọn
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    // mutation tạo user
    const mutation = useMutationHooks((data) => {
        const { name, email, phone, isAdmin, password } = data;
        return UserService.signupUser({ name, email, phone, isAdmin, password });
    });

    // mutation update user
    const mutationUpdate = useMutationHooks((data) => {
        const { id, token, ...rests } = data;
        return UserService.updateUser(id, rests, token);
    });

    // mutation delete user
    const mutationDeleted = useMutationHooks((data) => {
        const { id, token } = data;
        return UserService.deleteUser(id, token);
    });

    // mutation delete many users
    const mutationDeletedMany = useMutationHooks(({ ids, token }) => {
        return UserService.deleteManyUser(ids, token);
    });

    const {
        data: dataUpdated,
        isLoading: isLoadingUpdated,
        isSuccess: isSuccessUpdated,
        isError: isErrorUpdated,
    } = mutationUpdate;

    const {
        data: dataDeleted,
        isLoading: isLoadingDeleted,
        isSuccess: isSuccessDeleted,
        isError: isErrorDeleted,
    } = mutationDeleted;

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
        users?.data?.filter(user => user.isAdmin).length || 0,
        [users]
    );
    const regularUsers = useMemo(() =>
        users?.data?.filter(user => !user.isAdmin).length || 0,
        [users]
    );
    const activeUsers = useMemo(() =>
        users?.data?.filter(user => user.isActive !== false).length || 0,
        [users]
    );

    // Biểu đồ phân bố Admin/User
    const adminChartData = useMemo(() => [
        { name: 'Quản trị viên', count: adminUsers },
        { name: 'Người dùng thường', count: regularUsers }
    ], [adminUsers, regularUsers]);

    // Biểu đồ đăng ký theo tháng (giả lập)
    const registrationChartData = useMemo(() => [
        { month: 'Tháng 1', users: 15 },
        { month: 'Tháng 2', users: 22 },
        { month: 'Tháng 3', users: 18 },
        { month: 'Tháng 4', users: 25 },
        { month: 'Tháng 5', users: 30 },
        { month: 'Tháng 6', users: 28 }
    ], []);

    // Hàm truyền xuống TableComponent để cập nhật selectedRowKeys
    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    // Hàm xóa nhiều user
    const handleDeleteManyUsers = (ids) => {
        mutationDeletedMany.mutate(
            { ids, token: user?.access_token },
            {
                onSettled: () => {
                    queryUser.refetch();
                    setSelectedRowKeys([]);
                },
            }
        );
    };

    // edit user
    const handleEditUser = async (id) => {
        setIsOpenDrawer(true);
        setIsLoadingUpdate(true);
        try {
            const res = await UserService.getDetailsUser(id, user?.access_token);
            if (res?.data) {
                setStateUserDetails({
                    name: res.data.name,
                    email: res.data.email,
                    phone: res.data.phone,
                    isAdmin: res.data.isAdmin,
                    avatar: res.data.avatar || '',
                    address: res.data.address || '',
                });
                formUpdate.setFieldsValue({
                    ...res.data,
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

    const renderAction = (record) => (
        <div style={{ display: 'flex', gap: '12px' }}>
            <EditOutlined
                style={{ color: 'orange', fontSize: '18px', cursor: 'pointer' }}
                onClick={() => handleEditUser(record._id)}
            />
            <DeleteOutlined
                style={{ color: 'red', fontSize: '18px', cursor: 'pointer' }}
                onClick={() => {
                    setIsModalOpenDelete(true);
                    setRowSelected(record._id);
                }}
            />
        </div>
    );

    const dataTable = users?.data?.length > 0
        ? users.data.map((item) => ({
            ...item,
            key: item._id,
            isAdmin: item.isAdmin ? 'Có' : 'Không',
            status: item.isActive !== false ? 'Hoạt động' : 'Không hoạt động'
        }))
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
        onFilter: (value, record) =>
            record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
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
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps('name')
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
            ...getColumnSearchProps('email')
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            sorter: (a, b) => a.phone.localeCompare(b.phone),
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
            title: 'Trạng thái',
            dataIndex: 'status',
            filters: [
                { text: 'Hoạt động', value: 'Hoạt động' },
                { text: 'Không hoạt động', value: 'Không hoạt động' }
            ],
            onFilter: (value, record) => record.status === value
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => renderAction(record)
        }
    ];

    const { data, isLoading, isSuccess, isError } = mutation;

    // trạng thái tạo user
    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            message.success('Tạo người dùng thành công!');
            handleCancel();
            queryUser.refetch();
        } else if (isError || data?.status === 'ERR') {
            message.error(data?.message || 'Có lỗi xảy ra!');
        }
    }, [isSuccess, isError, data]);

    // trạng thái update user
    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            message.success('Cập nhật người dùng thành công!');
            if (dataUpdated?.data) {
                setStateUserDetails(dataUpdated.data);
                formUpdate.setFieldsValue(dataUpdated.data);
                dispatch(updateUser({
                    ...dataUpdated.data,
                    id: dataUpdated.data._id,
                    access_token: user?.access_token
                }));
            }
            queryUser.refetch();
            handleCloseDrawer();
        } else if (isErrorUpdated) {
            message.error('Cập nhật người dùng thất bại!');
        }
    }, [isSuccessUpdated, isErrorUpdated, dataUpdated]);

    // trạng thái xóa user
    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            message.success('Xóa người dùng thành công!');
            handleCancelDelete();
            queryUser.refetch();
        } else if (isErrorDeleted) {
            message.error('Xóa người dùng thất bại!');
        }
    }, [isSuccessDeleted, isErrorDeleted, dataDeleted]);

    const handleCancelDelete = () => setIsModalOpenDelete(false);

    const handleDeleteUser = () => {
        mutationDeleted.mutate(
            { id: rowSelected, token: user?.access_token },
            { onSettled: () => queryUser.refetch() }
        );
    };

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        formUpdate.resetFields();
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateUser({ name: '', email: '', phone: '', isAdmin: false, password: '' });
        formCreate.resetFields();
    };

    const onFinish = () => {
        mutation.mutate(stateUser, { onSettled: () => queryUser.refetch() });
    };

    const onUpdateUser = () => {
        mutationUpdate.mutate(
            {
                id: rowSelected,
                token: user?.access_token,
                ...stateUserDetails,
                isAdmin: stateUserDetails.isAdmin
            },
            { onSettled: () => queryUser.refetch() }
        );
    };

    const handleOnchange = (e) =>
        setStateUser({ ...stateUser, [e.target.name]: e.target.value });

    const handleOnchangeDetails = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setStateUserDetails({ ...stateUserDetails, [e.target.name]: value });
    };

    const handleSelectChange = (value) => {
        setStateUserDetails({ ...stateUserDetails, isAdmin: value === 'true' });
    };

    // Xử lý upload avatar
    const handleOnchangeAvatarDetails = async ({ fileList }) => {
        if (fileList && fileList.length > 0) {
            const file = fileList[0];
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }
            setStateUserDetails({ ...stateUserDetails, avatar: file.preview });
        }
    };

    // Hiển thị thông báo khi xóa nhiều user
    useEffect(() => {
        if (mutationDeletedMany.isSuccess && mutationDeletedMany.data?.status === 'OK') {
            message.success('Xóa nhiều người dùng thành công!');
        } else if (mutationDeletedMany.isError) {
            message.error('Xóa nhiều người dùng thất bại!');
        }
    }, [mutationDeletedMany.isSuccess, mutationDeletedMany.isError, mutationDeletedMany.data]);

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
                <InfoCard>
                    <InfoLabel>Đang hoạt động</InfoLabel>
                    <InfoNumber>{activeUsers}</InfoNumber>
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

                <ChartCard>
                    <ChartTitle>Đăng ký người dùng theo tháng</ChartTitle>
                    <BarChart width={350} height={300} data={registrationChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="users" fill="#8884d8" />
                    </BarChart>
                </ChartCard>
            </ChartContainer>

            {/* Button thêm người dùng */}
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalOpen(true)}
                    style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
                >
                    Thêm người dùng
                </Button>
            </div>

            {/* Bảng người dùng */}
            <TableWrapper>
                {dataTable.length ? (
                    <TableComponent
                        columns={columns}
                        isLoading={isLoadingUsers}
                        data={dataTable}
                        handleDeleteManyProducts={handleDeleteManyUsers}
                        rowSelectedKeys={selectedRowKeys}
                        onSelectChange={onSelectChange}
                    />
                ) : (
                    <Empty description="Chưa có người dùng nào" />
                )}
            </TableWrapper>

            {/* Modal tạo user */}
            <ModalComponent
                title="Tạo người dùng mới"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Loading isLoading={isLoading}>
                    <Form
                        name="create-user"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        onFinish={onFinish}
                        autoComplete="off"
                        form={formCreate}
                    >
                        <Form.Item label="Tên" name="name" rules={[{ required: true, message: 'Nhập tên!' }]}>
                            <InputComponent value={stateUser.name} onChange={handleOnchange} name="name" />
                        </Form.Item>
                        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Nhập Email!' }]}>
                            <InputComponent value={stateUser.email} onChange={handleOnchange} name="email" />
                        </Form.Item>
                        <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Nhập mật khẩu!' }]}>
                            <InputComponent type="password" value={stateUser.password} onChange={handleOnchange} name="password" />
                        </Form.Item>
                        <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Nhập số điện thoại!' }]}>
                            <InputComponent value={stateUser.phone} onChange={handleOnchange} name="phone" />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">Tạo</Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </ModalComponent>

            {/* Drawer update user */}
            <DrawerComponent
                title="Chi tiết người dùng"
                isOpen={isOpenDrawer}
                onClose={handleCloseDrawer}
                width="50%"
            >
                <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
                    <Form
                        name="update-user"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        onFinish={onUpdateUser}
                        autoComplete="off"
                        form={formUpdate}
                    >
                        <Form.Item label="Tên" name="name" rules={[{ required: true, message: 'Nhập tên!' }]}>
                            <InputComponent value={stateUserDetails.name} onChange={handleOnchangeDetails} name="name" />
                        </Form.Item>
                        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Nhập Email!' }]}>
                            <InputComponent value={stateUserDetails.email} onChange={handleOnchangeDetails} name="email" />
                        </Form.Item>
                        <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Nhập số điện thoại!' }]}>
                            <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
                        </Form.Item>
                        <Form.Item label="Địa chỉ" name="address">
                            <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
                        </Form.Item>
                        <Form.Item label="Quyền admin" name="isAdmin">
                            <Select value={stateUserDetails.isAdmin ? 'true' : 'false'} onChange={handleSelectChange}>
                                <Select.Option value="true">Có</Select.Option>
                                <Select.Option value="false">Không</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Ảnh đại diện" name="avatar">
                            <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1} showUploadList={false} beforeUpload={() => false}>
                                <Button>Chọn ảnh</Button>
                                {stateUserDetails?.avatar && (
                                    <img src={stateUserDetails?.avatar} style={{
                                        height: '60px',
                                        width: '60px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginLeft: '10px'
                                    }} alt="avatar" />
                                )}
                            </WrapperUploadFile>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">Cập nhật</Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </DrawerComponent>

            {/* Modal xóa user */}
            <ModalComponent
                title="Xóa người dùng"
                open={isModalOpenDelete}
                onCancel={handleCancelDelete}
                onOk={handleDeleteUser}
                okText="Xóa"
                cancelText="Hủy"
            >
                <Loading isLoading={isLoadingDeleted}>
                    <div style={{ textAlign: 'center', fontSize: '16px', padding: '20px 0' }}>
                        Bạn có chắc chắn muốn xóa người dùng này không?
                    </div>
                </Loading>
            </ModalComponent>
        </div>
    )
};

export default AdminUser;