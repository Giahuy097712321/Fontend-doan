import React, { useState, useEffect } from 'react';
import { Col, Input, Badge, Popover } from 'antd';
import { WapperHeader, WapperTextHeader, WapperHeaderAccount, WapperTextHeaderSmall, WrapperContentPopup } from './style';
import { UserOutlined, CaretDownOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as UserService from '../../services/UserService';
import { resetUser } from '../../redux/sildes/userSlide';
import Loading from './../LoadingComponent/Loading';
import { WrapperHeader } from './../../pages/Profile/style';
import { searchProduct } from '../../redux/sildes/productSlide';
const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const order = useSelector((state) => state?.order)
  const { Search } = Input;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [userName, setUserName] = useState('');
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [userAvatar, setUserAvatar] = useState('')
  const dispatch = useDispatch();
  const [search, setSearch] = useState('')
  const handleNavigateLogin = () => {
    navigate('/sign-in');
  };

  const handleLogout = async () => {
    setLoading(true);
    await UserService.logoutUser();
    localStorage.removeItem('access_token');
    dispatch(resetUser());
    setLoading(false);
  };

  useEffect(() => {
    setUserName(user?.name || 'Người dùng')
    setUserAvatar(user?.avatar)
  }, [user?.name, user?.avatar])

  const content = (
    <div>
      <WrapperContentPopup onClick={() => handleClickNavigate()}>Đăng xuất</WrapperContentPopup>
      <WrapperContentPopup onClick={() => handleClickNavigate('my-order')}>Đơn hàng của tôi</WrapperContentPopup>
      <WrapperContentPopup onClick={() => handleClickNavigate('profile')}>Thông tin người dùng</WrapperContentPopup>
      {user?.isAdmin && (
        <WrapperContentPopup onClick={() => handleClickNavigate('admin')}>Quản lí hệ thống</WrapperContentPopup>
      )}

    </div>
  );
  const handleClickNavigate = (type) => {
    if (type === 'profile') {
      navigate('/profile-user')
    } else if (type === 'admin') {
      navigate('/system/admin')
    } else if (type === 'my-order') {
      navigate('/my-order', {
        state: {
          id: user?.id,
          token: user?.access_token
        }
      })
    } else {
      handleLogout()
    }
    setIsOpenPopup(false)
  }
  const onSearch = (e) => {
    setSearch(e.target.value)
    dispatch(searchProduct(e.target.value))
  }
  return (
    <div style={{ width: '100%', background: 'rgb(26,148,255)', display: 'flex', justifyContent: 'center' }}>
      <WapperHeader style={{ justifyContent: isHiddenSearch ? 'space-between' : 'unset' }}>
        <Col span={5} style={{ display: 'flex', justifyContent: 'center' }}>
          <WapperTextHeader>GiaHuyDCMM</WapperTextHeader>
        </Col>
        {!isHiddenSearch && (
          <Col span={13}>
            <ButtonInputSearch
              size="large"
              variant="borderless"
              textButton="Tìm kiếm"
              placeholder="Input search text"
              onChange={onSearch}
            />
          </Col>
        )}

        <Col span={6} style={{ display: 'flex', gap: '54px', alignItems: 'center' }}>
          <Loading isLoading={loading}>
            <WapperHeaderAccount>
              {userAvatar ? (
                <img src={userAvatar} alt="avatar" style={{
                  height: '30px',
                  width: '30px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }} />
              ) : (
                <UserOutlined style={{ fontSize: '30px' }} />
              )}
              {user?.access_token ? (
                <Popover content={content} trigger="click" open={isOpenPopup}>
                  <div style={{ cursor: 'pointer' }} onClick={() => setIsOpenPopup((prev) => !prev)}>{userName}</div>
                </Popover>
              ) : (
                <div onClick={handleNavigateLogin} style={{ cursor: 'pointer' }}>
                  <WapperTextHeaderSmall>Đăng nhập/đăng ký</WapperTextHeaderSmall>
                  <div>
                    <WapperTextHeaderSmall>Tài khoản</WapperTextHeaderSmall>
                    <CaretDownOutlined />
                  </div>
                </div>
              )}
            </WapperHeaderAccount>
          </Loading>
          {!isHiddenCart && (
            <div onClick={() => navigate('/order')} style={{ cursor: 'pointer' }}>
              <Badge count={order?.orderItems?.length} size="small">
                <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff' }} />
              </Badge>
              <WapperTextHeaderSmall>Giỏ Hàng</WapperTextHeaderSmall>
            </div>
          )}

        </Col>
      </WapperHeader>
    </div>
  );
};

export default HeaderComponent;
