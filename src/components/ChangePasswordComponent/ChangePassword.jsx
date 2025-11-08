import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as UserService from '../../services/UserService';
import { useSelector } from 'react-redux';
import Loading from '../LoadingComponent/Loading';

const ChangePassword = ({ isModalOpen, setIsModalOpen }) => {
    const [form] = Form.useForm();
    const user = useSelector((state) => state.user);

    const [isLoading, setIsLoading] = useState(false);

    const mutation = useMutationHooks(
        (data) => UserService.changePassword(user?.id, data, user?.access_token)
    );

    const { data, isSuccess, isError } = mutation;

    const handleOk = () => {
        form.submit();
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    const onFinish = async (values) => {
        setIsLoading(true);
        mutation.mutate(values, {
            onSettled: () => {
                setIsLoading(false);
            }
        });
    };

    React.useEffect(() => {
        if (isSuccess) {
            if (data?.status === 'OK') {
                message.success('Đổi mật khẩu thành công!');
                handleCancel();
            } else {
                message.error(data?.message || 'Đổi mật khẩu thất bại!');
            }
        }
    }, [isSuccess, data]);

    React.useEffect(() => {
        if (isError) {
            message.error('Có lỗi xảy ra khi đổi mật khẩu!');
        }
    }, [isError]);

    return (
        <Modal
            title="Đổi mật khẩu"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Hủy
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={isLoading}
                    onClick={handleOk}
                    style={{
                        background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                        border: 'none'
                    }}
                >
                    Đổi mật khẩu
                </Button>,
            ]}
        >
            <Loading isLoading={isLoading}>
                <Form
                    form={form}
                    name="changePassword"
                    onFinish={onFinish}
                    layout="vertical"
                    autoComplete="off"
                >
                    <Form.Item
                        name="oldPassword"
                        label="Mật khẩu hiện tại"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' },
                            { min: 5, message: 'Mật khẩu phải có ít nhất 5 ký tự!' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Nhập mật khẩu hiện tại"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="newPassword"
                        label="Mật khẩu mới"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                            { min: 5, message: 'Mật khẩu phải có ít nhất 5 ký tự!' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Nhập mật khẩu mới"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Xác nhận mật khẩu mới"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Xác nhận mật khẩu mới"
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            size="large"
                        />
                    </Form.Item>
                </Form>
            </Loading>
        </Modal>
    );
};

export default ChangePassword;