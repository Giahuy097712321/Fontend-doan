import React, { useState, useEffect, useCallback } from 'react'
import { WrapperContainer, WrapperContainerLeft, WrapperContainerRight, WrapperTextLight, LogoContainer, BrandName, Tagline } from './style';
import InputForm from './../../components/InputForm/InputFrom';
import ButtonComponent from './../../components/ButtonComponent/ButtonComponent';
import imageLogo from '../../assets/images/logo-login.png'
import { Image } from 'antd';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from './../../hooks/useMutationHook';
import Loading from './../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message'

const SignUpPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState({})
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)

    const navigate = useNavigate()

    const mutation = useMutationHooks(
        data => UserService.signupUser(data)
    )

    const { data, isLoading, isSuccess, isError } = mutation

    // Định nghĩa handleNavigateSignIn với useCallback
    const handleNavigateSignIn = useCallback(() => {
        navigate('/sign-in')
    }, [navigate])

    useEffect(() => {
        if (isSuccess) {
            message.success('Đăng ký thành công!')
            setTimeout(() => {
                handleNavigateSignIn()
            }, 1500)
        }
    }, [isSuccess, handleNavigateSignIn])

    useEffect(() => {
        if (isError) {
            message.error('Đăng ký thất bại!')
        }
    }, [isError])

    // Validate form
    const validateForm = () => {
        const newErrors = {}

        if (!email) {
            newErrors.email = 'Email không được để trống'
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email không hợp lệ'
        }

        if (!password) {
            newErrors.password = 'Mật khẩu không được để trống'
        } else if (password.length < 5) {
            newErrors.password = 'Mật khẩu phải có ít nhất 5 ký tự'
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu'
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleOnchangeEmail = (value) => {
        setEmail(value)
        if (errors.email) {
            setErrors(prev => ({ ...prev, email: '' }))
        }
    }

    const handleOnchangePassword = (value) => {
        setPassword(value)
        if (errors.password) {
            setErrors(prev => ({ ...prev, password: '' }))
        }
        // Clear confirm password error if passwords match
        if (errors.confirmPassword && value === confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: '' }))
        }
    }

    const handleOnchangeConfirmPassword = (value) => {
        setConfirmPassword(value)
        if (errors.confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: '' }))
        }
    }

    const handleSignUp = () => {
        if (validateForm()) {
            mutation.mutate({ email, password, confirmPassword })
        }
    }

    // Cho phép submit bằng phím Enter
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && email && password && confirmPassword) {
            handleSignUp()
        }
    }

    return (
        <WrapperContainer>
            <div className="signup-box">
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
                        <h1>Tạo tài khoản</h1>
                        <p>Đăng ký để trải nghiệm mua sắm tốt nhất</p>

                        <div className="input-group">
                            <InputForm
                                style={{ marginBottom: '5px' }}
                                placeholder="Nhập email của bạn"
                                value={email}
                                onChange={handleOnchangeEmail}
                                onKeyPress={handleKeyPress}
                            />
                            {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>

                        <div className="input-group">
                            <div style={{ position: "relative" }}>
                                <InputForm
                                    placeholder="Nhập mật khẩu"
                                    type={isShowPassword ? "text" : "password"}
                                    value={password}
                                    onChange={handleOnchangePassword}
                                    onKeyPress={handleKeyPress}
                                />
                                <span
                                    onClick={() => setIsShowPassword(!isShowPassword)}
                                    className="password-toggle"
                                >
                                    {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
                                </span>
                            </div>
                            {errors.password && <span className="error-text">{errors.password}</span>}
                        </div>

                        <div className="input-group">
                            <div style={{ position: "relative" }}>
                                <InputForm
                                    placeholder="Xác nhận mật khẩu"
                                    type={isShowConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={handleOnchangeConfirmPassword}
                                    onKeyPress={handleKeyPress}
                                />
                                <span
                                    onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                                    className="password-toggle"
                                >
                                    {isShowConfirmPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
                                </span>
                            </div>
                            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                        </div>

                        {data?.status === 'ERR' && (
                            <div className="error-message">
                                {data?.message || 'Đăng ký thất bại. Vui lòng thử lại!'}
                            </div>
                        )}

                        <Loading isLoading={isLoading}>
                            <ButtonComponent
                                disabled={!email.length || !password.length || !confirmPassword.length || isLoading}
                                onClick={handleSignUp}
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
                                textButton={isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                                styleTextButton={{
                                    color: '#fff',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    letterSpacing: '0.5px'
                                }}
                            />
                        </Loading>

                        <div className="signin-section">
                            <p>Bạn đã có tài khoản?
                                <WrapperTextLight onClick={handleNavigateSignIn}>
                                    {" "}Đăng nhập ngay
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
                        <h2>Tham gia GH ELECTRIC</h2>
                        <p>Đăng ký để nhận nhiều ưu đãi</p>
                        <div className="benefits-list">
                            <div className="benefit-item">✓ Ưu đãi đặc biệt cho thành viên</div>
                            <div className="benefit-item">✓ Theo dõi đơn hàng dễ dàng</div>
                            <div className="benefit-item">✓ Lịch sử mua hàng</div>
                            <div className="benefit-item">✓ Tích lũy điểm thưởng</div>
                        </div>
                    </div>
                </WrapperContainerRight>
            </div>
        </WrapperContainer>
    )
}

export default SignUpPage