// AdminUser.jsx
import { Button, Form, Select, Input, Empty, Modal } from 'antd';
import { DeleteOutlined, EditOutlined, SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
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
import * as OrderService from '../../services/OrderService';
import { getBase64 } from '../../utils';
import { useMutationHooks } from './../../hooks/useMutationHook';
import Loading from './../LoadingComponent/Loading';
import * as message from '../../components/Message/Message';
import { useQuery } from '@tanstack/react-query';
import DrawerComponent from './../DrawerCompoenent/DrawerComponent';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../redux/sildes/userSlide';
import ModalComponent from './../ModalComponent/ModalComponent';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS_ADMIN = ['#0088FE', '#00C49F'];

const AdminUser = () => {
    const [rowSelected, setRowSelected] = useState('');
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);

    const [formUpdate] = Form.useForm();

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const user = useSelector((state) => state?.user);
    const dispatch = useDispatch();

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

    // Hàm truyền xuống TableComponent để cập nhật selectedRowKeys
    const onSelectChange = (newSelectedRowKeys) => {
        // ✅ Loại bỏ ID của user đang đăng nhập VÀ admin khỏi danh sách chọn
        const filteredKeys = newSelectedRowKeys.filter(key => {
            const isCurrent = isCurrentUser(key);
            const isAdmin = isAdminUser(key);
            return !isCurrent && !isAdmin; // Không cho chọn chính mình và admin khác
        });
        setSelectedRowKeys(filteredKeys);
    };

    // Hàm xóa nhiều user
    const handleDeleteManyUsers = (ids) => {
        // ✅ Kiểm tra xem có user đang đăng nhập trong danh sách không
        const containsCurrentUser = ids.some(id => isCurrentUser(id));
        // ✅ Kiểm tra xem có admin trong danh sách không
        const containsAdmin = ids.some(id => isAdminUser(id));

        if (containsCurrentUser) {
            message.error('Không thể xóa tài khoản đang đăng nhập!');
            return;
        }

        if (containsAdmin) {
            message.error('Không thể xóa tài khoản quản trị viên!');
            return;
        }

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
                    name: res.data.name || '',
                    email: res.data.email || '',
                    phone: res.data.phone || '',
                    isAdmin: res.data.isAdmin || false,
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
                    onClick={() => handleEditUser(userId)}
                    title="Chỉnh sửa người dùng"
                />
                {!isSelf && !isAdmin && ( // ✅ CHỈ hiển thị nút xóa nếu KHÔNG phải là mình và KHÔNG phải admin
                    <DeleteOutlined
                        style={{ color: 'red', fontSize: '18px', cursor: 'pointer' }}
                        onClick={() => {
                            setIsModalOpenDelete(true);
                            setRowSelected(userId);
                        }}
                        title="Xóa người dùng"
                    />
                )}
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

    // trạng thái update user
    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            message.success('Cập nhật người dùng thành công!');

            if (dataUpdated?.data) {
                setStateUserDetails(dataUpdated.data);
                formUpdate.setFieldsValue(dataUpdated.data);

                // CHỈ dispatch nếu đang cập nhật chính user đang đăng nhập
                if (isCurrentUser(dataUpdated.data._id)) {
                    dispatch(updateUser({
                        ...dataUpdated.data,
                        id: dataUpdated.data._id,
                        access_token: user?.access_token
                    }));
                }
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
        const isSelf = isCurrentUser(rowSelected);
        const isAdmin = isAdminUser(rowSelected);

        // ✅ Kiểm tra nếu đang xóa chính mình
        if (isSelf) {
            message.error('Không thể xóa tài khoản đang đăng nhập!');
            handleCancelDelete();
            return;
        }

        // ✅ Kiểm tra nếu đang xóa admin
        if (isAdmin) {
            message.error('Không thể xóa tài khoản quản trị viên!');
            handleCancelDelete();
            return;
        }

        mutationDeleted.mutate(
            { id: rowSelected, token: user?.access_token },
            { onSettled: () => queryUser.refetch() }
        );
    };

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        formUpdate.resetFields();
        setRowSelected('');
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
                        handleDeleteManyProducts={handleDeleteManyUsers}
                        rowSelectedKeys={selectedRowKeys}
                        onSelectChange={onSelectChange}
                    />
                ) : (
                    <Empty description="Chưa có người dùng nào" />
                )}
            </TableWrapper>

            {/* Drawer */}
            <DrawerComponent
                title="Chi tiết người dùng"
                isOpen={isOpenDrawer}
                onClose={handleCloseDrawer}
                width="500px"
            >
                <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
                    <Form
                        form={formUpdate}
                        layout="vertical"
                        onFinish={onUpdateUser}
                    >
                        <Form.Item label="Tên người dùng" name="name" rules={[{ required: true, message: 'Nhập tên!' }]}>
                            <InputComponent
                                value={stateUserDetails.name}
                                onChange={handleOnchangeDetails}
                                name="name"
                            />
                        </Form.Item>
                        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Nhập Email!' }]}>
                            <InputComponent
                                value={stateUserDetails.email}
                                onChange={handleOnchangeDetails}
                                name="email"
                            />
                        </Form.Item>
                        <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Nhập số điện thoại!' }]}>
                            <InputComponent
                                value={stateUserDetails.phone}
                                onChange={handleOnchangeDetails}
                                name="phone"
                            />
                        </Form.Item>
                        <Form.Item label="Địa chỉ" name="address">
                            <InputComponent
                                value={stateUserDetails.address}
                                onChange={handleOnchangeDetails}
                                name="address"
                            />
                        </Form.Item>
                        <Form.Item label="Quyền admin" name="isAdmin">
                            <Select
                                value={stateUserDetails.isAdmin ? 'true' : 'false'}
                                onChange={handleSelectChange}
                            >
                                <Select.Option value="true">Có</Select.Option>
                                <Select.Option value="false">Không</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Ảnh đại diện" name="avatar">
                            <WrapperUploadFile
                                onChange={handleOnchangeAvatarDetails}
                                maxCount={1}
                                showUploadList={false}
                                beforeUpload={() => false}
                            >
                                <Button>Chọn ảnh</Button>
                                {stateUserDetails?.avatar && (
                                    <img
                                        src={stateUserDetails?.avatar}
                                        style={{
                                            height: '60px',
                                            width: '60px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            marginLeft: '10px'
                                        }}
                                        alt="avatar"
                                    />
                                )}
                            </WrapperUploadFile>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Cập nhật
                            </Button>
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
                okButtonProps={{ danger: true, loading: isLoadingDeleted }}
            >
                <Loading isLoading={isLoadingDeleted}>
                    <div style={{ textAlign: 'center', fontSize: '16px', padding: '20px 0' }}>
                        {isCurrentUser(rowSelected) ? (
                            <>
                                <p style={{ color: '#ff4d4f', fontWeight: 'bold', marginBottom: '15px' }}>
                                    ⚠️ KHÔNG THỂ XÓA TÀI KHOẢN ĐANG ĐĂNG NHẬP!
                                </p>
                                <p>• Bạn không thể xóa tài khoản của chính mình</p>
                                <p>• Hãy đăng xuất hoặc dùng tài khoản admin khác để xóa</p>
                            </>
                        ) : isAdminUser(rowSelected) ? (
                            <>
                                <p style={{ color: '#ff4d4f', fontWeight: 'bold', marginBottom: '15px' }}>
                                    ⚠️ KHÔNG THỂ XÓA TÀI KHOẢN QUẢN TRỊ VIÊN!
                                </p>
                                <p>• Bạn không thể xóa tài khoản quản trị viên</p>
                                <p>• Chỉ có thể xóa người dùng thường</p>
                            </>
                        ) : (
                            <>
                                <p>Bạn có chắc chắn muốn xóa người dùng này không?</p>
                                <p style={{ color: '#ff4d4f', fontWeight: '500', marginTop: '10px' }}>
                                    ⚠️ Cảnh báo: Tất cả đơn hàng của người dùng này cũng sẽ bị xóa!
                                </p>
                            </>
                        )}
                    </div>
                </Loading>
            </ModalComponent>
        </div>
    )
};

export default AdminUser;