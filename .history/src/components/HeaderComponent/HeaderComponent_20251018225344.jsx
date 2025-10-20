// HeaderComponent.jsx
import React, { useState, useEffect } from 'react';
import { Col, Badge, Popover, Avatar } from 'antd';
import {
  HeaderContainer,
  WapperHeader,
  WapperTextHeader,
  WapperHeaderAccount,
  WapperTextHeaderSmall,
  WrapperContentPopup,
  LogoContainer,
  SearchSection,
  UserSection,
  CartSection,
  UserInfo,
  LoginPrompt
} from './style';
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined,
  CrownOutlined
} from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as UserService from '../../services/UserService';
import { resetUser } from '../../redux/sildes/userSlide';
import Loading from '../LoadingComponent/Loading';
import { searchProduct } from '../../redux/sildes/productSlide';

const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const order = useSelector((state) => state?.order)
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const [userName, setUserName] = useState('');
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [userAvatar, setUserAvatar] = useState('')
  const dispatch = useDispatch();
  const [search, setSearch] = useState('')

  const isAdminPage = location.pathname.includes('/system/admin');

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
    <div style={{ minWidth: '150px' }}>
      <WrapperContentPopup onClick={() => handleClickNavigate('profile')}>
        👤 Thông tin người dùng
      </WrapperContentPopup>
      <WrapperContentPopup onClick={() => handleClickNavigate('my-order')}>
        📦 Đơn hàng của tôi
      </WrapperContentPopup>
      {user?.isAdmin && (
        <WrapperContentPopup onClick={() => handleClickNavigate('admin')}>
          👑 Quản lí hệ thống
        </WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={() => handleClickNavigate()} style={{ borderTop: '1px solid #f0f0f0', marginTop: '8px', paddingTop: '8px' }}>
        🚪 Đăng xuất
      </WrapperContentPopup>
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
    <HeaderContainer isAdminPage={isAdminPage}>
      <WapperHeader style={{ justifyContent: isHiddenSearch ? 'space-between' : 'unset' }}>
        <Col span={5}>
          <LogoContainer onClick={() => navigate('/')}>
            <WapperTextHeader>
              🛍️ GiaHuyDCMM
              {isAdminPage && <span className="admin-badge">ADMIN</span>}
            </WapperTextHeader>
          </LogoContainer>
        </Col>

        {!isHiddenSearch && (
          <Col span={13}>
            <SearchSection>
              <ButtonInputSearch
                size="large"
                textButton="Tìm kiếm"
                placeholder="Tìm kiếm sản phẩm..."
                onChange={onSearch}
                style={{
                  borderRadius: '25px',
                  overflow: 'hidden'
                }}
              />
            </SearchSection>
          </Col>
        )}

        <Col span={6}>
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Loading isLoading={loading}>
              <WapperHeaderAccount>
                {user?.access_token ? (
                  <Popover
                    content={content}
                    trigger="click"
                    open={isOpenPopup}
                    placement="bottomRight"
                  >

                    <UserSection onClick={() => setIsOpenPopup((prev) => !prev)}>
                      <Avatar
                        src={userAvatar}
                        icon={!userAvatar && <UserOutlined />}
                        size={36}
                        style={{
                          backgroundColor: user?.isAdmin ? '#722ed1' : '#1890ff',
                          border: `2px solid ${isAdminPage ? '#fff' : 'rgba(255,255,255,0.3)'}`
                        }}
                      />
                      <UserInfo>
                        <div className="user-name">
                          {userName}
                          {user?.isAdmin && <CrownOutlined style={{ marginLeft: '4px', color: '#ffd666' }} />}
                        </div>
                        <div className="user-role">
                          {user?.isAdmin ? 'Quản trị viên' : 'Thành viên'}
                        </div>
                      </UserInfo>
                      <CaretDownOutlined className={`dropdown-icon ${isOpenPopup ? 'rotate' : ''}`} />
                    </UserSection>
                  </Popover>
                ) : (
                  <LoginPrompt onClick={handleNavigateLogin}>
                    <Avatar
                      icon={<UserOutlined />}
                      size={36}
                      style={{
                        backgroundColor: '#52c41a',
                        border: '2px solid rgba(255,255,255,0.3)'
                      }}
                    />
                    <div className="login-text">
                      <WapperTextHeaderSmall>Đăng nhập/đăng ký</WapperTextHeaderSmall>
                      <div className="account-link">
                        <WapperTextHeaderSmall>Tài khoản</WapperTextHeaderSmall>
                        <CaretDownOutlined />
                      </div>
                    </div>
                  </LoginPrompt>
                )}
              </WapperHeaderAccount>
            </Loading>

            {!isHiddenCart && (
              <CartSection onClick={() => navigate('/order')}>
                <Badge
                  count={order?.orderItems?.length}
                  size="small"
                  style={{
                    backgroundColor: isAdminPage ? '#722ed1' : '#ff4d4f',
                    boxShadow: `0 0 0 2px ${isAdminPage ? '#8c6bce' : '#1a94ff'}`,
                    fontWeight: 'bold'
                  }}
                >
                  <ShoppingCartOutlined className="cart-icon" />
                </Badge>
                <WapperTextHeaderSmall>Giỏ hàng</WapperTextHeaderSmall>
              </CartSection>
            )}
          </div>
        </Col>
      </WapperHeader>
    </HeaderContainer>
  );
};

export default HeaderComponent;