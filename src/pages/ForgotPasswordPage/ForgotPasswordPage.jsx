import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    WrapperContainer,
    WrapperContainerLeft,
    WrapperContainerRight,
    WrapperTextLight,
    LogoContainer,
    BrandName,
    Tagline
} from './style';
import InputForm from '../../components/InputForm/InputFrom';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import imageLogo from '../../assets/images/logo-login.png';
import { Image, Steps } from 'antd';
import { MailOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as UserService from '../../services/UserService';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message';

const { Step } = Steps;

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

    // Mutation cho gửi OTP
    const sendOTPMutation = useMutationHooks(
        (data) => UserService.forgotPassword(data.email)
    );

    // Mutation cho reset password
    const resetPasswordMutation = useMutationHooks(
        (data) => UserService.resetPassword(data)
    );

    const handleNavigateSignIn = () => {
        navigate('/sign-in');
    };

    const handleNavigateSignUp = () => {
        navigate('/sign-up');
    };

    // Bước 1: Gửi OTP
    const handleSendOTP = () => {
        if (!email) {
            message.error('Vui lòng nhập email!');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            message.error('Email không hợp lệ!');
            return;
        }

        sendOTPMutation.mutate({ email });
    };

    // Bước 2: Reset password
    const handleResetPassword = () => {
        if (!otp || !newPassword || !confirmPassword) {
            message.error('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        if (newPassword.length < 5) {
            message.error('Mật khẩu phải có ít nhất 5 ký tự!');
            return;
        }

        if (newPassword !== confirmPassword) {
            message.error('Mật khẩu xác nhận không khớp!');
            return;
        }

        resetPasswordMutation.mutate({
            email,
            otp,
            newPassword,
            confirmPassword
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
                message.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.');
                setTimeout(() => {
                    navigate('/sign-in');
                }, 2000);
            } else {
                message.error(resetPasswordMutation.data?.message || 'Đặt lại mật khẩu thất bại!');
            }
        }
    }, [resetPasswordMutation.isSuccess, resetPasswordMutation.data, navigate]);

    React.useEffect(() => {
        if (resetPasswordMutation.isError) {
            message.error('Có lỗi xảy ra khi đặt lại mật khẩu!');
        }
    }, [resetPasswordMutation.isError]);

    const isLoading = sendOTPMutation.isLoading || resetPasswordMutation.isLoading;

    const steps = [
        {
            title: 'Nhập Email',
            description: 'Nhập email để nhận mã OTP'
        },
        {
            title: 'Đặt lại mật khẩu',
            description: 'Nhập OTP và mật khẩu mới'
        },
        {
            title: 'Hoàn thành',
            description: 'Đặt lại mật khẩu thành công'
        }
    ];

    return (
        <WrapperContainer>
            <div className="forgot-password-box">
                <WrapperContainerLeft>
                    <LogoContainer>
                        <Image
                            src={imageLogo}
                            preview={false}
                            alt='GH ELECTRIC Logo'
                            height="60px"
                            width="60px"
                        />
                        <BrandName>GH ELECTRIC</BrandName>
                        <Tagline>Thiết bị điện chất lượng cao</Tagline>
                    </LogoContainer>

                    <div className="form-section">
                        <h1>Quên mật khẩu</h1>
                        <p>Đặt lại mật khẩu của bạn trong 2 bước đơn giản</p>

                        {/* Steps */}
                        <Steps
                            current={currentStep}
                            size="small"
                            style={{ marginBottom: '30px' }}
                        >
                            {steps.map((item, index) => (
                                <Step key={index} title={item.title} description={item.description} />
                            ))}
                        </Steps>

                        {/* Step 1: Enter Email */}
                        {currentStep === 0 && (
                            <div className="step-content">
                                <div className="input-group">
                                    <InputForm
                                        placeholder="Nhập email của bạn"
                                        value={email}
                                        onChange={setEmail}
                                        prefix={<MailOutlined />}
                                        size="large"
                                    />
                                </div>

                                <Loading isLoading={isLoading}>
                                    <ButtonComponent
                                        disabled={!email || isLoading}
                                        onClick={handleSendOTP}
                                        size={40}
                                        styleButton={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            height: '48px',
                                            width: '100%',
                                            border: 'none',
                                            borderRadius: '8px',
                                            margin: '25px 0 15px',
                                            boxShadow: '0 4px 15px 0 rgba(116, 75, 162, 0.3)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        textButton={isLoading ? 'Đang gửi OTP...' : 'Gửi mã OTP'}
                                        styleTextButton={{
                                            color: '#fff',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            letterSpacing: '0.5px'
                                        }}
                                    />
                                </Loading>
                            </div>
                        )}

                        {/* Step 2: Reset Password */}
                        {currentStep === 1 && (
                            <div className="step-content">
                                <div className="input-group">
                                    <InputForm
                                        placeholder="Nhập mã OTP 6 chữ số"
                                        value={otp}
                                        onChange={setOtp}
                                        size="large"
                                        maxLength={6}
                                        style={{ marginBottom: '20px' }}
                                    />

                                    <div style={{ position: "relative", marginBottom: '20px' }}>
                                        <InputForm
                                            placeholder="Mật khẩu mới"
                                            type={isShowPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={setNewPassword}
                                            prefix={<LockOutlined />}
                                            size="large"
                                        />
                                        <span
                                            onClick={() => setIsShowPassword(!isShowPassword)}
                                            className="password-toggle"
                                            style={{
                                                position: 'absolute',
                                                right: '10px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {isShowPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                                        </span>
                                    </div>

                                    <div style={{ position: "relative" }}>
                                        <InputForm
                                            placeholder="Xác nhận mật khẩu mới"
                                            type={isShowConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={setConfirmPassword}
                                            prefix={<LockOutlined />}
                                            size="large"
                                        />
                                        <span
                                            onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                                            className="password-toggle"
                                            style={{
                                                position: 'absolute',
                                                right: '10px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {isShowConfirmPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                                        </span>
                                    </div>
                                </div>

                                <Loading isLoading={isLoading}>
                                    <ButtonComponent
                                        disabled={!otp || !newPassword || !confirmPassword || isLoading}
                                        onClick={handleResetPassword}
                                        size={40}
                                        styleButton={{
                                            background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                                            height: '48px',
                                            width: '100%',
                                            border: 'none',
                                            borderRadius: '8px',
                                            margin: '25px 0 15px',
                                            boxShadow: '0 4px 15px 0 rgba(82, 196, 26, 0.3)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        textButton={isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                                        styleTextButton={{
                                            color: '#fff',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            letterSpacing: '0.5px'
                                        }}
                                    />
                                </Loading>

                                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                                    <WrapperTextLight
                                        onClick={() => setCurrentStep(0)}
                                        style={{ cursor: 'pointer', fontSize: '14px' }}
                                    >
                                        Quay lại nhập email khác
                                    </WrapperTextLight>
                                </div>
                            </div>
                        )}

                        {/* Navigation Links */}
                        <div className="auth-links">
                            <p>Nhớ mật khẩu?
                                <WrapperTextLight onClick={handleNavigateSignIn}>
                                    {" "}Đăng nhập ngay
                                </WrapperTextLight>
                            </p>
                            <p>Chưa có tài khoản?
                                <WrapperTextLight onClick={handleNavigateSignUp}>
                                    {" "}Đăng ký ngay
                                </WrapperTextLight>
                            </p>
                        </div>
                    </div>
                </WrapperContainerLeft>

                <WrapperContainerRight>
                    <div className="welcome-content">
                        <Image
                            src={imageLogo}
                            preview={false}
                            alt='GH ELECTRIC'
                            height="160px"
                            width="160px"
                        />
                        <h2>Đặt lại mật khẩu</h2>
                        <p>Bảo vệ tài khoản của bạn</p>
                        <div className="security-list">
                            <div className="security-item">✓ Mã OTP bảo mật</div>
                            <div className="security-item">✓ Xác thực 2 bước</div>
                            <div className="security-item">✓ Bảo mật thông tin</div>
                            <div className="security-item">✓ Hỗ trợ 24/7</div>
                        </div>
                    </div>
                </WrapperContainerRight>
            </div>
        </WrapperContainer>
    );
};

export default ForgotPasswordPage;