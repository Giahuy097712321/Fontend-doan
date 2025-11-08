import React, { useState, useEffect, useCallback } from 'react'
import {
  WrapperHeader,
  WrapperInput,
  WrapperLabel,
  WrapperUploadFile
} from './style'
import InputForm from './../../components/InputForm/InputFrom'
import ButtonComponent from './../../components/ButtonComponent/ButtonComponent'
import { useSelector, useDispatch } from 'react-redux'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from './../../hooks/useMutationHook'
import Loading from './../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/sildes/userSlide'
import { Button, Card, Row, Col } from 'antd'
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CameraOutlined,
  LockOutlined
} from '@ant-design/icons'
import { getBase64 } from '../../utils'
import ChangePassword from '../../components/ChangePasswordComponent/ChangePassword'
import ForgotPassword from '../../components/ForgotPasswordComponent/ForgotPassword'

const ProfilePage = () => {
  const user = useSelector((state) => state.user)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [avatar, setAvatar] = useState('')
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false)
  const dispatch = useDispatch()

  const mutation = useMutationHooks((data) => {
    const { id, access_token, ...rests } = data
    console.log("🔹 Gọi update với id:", id)
    return UserService.updateUser(id, rests, access_token)
  })

  const { isLoading, isSuccess, isError } = mutation

  useEffect(() => {
    setEmail(user?.email || '')
    setName(user?.name || '')
    setPhone(user?.phone || '')
    setAddress(user?.address || '')
    setAvatar(user?.avatar || '')
  }, [user])

  // Định nghĩa handleGetDetailsUser với useCallback
  const handleGetDetailsUser = useCallback(async (id, token) => {
    try {
      const res = await UserService.getDetailsUser(id, token)
      if (res?.data) {
        dispatch(updateUser({
          ...res.data,
          id: res.data._id,
          access_token: token
        }))
      }
    } catch (error) {
      console.log("❌ Lỗi lấy chi tiết user:", error)
    }
  }, [dispatch])

  useEffect(() => {
    if (isSuccess) {
      message.success('Cập nhật thành công!')
      if (user?.id && user?.access_token) {
        handleGetDetailsUser(user.id, user.access_token)
      }
    } else if (isError) {
      message.error('Cập nhật thất bại!')
    }
  }, [isSuccess, isError, user?.id, user?.access_token, handleGetDetailsUser])

  const handleUpdate = () => {
    if (!user?.id) {
      message.error("Không tìm thấy ID user trong Redux!")
      return
    }

    mutation.mutate({
      id: user.id,
      email,
      name,
      phone,
      address,
      avatar,
      access_token: user?.access_token,
    })
  }

  const handleOnchangeAvatar = async ({ fileList }) => {
    if (fileList && fileList.length > 0) {
      const file = fileList[0]
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      setAvatar(file.preview)
    }
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', minHeight: '80vh' }}>
      <Card
        title={
          <WrapperHeader>
            <UserOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
            Thông tin cá nhân
          </WrapperHeader>
        }
        style={{
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: 'none'
        }}
        headStyle={{
          borderBottom: '1px solid #f0f0f0',
          fontSize: '20px',
          fontWeight: '600'
        }}
        extra={
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              icon={<LockOutlined />}
              onClick={() => setIsChangePasswordModalOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                border: 'none',
                color: '#fff'
              }}
            >
              Đổi mật khẩu
            </Button>
            <Button
              type="link"
              onClick={() => setIsForgotPasswordModalOpen(true)}
            >
              Quên mật khẩu?
            </Button>
          </div>
        }
      >
        <Loading isLoading={isLoading}>
          <Row gutter={[32, 32]}>
            {/* Avatar Section */}
            <Col xs={24} md={8}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px',
                border: '1px solid #f0f0f0',
                borderRadius: '8px',
                background: '#fafafa'
              }}>
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <img
                    src={avatar || '/default-avatar.png'}
                    style={{
                      height: '120px',
                      width: '120px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #fff',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    alt="avatar"
                  />
                  <WrapperUploadFile
                    onChange={handleOnchangeAvatar}
                    maxCount={1}
                    showUploadList={false}
                    beforeUpload={() => false}
                  >
                    <Button
                      icon={<CameraOutlined />}
                      style={{
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        background: '#1890ff',
                        color: '#fff',
                        border: '2px solid #fff',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    />
                  </WrapperUploadFile>
                </div>
                <ButtonComponent
                  onClick={handleUpdate}
                  size={40}
                  styleButton={{
                    height: '40px',
                    background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                    border: 'none',
                    borderRadius: '6px',
                    width: '100%'
                  }}
                  styleTextButton={{
                    color: '#fff',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                  textButton={'Cập nhật ảnh đại diện'}
                />
              </div>
            </Col>

            {/* Info Section */}
            <Col xs={24} md={16}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Name */}
                <WrapperInput>
                  <WrapperLabel htmlFor="name">
                    <UserOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                    Họ tên
                  </WrapperLabel>
                  <div style={{ flex: 1, display: 'flex', gap: '12px' }}>
                    <InputForm
                      style={{
                        width: '100%',
                        borderRadius: '6px'
                      }}
                      id="name"
                      value={name}
                      onChange={setName}
                      size="large"
                    />
                    <ButtonComponent
                      onClick={handleUpdate}
                      size={40}
                      styleButton={{
                        height: '40px',
                        minWidth: '100px',
                        background: '#52c41a',
                        border: 'none',
                        borderRadius: '6px'
                      }}
                      styleTextButton={{
                        color: '#fff',
                        fontWeight: '600'
                      }}
                      textButton={'Cập nhật'}
                    />
                  </div>
                </WrapperInput>

                {/* Email */}
                <WrapperInput>
                  <WrapperLabel htmlFor="email">
                    <MailOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                    Email
                  </WrapperLabel>
                  <div style={{ flex: 1, display: 'flex', gap: '12px' }}>
                    <InputForm
                      style={{
                        width: '100%',
                        borderRadius: '6px'
                      }}
                      id="email"
                      value={email}
                      onChange={setEmail}
                      size="large"
                    />
                    <ButtonComponent
                      onClick={handleUpdate}
                      size={40}
                      styleButton={{
                        height: '40px',
                        minWidth: '100px',
                        background: '#52c41a',
                        border: 'none',
                        borderRadius: '6px'
                      }}
                      styleTextButton={{
                        color: '#fff',
                        fontWeight: '600'
                      }}
                      textButton={'Cập nhật'}
                    />
                  </div>
                </WrapperInput>

                {/* Phone */}
                <WrapperInput>
                  <WrapperLabel htmlFor="phone">
                    <PhoneOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                    Số điện thoại
                  </WrapperLabel>
                  <div style={{ flex: 1, display: 'flex', gap: '12px' }}>
                    <InputForm
                      style={{
                        width: '100%',
                        borderRadius: '6px'
                      }}
                      id="phone"
                      value={phone}
                      onChange={setPhone}
                      size="large"
                    />
                    <ButtonComponent
                      onClick={handleUpdate}
                      size={40}
                      styleButton={{
                        height: '40px',
                        minWidth: '100px',
                        background: '#52c41a',
                        border: 'none',
                        borderRadius: '6px'
                      }}
                      styleTextButton={{
                        color: '#fff',
                        fontWeight: '600'
                      }}
                      textButton={'Cập nhật'}
                    />
                  </div>
                </WrapperInput>

                {/* Address */}
                <WrapperInput>
                  <WrapperLabel htmlFor="address">
                    <EnvironmentOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                    Địa chỉ
                  </WrapperLabel>
                  <div style={{ flex: 1, display: 'flex', gap: '12px' }}>
                    <InputForm
                      style={{
                        width: '100%',
                        borderRadius: '6px'
                      }}
                      id="address"
                      value={address}
                      onChange={setAddress}
                      size="large"
                    />
                    <ButtonComponent
                      onClick={handleUpdate}
                      size={40}
                      styleButton={{
                        height: '40px',
                        minWidth: '100px',
                        background: '#52c41a',
                        border: 'none',
                        borderRadius: '6px'
                      }}
                      styleTextButton={{
                        color: '#fff',
                        fontWeight: '600'
                      }}
                      textButton={'Cập nhật'}
                    />
                  </div>
                </WrapperInput>
              </div>
            </Col>
          </Row>

          {/* Update All Button */}
          <div style={{
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <ButtonComponent
              onClick={handleUpdate}
              size={40}
              styleButton={{
                height: '48px',
                minWidth: '200px',
                background: 'linear-gradient(135deg, #ff4d4f 0%, #cf1322 100%)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(255, 77, 79, 0.3)'
              }}
              styleTextButton={{
                color: '#fff',
                fontWeight: '600',
                fontSize: '16px'
              }}
              textButton={'Cập nhật tất cả thông tin'}
            />
          </div>
        </Loading>
      </Card>

      {/* Modals */}
      <ChangePassword
        isModalOpen={isChangePasswordModalOpen}
        setIsModalOpen={setIsChangePasswordModalOpen}
      />

      <ForgotPassword
        isModalOpen={isForgotPasswordModalOpen}
        setIsModalOpen={setIsForgotPasswordModalOpen}
      />
    </div>
  )
}

export default ProfilePage