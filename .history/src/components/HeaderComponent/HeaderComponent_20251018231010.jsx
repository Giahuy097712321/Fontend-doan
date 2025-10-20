// HeaderComponent.jsx
import React, { useState, useEffect } from 'react';
import { Col, Badge, Popover, Avatar, Input } from 'antd';
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
  LoginPrompt,
  SearchInputContainer,
  DecorationElement,
  NotificationDot
} from './style';
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined,
  CrownOutlined,
  SearchOutlined,
  StarOutlined,
  GiftOutlined
} from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as UserService from '../../services/UserService';
import { resetUser } from '../../redux/sildes/userSlide';
import Loading from '../LoadingComponent/Loading';
import { searchProduct } from '../../redux/sildes/productSlide';

const { Search } = Input;

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
    <div style={{ minWidth: '180px' }}>
      <WrapperContentPopup onClick={() => handleClickNavigate('profile')}>
        <UserOutlined style={{ marginRight: '8px' }} />
        Thông tin người dùng
      </WrapperContentPopup>
      <WrapperContentPopup onClick={() => handleClickNavigate('my-order')}>
        <GiftOutlined style={{ marginRight: '8px' }} />
        Đơn hàng của tôi
      </WrapperContentPopup>
      {user?.isAdmin && (
        <WrapperContentPopup onClick={() => handleClickNavigate('admin')}>
          <CrownOutlined style={{ marginRight: '8px' }} />
          Quản lí hệ thống
        </WrapperContentPopup>
      )}
      <WrapperContentPopup
        onClick={() => handleClickNavigate()}
        style={{
          borderTop: '1px solid #f0f0f0',
          marginTop: '8px',
          paddingTop: '8px',
          color: '#ff4d4f'
        }}
      >
        <span style={{ marginRight: '8px' }}>🚪</span>
        Đăng xuất
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
    const value = e.target.value;
    setSearch(value);
    // Dispatch search action immediately as user types
    dispatch(searchProduct(value));
  }

  const onSearchSubmit = (value) => {
    dispatch(searchProduct(value));
    // Navigate to search results page if needed
    if (value.trim() && !location.pathname.includes('/search')) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearchSubmit(search);
    }
  }

  return (
    <HeaderContainer isAdminPage={isAdminPage}>
      {/* Decoration Elements */}
      <DecorationElement position="left" isAdminPage={isAdminPage}>✨</DecorationElement>
      <DecorationElement position="right" isAdminPage={isAdminPage}>🎯</DecorationElement>

      <WapperHeader style={{ justifyContent: isHiddenSearch ? 'space-between' : 'unset' }}>
        <Col span={5}>
          <LogoContainer onClick={() => navigate('/')}>
            <WapperTextHeader>
              <div className="logo-content">
                <span className="logo-icon">🛍️</span>
                <span className="logo-text">GiaHuyDCMM</span>
                {isAdminPage && <span className="admin-badge">ADMIN</span>}
                {user?.isAdmin && !isAdminPage && (
                  <NotificationDot title="Truy cập trang quản trị">
                    <CrownOutlined />
                  </NotificationDot>
                )}
              </div>
            </WapperTextHeader>
          </LogoContainer>
        </Col>

        {!isHiddenSearch && (
          <Col span={13}>
            <SearchSection>
              <SearchInputContainer>
                <Search
                  placeholder="Tìm kiếm sản phẩm, thương hiệu, mã giảm giá..."
                  enterButton={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <SearchOutlined />
                      Tìm kiếm
                    </div>
                  }
                  size="large"
                  value={search}
                  onSearch={onSearchSubmit}
                  onChange={onSearch}
                  onKeyPress={handleKeyPress}
                  style={{
                    height: '48px',
                    borderRadius: '30px',
                    overflow: 'hidden',
                    backgroundColor: '#f8f9fa' // Changed background color
                  }}
                />
              </SearchInputContainer>
            </SearchSection>
          </Col>
        )}

        <Col span={6}>
          <div style={{ display: 'flex', gap: '25px', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Loading isLoading={loading}>
              <WapperHeaderAccount>
                {user?.access_token ? (
                  <Popover
                    content={content}
                    trigger="click"
                    open={isOpenPopup}
                    placement="bottomRight"
                    overlayStyle={{
                      borderRadius: '12px'
                    }}
                  >
                    <UserSection onClick={() => setIsOpenPopup((prev) => !prev)}>
                      <div className="avatar-container">
                        <Avatar
                          src={userAvatar}
                          icon={!userAvatar && <UserOutlined />}
                          size={40}
                          style={{
                            backgroundColor: user?.isAdmin ? '#722ed1' : '#1890ff',
                            border: `3px solid ${isAdminPage ? '#ffd666' : 'rgba(255,255,255,0.4)'}`,
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                          }}
                        />
                        {user?.isAdmin && (
                          <div className="admin-corner">
                            <CrownOutlined />
                          </div>
                        )}
                      </div>
                      <UserInfo>
                        <div className="user-name">
                          {userName}
                          <StarOutlined style={{ marginLeft: '4px', color: '#ffd666', fontSize: '12px' }} />
                        </div>
                        <div className="user-role">
                          {user?.isAdmin ? '👑 Quản trị viên' : '⭐ Thành viên'}
                        </div>
                      </UserInfo>
                      <CaretDownOutlined className={`dropdown-icon ${isOpenPopup ? 'rotate' : ''}`} />
                    </UserSection>
                  </Popover>
                ) : (
                  <LoginPrompt onClick={handleNavigateLogin}>
                    <Avatar
                      icon={<UserOutlined />}
                      size={40}
                      style={{
                        backgroundColor: '#52c41a',
                        border: '3px solid rgba(255,255,255,0.4)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                      }}
                    />
                    <div className="login-text">
                      <WapperTextHeaderSmall>Đăng nhập/Đăng ký</WapperTextHeaderSmall>
                      <div className="account-link">
                        <WapperTextHeaderSmall>Tài khoản của bạn</WapperTextHeaderSmall>
                        <CaretDownOutlined style={{ fontSize: '12px' }} />
                      </div>
                    </div>
                  </LoginPrompt>
                )}
              </WapperHeaderAccount>
            </Loading>

            {!isHiddenCart && (
              <CartSection onClick={() => navigate('/order')}>
                <div className="cart-container">
                  <Badge
                    count={order?.orderItems?.length}
                    size="small"
                    style={{
                      backgroundColor: isAdminPage ? '#722ed1' : '#ff4d4f',
                      boxShadow: `0 0 0 3px ${isAdminPage ? '#8c6bce' : '#1a94ff'}`,
                      fontWeight: 'bold',
                      fontSize: '12px'
                    }}
                  >
                    <ShoppingCartOutlined className="cart-icon" />
                  </Badge>
                  <div className="cart-pulse"></div>
                </div>
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