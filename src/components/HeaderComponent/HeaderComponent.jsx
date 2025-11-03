// HeaderComponent.jsx
import React, { useState, useEffect } from 'react';
import { Col, Badge, Popover, Avatar, Input, Grid, Drawer } from 'antd';
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
  NotificationDot,
  HeaderBackground,
  MobileMenuButton,
  MobileMenu,
  MobileMenuItem,
  SearchButtonMobile,
  SearchDrawer
} from './style';
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined,
  CrownOutlined,
  SearchOutlined,
  StarOutlined,
  GiftOutlined,
  MenuOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as UserService from '../../services/UserService';
import { resetUser } from '../../redux/sildes/userSlide';
import Loading from '../LoadingComponent/Loading';
import { searchProduct } from '../../redux/sildes/productSlide';

const { Search } = Input;
const { useBreakpoint } = Grid;

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);

  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const isTablet = !screens.lg;

  const isAdminPage = location.pathname.includes('/system/admin');

  const handleNavigateLogin = () => {
    navigate('/sign-in');
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    await UserService.logoutUser();
    localStorage.removeItem('access_token');
    dispatch(resetUser());
    setLoading(false);
    setMobileMenuOpen(false);
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
    setMobileMenuOpen(false);
  }

  const onSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    dispatch(searchProduct(value));
  }

  const onSearchSubmit = (value) => {
    dispatch(searchProduct(value));
    if (value.trim() && !location.pathname.includes('/search')) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    }
    setSearchDrawerOpen(false);
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearchSubmit(search);
    }
  }

  const mobileMenuContent = (
    <MobileMenu>
      {user?.access_token ? (
        <>
          <MobileMenuItem onClick={() => handleClickNavigate('profile')}>
            <UserOutlined />
            Thông tin người dùng
          </MobileMenuItem>
          <MobileMenuItem onClick={() => handleClickNavigate('my-order')}>
            <GiftOutlined />
            Đơn hàng của tôi
          </MobileMenuItem>
          {user?.isAdmin && (
            <MobileMenuItem onClick={() => handleClickNavigate('admin')}>
              <CrownOutlined />
              Quản lí hệ thống
            </MobileMenuItem>
          )}
          <MobileMenuItem onClick={handleLogout} className="logout">
            <span>🚪</span>
            Đăng xuất
          </MobileMenuItem>
        </>
      ) : (
        <MobileMenuItem onClick={handleNavigateLogin} className="login">
          <UserOutlined />
          Đăng nhập / Đăng ký
        </MobileMenuItem>
      )}
    </MobileMenu>
  );

  return (
    <HeaderContainer isAdminPage={isAdminPage}>
      {/* Animated Background */}
      <HeaderBackground isAdminPage={isAdminPage} />

      {/* Decoration Elements - Ẩn trên mobile */}
      {!isMobile && (
        <>
          <DecorationElement position="left" isAdminPage={isAdminPage}>⚡</DecorationElement>
          <DecorationElement position="right" isAdminPage={isAdminPage}>🔧</DecorationElement>
          <DecorationElement position="center-left" isAdminPage={isAdminPage}>💡</DecorationElement>
          <DecorationElement position="center-right" isAdminPage={isAdminPage}>🔌</DecorationElement>
        </>
      )}

      <WapperHeader style={{
        justifyContent: isHiddenSearch || isMobile ? 'space-between' : 'unset',
        width: isMobile ? '100%' : '1270px',
        padding: isMobile ? '0 16px' : '10px 0'
      }}>
        {/* Logo Section */}
        <Col xs={12} md={5} style={{ display: 'flex', alignItems: 'center' }}>
          <LogoContainer onClick={() => navigate('/')} isAdminPage={isAdminPage}>
            <WapperTextHeader isAdminPage={isAdminPage}>
              <div className="logo-content">
                <span className="logo-icon">⚡</span>
                {!isMobile && (
                  <span className="logo-text">GH Electric</span>
                )}
                {isMobile && (
                  <span className="logo-text">GH</span>
                )}
                {isAdminPage && <span className="admin-badge">ADMIN</span>}
                {user?.isAdmin && !isAdminPage && !isMobile && (
                  <NotificationDot title="Truy cập trang quản trị">
                    <CrownOutlined />
                  </NotificationDot>
                )}
              </div>
            </WapperTextHeader>
          </LogoContainer>
        </Col>

        {/* Search Section - Desktop */}
        {!isHiddenSearch && !isMobile && (
          <Col md={13} style={{ display: isMobile ? 'none' : 'block' }}>
            <SearchSection>
              <SearchInputContainer isAdminPage={isAdminPage}>
                <Search
                  placeholder="Tìm kiếm sản phẩm, thương hiệu, mã giảm giá..."
                  enterButton={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <SearchOutlined />
                      {!isTablet && 'Tìm kiếm'}
                    </div>
                  }
                  size="large"
                  value={search}
                  onSearch={onSearchSubmit}
                  onChange={onSearch}
                  onKeyPress={handleKeyPress}
                />
              </SearchInputContainer>
            </SearchSection>
          </Col>
        )}

        {/* Right Section */}
        <Col xs={12} md={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{
            display: 'flex',
            gap: isMobile ? '12px' : '25px',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: '100%'
          }}>
            {/* Search Button - Mobile */}
            {!isHiddenSearch && isMobile && (
              <SearchButtonMobile
                onClick={() => setSearchDrawerOpen(true)}
                isAdminPage={isAdminPage}
              >
                <SearchOutlined />
              </SearchButtonMobile>
            )}

            <Loading isLoading={loading}>
              <WapperHeaderAccount>
                {user?.access_token ? (
                  <>
                    {/* Desktop User Section */}
                    {!isMobile && (
                      <Popover
                        content={content}
                        trigger="click"
                        open={isOpenPopup}
                        placement="bottomRight"
                        overlayStyle={{
                          borderRadius: '12px'
                        }}
                      >
                        <UserSection onClick={() => setIsOpenPopup((prev) => !prev)} isAdminPage={isAdminPage}>
                          <div className="avatar-container">
                            <Avatar
                              src={userAvatar}
                              icon={!userAvatar && <UserOutlined />}
                              size={isMobile ? 32 : 40}
                              style={{
                                backgroundColor: user?.isAdmin ? '#8B5FBF' : '#FF6B9D',
                                border: `3px solid ${isAdminPage ? '#FFD93D' : '#FFFFFF'}`,
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                              }}
                            />
                            {user?.isAdmin && (
                              <div className="admin-corner">
                                <CrownOutlined />
                              </div>
                            )}
                          </div>
                          {!isTablet && (
                            <UserInfo>
                              <div className="user-name">
                                {userName}
                                <StarOutlined style={{ marginLeft: '4px', color: '#FFD93D', fontSize: '12px' }} />
                              </div>
                              <div className="user-role">
                                {user?.isAdmin ? '👑 Quản trị viên' : '⭐ Thành viên Vip'}
                              </div>
                            </UserInfo>
                          )}
                          <CaretDownOutlined className={`dropdown-icon ${isOpenPopup ? 'rotate' : ''}`} />
                        </UserSection>
                      </Popover>
                    )}

                    {/* Mobile User Avatar */}
                    {isMobile && (
                      <UserSection onClick={() => setMobileMenuOpen(true)} isAdminPage={isAdminPage}>
                        <div className="avatar-container">
                          <Avatar
                            src={userAvatar}
                            icon={!userAvatar && <UserOutlined />}
                            size={32}
                            style={{
                              backgroundColor: user?.isAdmin ? '#8B5FBF' : '#FF6B9D',
                              border: `2px solid ${isAdminPage ? '#FFD93D' : '#FFFFFF'}`,
                            }}
                          />
                          {user?.isAdmin && (
                            <div className="admin-corner">
                              <CrownOutlined />
                            </div>
                          )}
                        </div>
                      </UserSection>
                    )}
                  </>
                ) : (
                  /* Login Prompt */
                  !isMobile && (
                    <LoginPrompt onClick={handleNavigateLogin} isAdminPage={isAdminPage}>
                      <Avatar
                        icon={<UserOutlined />}
                        size={isMobile ? 32 : 40}
                        style={{
                          backgroundColor: '#6BCF7F',
                          border: '3px solid rgba(255,255,255,0.6)',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                        }}
                      />
                      {!isTablet && (
                        <div className="login-text">
                          <WapperTextHeaderSmall>Đăng nhập/Đăng ký</WapperTextHeaderSmall>
                          <div className="account-link">
                            <WapperTextHeaderSmall>Tài khoản của bạn</WapperTextHeaderSmall>
                            <CaretDownOutlined style={{ fontSize: '12px' }} />
                          </div>
                        </div>
                      )}
                    </LoginPrompt>
                  )
                )}
              </WapperHeaderAccount>
            </Loading>

            {/* Cart Section */}
            {!isHiddenCart && (
              <CartSection onClick={() => navigate('/order')} isAdminPage={isAdminPage}>
                <div className="cart-container">
                  <Badge
                    count={order?.orderItems?.length}
                    size="small"
                    style={{
                      backgroundColor: isAdminPage ? '#8B5FBF' : '#FF6B9D',
                      boxShadow: `0 0 0 2px ${isAdminPage ? '#A78BFA' : '#FF8FAB'}`,
                      fontWeight: 'bold',
                      fontSize: '12px'
                    }}
                  >
                    <ShoppingCartOutlined className="cart-icon" />
                  </Badge>
                  <div className="cart-pulse"></div>
                </div>
                {!isMobile && <WapperTextHeaderSmall>Giỏ hàng</WapperTextHeaderSmall>}
              </CartSection>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <MobileMenuButton
                onClick={() => setMobileMenuOpen(true)}
                isAdminPage={isAdminPage}
              >
                <MenuOutlined />
              </MobileMenuButton>
            )}
          </div>
        </Col>
      </WapperHeader>

      {/* Mobile Menu Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Avatar
              src={userAvatar}
              icon={!userAvatar && <UserOutlined />}
              size={40}
              style={{
                backgroundColor: user?.isAdmin ? '#8B5FBF' : '#FF6B9D',
              }}
            />
            <div>
              <div style={{ fontWeight: 'bold', color: '#333' }}>
                {user?.access_token ? userName : 'Tài khoản'}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {user?.isAdmin ? '👑 Quản trị viên' : '⭐ Thành viên'}
              </div>
            </div>
          </div>
        }
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
        closeIcon={<CloseOutlined />}
      >
        {mobileMenuContent}
      </Drawer>

      {/* Search Drawer for Mobile */}
      <SearchDrawer
        title="Tìm kiếm sản phẩm"
        placement="top"
        onClose={() => setSearchDrawerOpen(false)}
        open={searchDrawerOpen}
        height={120}
        closeIcon={<CloseOutlined />}
      >
        <SearchInputContainer isAdminPage={isAdminPage} style={{ marginTop: '20px' }}>
          <Search
            placeholder="Tìm kiếm sản phẩm..."
            enterButton={<SearchOutlined />}
            size="large"
            value={search}
            onSearch={onSearchSubmit}
            onChange={onSearch}
            onKeyPress={handleKeyPress}
            autoFocus
          />
        </SearchInputContainer>
      </SearchDrawer>
    </HeaderContainer>
  );
};

export default HeaderComponent;