import React, { useState, useEffect } from 'react'
import { WrapperContentProfile, WrapperHeader, WrapperInput, WrapperLabel, WrapperUploadFile } from './style'
import InputForm from './../../components/InputForm/InputFrom'
import ButtonComponent from './../../components/ButtonComponent/ButtonComponent'
import { useSelector, useDispatch } from 'react-redux'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from './../../hooks/useMutationHook'
import Loading from './../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/sildes/userSlide'
import { Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { getBase64 } from '../../utils'

const ProfilePage = () => {
  const user = useSelector((state) => state.user)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [avatar, setAvatar] = useState('')
  const dispatch = useDispatch()

  const mutation = useMutationHooks((data) => {
    const { id, access_token, ...rests } = data
    console.log("🔹 Gọi update với id:", id)  // debug id
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

  useEffect(() => {
    if (isSuccess) {
      message.success('Cập nhật thành công!')
      handleGetDetailsUser(user?.id, user?.access_token)
    } else if (isError) {
      message.error('Cập nhật thất bại!')
    }
  }, [isSuccess, isError])

const handleUpdate = () => {
  if (!user?.id) {
    message.error("Không tìm thấy ID user trong Redux!")
    return
  }

  mutation.mutate({
    id: user.id,  // ✅ dùng id
    email,
    name,
    phone,
    address,
    avatar,
    access_token: user?.access_token,
  })
}


const handleGetDetailsUser = async (id, token) => {
  try {
    const res = await UserService.getDetailsUser(id, token)
    if (res?.data) {
      dispatch(updateUser({
        ...res.data,
        id: res.data._id,  // ✅ ép về id
        access_token: token
      }))
    }
  } catch (error) {
    console.log("❌ Lỗi lấy chi tiết user:", error)
  }
}

  const handleOnchangeAvatar = async ({ fileList }) => {
    if (fileList && fileList.length > 0) {
      const file = fileList[0]
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      setAvatar(file.preview) // preview avatar
    }
  }

  return (
    <div style={{ width: '1270px', margin: '0 auto', height: '500px' }}>
      <WrapperHeader>Thông tin người dùng</WrapperHeader>
      <Loading isLoading={isLoading}>
        <WrapperContentProfile>
          {/* Name */}
          <WrapperInput>
            <WrapperLabel htmlFor="name">Name</WrapperLabel>
            <InputForm style={{ width: '300px' }} id="name" value={name} onChange={setName} />
            <ButtonComponent
              onClick={handleUpdate}
              size={40}
              styleButton={{ height: '30px' }}
              textButton={'Cập nhật'}
              
            />
          </WrapperInput>

          {/* Email */}
          <WrapperInput>
            <WrapperLabel htmlFor="email">Email</WrapperLabel>
            <InputForm style={{ width: '300px' }} id="email" value={email} onChange={setEmail} />
            <ButtonComponent onClick={handleUpdate} size={40} styleButton={{ height: '30px' }} textButton={'Cập nhật'} />
          </WrapperInput>

          {/* Phone */}
          <WrapperInput>
            <WrapperLabel htmlFor="phone">Phone</WrapperLabel>
            <InputForm style={{ width: '300px' }} id="phone" value={phone} onChange={setPhone} />
            <ButtonComponent onClick={handleUpdate} size={40} styleButton={{ height: '30px' }} textButton={'Cập nhật'} />
          </WrapperInput>

          {/* Address */}
          <WrapperInput>
            <WrapperLabel htmlFor="address">Address</WrapperLabel>
            <InputForm style={{ width: '300px' }} id="address" value={address} onChange={setAddress} />
            <ButtonComponent onClick={handleUpdate} size={40} styleButton={{ height: '30px' }} textButton={'Cập nhật'} />
          </WrapperInput>

          {/* Avatar */}
          <WrapperInput>
            <WrapperLabel htmlFor="avatar">Avatar</WrapperLabel>
            <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1} showUploadList={false} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </WrapperUploadFile>
            {avatar && (
              <img src={avatar} style={{ height: '60px', width: '60px', borderRadius: '50%', objectFit: 'cover' }} alt="avatar" />
            )}
            <ButtonComponent onClick={handleUpdate} size={40} styleButton={{ height: '30px' }} textButton={'Cập nhật'} />
          </WrapperInput>
        </WrapperContentProfile>
      </Loading>
    </div>
  )
}

export default ProfilePage
