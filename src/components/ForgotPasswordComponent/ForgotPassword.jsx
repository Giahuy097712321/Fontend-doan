import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Steps } from 'antd';
import { MailOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as UserService from '../../services/UserService';
import Loading from '../LoadingComponent/Loading';

const { Step } = Steps;

const ForgotPassword = ({ isModalOpen, setIsModalOpen }) => {
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [email, setEmail] = useState('');

    const sendOTPMutation = useMutationHooks(
        (data) => UserService.forgotPassword(data.email)
    );

    const resetPasswordMutation = useMutationHooks(
        (data) => UserService.resetPassword(data)
    );

    const handleOk = () => {
        if (currentStep === 0) {
            form.validateFields(['email']).then(values => {
                sendOTPMutation.mutate(values);
            });
        } else {
            form.submit();
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setCurrentStep(0);
        setEmail('');
        setIsModalOpen(false);
    };

    const onFinish = async (values) => {
        resetPasswordMutation.mutate({
            email: email,
            ...values
        });
    };

    // Xử lý kết quả gửi OTP
    React.useEffect(() => {
        if (sendOTPMutation.isSuccess) {
            if (sendOTPMutation.data?.status === 'OK') {
                message.success('Mã OTP đã được gửi đến email của bạn!');
                setCurrentStep(1);
            } else {
                message.error(sendOTPMutation.data?.message || 'Gửi OTP thất bại!');
            }
        }
    }, [sendOTPMutation.isSuccess, sendOTPMutation.data]);

    React.useEffect(() => {
        if (sendOTPMutation.isError) {
            message.error('Có lỗi xảy ra khi gửi OTP!');
        }
    }, [sendOTPMutation.isError]);

    // Xử lý kết quả reset password
    React.useEffect(() => {
        if (resetPasswordMutation.isSuccess) {
            if (resetPasswordMutation.data?.status === 'OK') {
                message.success('Đặt lại mật khẩu thành công!');
                handleCancel();
                // Tự động chuyển đến trang đăng nhập
                setTimeout(() => {
                    window.location.href = '/sign-in';
                }, 2000);
            } else {
                message.error(resetPasswordMutation.data?.message || 'Đặt lại mật khẩu thất bại!');
            }
        }
    }, [resetPasswordMutation.isSuccess, resetPasswordMutation.data]);

    React.useEffect(() => {
        if (resetPasswordMutation.isError) {
            message.error('Có lỗi xảy ra khi đặt lại mật khẩu!');
        }
    }, [resetPasswordMutation.isError]);

    const steps = [
        {
            title: 'Nhập Email',
            content: (
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Nhập email của bạn"
                            size="large"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Item>
                </Form>
            ),
        },
        {
            title: 'Xác thực OTP',
            content: (
                <Form form={form} name="resetPassword" onFinish={onFinish} layout="vertical">
                    <Form.Item
                        name="otp"
                        label="Mã OTP"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mã OTP!' },
                            { len: 6, message: 'Mã OTP phải có 6 chữ số!' }
                        ]}
                    >
                        <Input
                            placeholder="Nhập mã OTP 6 chữ số"
                            size="large"
                            maxLength={6}
                        />
                    </Form.Item>

                    <Form.Item
                        name="newPassword"
                        label="Mật khẩu mới"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                            { min: 5, message: 'Mật khẩu phải có ít nhất 5 ký tự!' } // ĐỔI TỪ 6 THÀNH 5
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
            ),
        },
    ];

    const isLoading = sendOTPMutation.isLoading || resetPasswordMutation.isLoading;

    return (
        <Modal
            title="Quên mật khẩu"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            width={500}
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
                    {currentStep === 0 ? 'Gửi OTP' : 'Đặt lại mật khẩu'}
                </Button>,
            ]}
        >
            <Loading isLoading={isLoading}>
                <Steps current={currentStep} size="small" style={{ marginBottom: 24 }}>
                    {steps.map(item => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>

                <div>{steps[currentStep].content}</div>
            </Loading>
        </Modal>
    );
};

export default ForgotPassword;