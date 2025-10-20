import { Button, Form, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import React, { useState, useRef, useEffect } from 'react';
import {
    WrapperHeader,
    WrapperUploadFile,
    WrapperAddButton,
    WrapperTable,
    WrapperDrawerContent,
    WrapperModalDelete,
    WrapperActionButtons
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

const AdminUser = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('');
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const user = useSelector((state) => state?.user);

    const [stateUser, setStateUser] = useState({
        name: '',
        email: '',
        phone: '',
        isAdmin: false,
    });

    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        email: '',
        phone: '',
        isAdmin: false,
        avatar: '',
        address: '',
    });

    // mutation tạo user
    const mutation = useMutationHooks((data) => {
        const { name, email, phone, isAdmin } = data;
        return UserService.signupUser({ name, email, phone, isAdmin });
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

    // State lưu các id user được chọn
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

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

    const dispatch = useDispatch();
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
                form.setFieldsValue(res.data);
                setRowSelected(id);
            }
        } catch (error) {
            message.error("Không thể lấy chi tiết người dùng");
        } finally {
            setIsLoadingUpdate(false);
        }
    };

    const renderAction = (record) => (

        <WrapperActionButtons>
            <DeleteOutlined
                className="delete-icon"
                onClick={() => {
                    setIsModalOpenDelete(true);
                    setRowSelected(record._id);
                }}
            />
            <EditOutlined

                onClick={() => handleEditUser(record._id)}
            />
        </WrapperActionButtons>

    );

    const dataTable = users?.data?.length > 0
        ? users.data.map((item) => ({
            ...item,
            key: item._id,
            isAdmin: item.isAdmin ? 'TRUE' : 'FALSE'
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
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => close()}
                    >
                        close
                    </Button>
                </Space>
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
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name')
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: (a, b) => a.email.length - b.email.length,
            ...getColumnSearchProps('email')
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            sorter: (a, b) => a.phone.length - b.phone.length,
            ...getColumnSearchProps('phone')
        },
        {
            title: 'Admin',
            dataIndex: 'isAdmin',
            filters: [
                { text: 'True', value: 'TRUE' },
                { text: 'False', value: 'FALSE' }
            ],
            onFilter: (value, record) => record.isAdmin === value
        },
        {
            title: 'Action',
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
                form.setFieldsValue(dataUpdated.data);
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
        form.resetFields();
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateUser({ name: '', email: '', phone: '', isAdmin: false });
        form.resetFields();
    };

    const onFinish = () => {
        mutation.mutate(stateUser, { onSettled: () => queryUser.refetch() });
    };

    const onUpdateUser = () => {
        mutationUpdate.mutate(
            { id: rowSelected, token: user?.access_token, ...stateUserDetails },
            { onSettled: () => queryUser.refetch() }
        );
    };

    const handleOnchange = (e) =>
        setStateUser({ ...stateUser, [e.target.name]: e.target.value });

    const handleOnchangeDetails = (e) =>
        setStateUserDetails({ ...stateUserDetails, [e.target.name]: e.target.value });

    // Xử lý upload avatar
    const handleOnchangeAvatarDetails = async ({ fileList }) => {
        if (fileList && fileList.length > 0) {
            const file = fileList[0];
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }
            setStateUserDetails({ ...stateUserDetails, avatar: file.preview }); // cập nhật avatar ngay
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
            <WrapperTable>

                <TableComponent
                    columns={columns}
                    isLoading={isLoadingUsers}
                    data={dataTable}
                    handleDeleteManyProducts={handleDeleteManyUsers}
                    rowSelectedKeys={selectedRowKeys}
                    onSelectChange={onSelectChange}
                />
            </WrapperTable>

            {/* Modal tạo user */}
            <ModalComponent
                title="Tạo người dùng"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Loading isLoading={isLoading}>
                    <Form
                        name="basic"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        onFinish={onFinish}
                        autoComplete="off"
                        form={form}
                    >
                        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Nhập tên!' }]}>
                            <InputComponent value={stateUser.name} onChange={handleOnchange} name="name" />
                        </Form.Item>
                        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Nhập Email!' }]}>
                            <InputComponent value={stateUser.email} onChange={handleOnchange} name="email" />
                        </Form.Item>
                        <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Nhập số điện thoại!' }]}>
                            <InputComponent value={stateUser.phone} onChange={handleOnchange} name="phone" />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">Submit</Button>
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
            ><WrapperDrawerContent>
                    <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
                        <Form
                            name="basic"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                            onFinish={onUpdateUser}
                            autoComplete="off"
                            form={form}
                        >
                            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Nhập tên!' }]}>
                                <InputComponent value={stateUserDetails.name} onChange={handleOnchangeDetails} name="name" />
                            </Form.Item>
                            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Nhập Email!' }]}>
                                <InputComponent value={stateUserDetails.email} onChange={handleOnchangeDetails} name="email" />
                            </Form.Item>
                            <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Nhập số điện thoại!' }]}>
                                <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
                            </Form.Item>
                            <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Nhập địa chỉ!' }]}>
                                <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
                            </Form.Item>
                            <Form.Item label="Image" name="image" rules={[{ required: true, message: 'Please input your image!' }]}>
                                <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1} showUploadList={false} beforeUpload={() => false}>
                                    <Button>Select File</Button>
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
                                <Button type="primary" htmlType="submit">Apply</Button>
                            </Form.Item>
                        </Form>
                    </Loading>
                </WrapperDrawerContent>
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
                    <div>Bạn có chắc chắn muốn xóa người dùng này không?</div>
                </Loading>
            </ModalComponent>
        </div>
    )
};

export default AdminUser;
