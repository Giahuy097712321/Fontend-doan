import React, { useState, useEffect, useCallback } from 'react'
import { WrapperContainer, WrapperContainerLeft, WrapperContainerRight, WrapperTextLight, LogoContainer, BrandName, Tagline } from './style';
import InputForm from './../../components/InputForm/InputFrom';
import ButtonComponent from './../../components/ButtonComponent/ButtonComponent';
import imageLogo from '../../assets/images/logo-login.png'
import { Image } from 'antd';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'
import { useMutationHooks } from './../../hooks/useMutationHook';
import * as UserService from '../../services/UserService'
import Loading from './../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message'
import jwtDecode from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/sildes/userSlide'
import { useLocation } from 'react-router-dom';

const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  const mutation = useMutationHooks(
    data => UserService.loginUser(data)
  )
  const { data, isLoading, isSuccess, isError } = mutation

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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Định nghĩa handleGetDetailsUser với useCallback
  const handleGetDetailsUser = useCallback(async (id, token) => {
    try {
      const res = await UserService.getDetailsUser(id, token)
      if (res?.data) {
        dispatch(updateUser({
          ...res.data,
          id: res.data.id || res.data._id,
          access_token: token
        }))
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin user:', error)
      message.error('Lỗi khi tải thông tin người dùng')
    }
  }, [dispatch])

  useEffect(() => {
    if (isSuccess && data) {
      // Kiểm tra xem đăng nhập có thực sự thành công không
      if (data?.status === 'OK' && data?.access_token) {
        message.success('Đăng nhập thành công!')

        localStorage.setItem('access_token', JSON.stringify(data.access_token))
        const decoded = jwtDecode(data.access_token)

        // lấy id từ token
        const userId = decoded?.id || decoded?._id || decoded?.userId
        if (userId) {
          handleGetDetailsUser(userId, data.access_token)
        }

        // Chuyển hướng sau 1 giây để người dùng thấy thông báo thành công
        setTimeout(() => {
          if (location?.state) {
            navigate(location?.state)
          } else {
            navigate('/')
          }
        }, 1000)
      } else if (data?.status === 'ERR') {
        // Hiển thị lỗi từ server và chuyển sang tiếng Việt
        const errorMessage = getVietnameseErrorMessage(data?.message)
        message.error(errorMessage)
      }
    }
  }, [isSuccess, data, handleGetDetailsUser, location?.state, navigate])

  useEffect(() => {
    if (isError) {
      message.error('Có lỗi xảy ra khi đăng nhập!')
    }
  }, [isError])

  // Hàm chuyển đổi thông báo lỗi sang tiếng Việt
  const getVietnameseErrorMessage = (message) => {
    if (!message) return 'Đăng nhập thất bại!'

    const errorMessages = {
      'The password or user is incorrect': 'Email hoặc mật khẩu không chính xác',
      'Password is incorrect': 'Mật khẩu không chính xác',
      'The email is not defined': 'Người dùng không tồn tại',
      'Email is required': 'Email là bắt buộc',
      'Password is required': 'Mật khẩu là bắt buộc',
      'Email already exists': 'Email đã tồn tại',
      'Invalid email format': 'Định dạng email không hợp lệ'
    }

    return errorMessages[message] || message
  }

  const handleNavigateSignUp = () => {
    navigate('/sign-up')
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
  }

  const handleSignIn = () => {
    if (validateForm()) {
      mutation.mutate({
        email,
        password
      })
    }
  }

  // Cho phép submit bằng phím Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && email && password) {
      handleSignIn()
    }
  }

  return (
    <WrapperContainer>
      <div className="login-box">
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
            <h1>Đăng nhập</h1>
            <p>Chào mừng bạn trở lại với GH ELECTRIC</p>

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

            {data?.status === 'ERR' && (
              <div className="error-message">
                {getVietnameseErrorMessage(data?.message)}
              </div>
            )}

            <Loading isLoading={isLoading}>
              <ButtonComponent
                disabled={!email.length || !password.length || isLoading}
                onClick={handleSignIn}
                size={40}
                styleButton={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  height: '48px',
                  width: '100%',
                  border: 'none',
                  borderRadius: '8px',
                  margin: '20px 0 15px',
                  boxShadow: '0 4px 15px 0 rgba(116, 75, 162, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                textButton={isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                styleTextButton={{
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: '600',
                  letterSpacing: '0.5px'
                }}
              />
            </Loading>

            <div className="signup-section">
              <p>Chưa có tài khoản?
                <WrapperTextLight onClick={handleNavigateSignUp}>
                  {" "}Đăng ký ngay
                </WrapperTextLight>
              </p>
              <p style={{ marginTop: '10px' }}>
                <WrapperTextLight onClick={() => navigate('/forgot-password')}>
                  Quên mật khẩu?
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
              height="180px"
              width="180px"
            />
            <h2>GH ELECTRIC</h2>
            <p>Cung cấp thiết bị điện uy tín</p>
            <div className="feature-list">
              <div className="feature-item">✓ Sản phẩm chính hãng</div>
              <div className="feature-item">✓ Giao hàng nhanh chóng</div>
              <div className="feature-item">✓ Bảo hành dài hạn</div>
            </div>
          </div>
        </WrapperContainerRight>
      </div>
    </WrapperContainer>
  )
}

export default SignInPage