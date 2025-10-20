// HeaderComponent.jsx
import React, { useState, useEffect } from 'react';
import { Col, Input, Badge, Popover, Avatar, Dropdown, Space } from 'antd';
import {
    WapperHeader,
    WapperTextHeader,
    WapperHeaderAccount,
    WapperTextHeaderSmall,
    WrapperContentPopup,
    HeaderContainer,
    Logo,
    SearchContainer,
    ActionButtons,
    UserMenu,
    CartBadge,
    AdminBadge
} from './style';
import {
    UserOutlined,
    CaretDownOutlined,
    ShoppingCartOutlined,
    LogoutOutlined,
    ProfileOutlined,
    ShoppingOutlined,
    DashboardOutlined,
    SearchOutlined
} from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as UserService from '../../services/UserService';
import { resetUser } from '../../redux/sildes/userSlide';
import Loading from './../LoadingComponent/Loading';
import { searchProduct } from '../../redux/sildes/productSlide';

const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
    const order = useSelector((state) => state?.order)
    const { Search } = Input;
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector((state) => state.user);
    const [userName, setUserName] = useState('');
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

    const userMenuItems = [
        {
            key: 'profile',
            icon: <ProfileOutlined />,
            label: 'Thông tin cá nhân',
            onClick: () => navigate('/profile-user')
        },
        {
            key: 'orders',
            icon: <ShoppingOutlined />,
            label: 'Đơn hàng của tôi',
            onClick: () => navigate('/my-order', {
                state: {
                    id: user?.id,
                    token: user?.access_token
                }
            })
        },
        ...(user?.isAdmin ? [{
            key: 'admin',
            icon: <DashboardOutlined />,
            label: 'Quản lí hệ thống',
            onClick: () => navigate('/system/admin')
        }] : []),
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Đăng xuất',
            onClick: handleLogout,
            danger: true
        }
    ];

    const onSearch = (e) => {
        setSearch(e.target.value)
        dispatch(searchProduct(e.target.value))
    }

    return (
        <HeaderContainer isAdminPage={isAdminPage}>
            <WapperHeader style={{ justifyContent: isHiddenSearch ? 'space-between' : 'unset' }}>
                <Col span={5}>
                    <Logo onClick={() => navigate('/')}>
                        <WapperTextHeader>🛍️ GiaHuyDCMM</WapperTextHeader>
                        {isAdminPage && <AdminBadge>ADMIN</AdminBadge>}
                    </Logo>
                </Col>

                {!isHiddenSearch && (
                    <Col span={13}>
                        <SearchContainer>
                            <ButtonInputSearch
                                size="large"
                                textButton="Tìm kiếm"
                                placeholder="Tìm kiếm sản phẩm..."
                                onChange={onSearch}
                                style={{
                                    borderRadius: '20px',
                                }}
                            />
                        </SearchContainer>
                    </Col>
                )}

                <Col span={6}>
                    <ActionButtons>
                        <Loading isLoading={loading}>
                            <WapperHeaderAccount>
                                {user?.access_token ? (
                                    <Dropdown
                                        menu={{ items: userMenuItems }}
                                        placement="bottomRight"
                                        trigger={['click']}
                                    >
                                        <UserMenu>
                                            <Avatar
                                                src={userAvatar}
                                                icon={!userAvatar && <UserOutlined />}
                                                size="default"
                                                style={{
                                                    backgroundColor: isAdminPage ? '#722ed1' : '#1890ff'
                                                }}
                                            />
                                            <div className="user-info">
                                                <div className="user-name">{userName}</div>
                                                <div className="user-role">
                                                    {user?.isAdmin ? 'Quản trị viên' : 'Thành viên'}
                                                </div>
                                            </div>
                                            <CaretDownOutlined className="dropdown-icon" />
                                        </UserMenu>
                                    </Dropdown>
                                ) : (
                                    <div className="login-section" onClick={handleNavigateLogin}>
                                        <Avatar
                                            icon={<UserOutlined />}
                                            size="default"
                                            style={{ backgroundColor: '#87d068' }}
                                        />
                                        <div className="login-text">
                                            <WapperTextHeaderSmall>Đăng nhập/Đăng ký</WapperTextHeaderSmall>
                                            <div className="account-text">
                                                <WapperTextHeaderSmall>Tài khoản</WapperTextHeaderSmall>
                                                <CaretDownOutlined />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </WapperHeaderAccount>
                        </Loading>

                        {!isHiddenCart && (
                            <CartBadge onClick={() => navigate('/order')}>
                                <Badge
                                    count={order?.orderItems?.length}
                                    size="small"
                                    style={{
                                        backgroundColor: isAdminPage ? '#722ed1' : '#ff4d4f',
                                        boxShadow: `0 0 0 2px ${isAdminPage ? '#1a148f' : '#1a94ff'}`
                                    }}
                                >
                                    <ShoppingCartOutlined className="cart-icon" />
                                </Badge>
                                <WapperTextHeaderSmall>Giỏ hàng</WapperTextHeaderSmall>
                            </CartBadge>
                        )}
                    </ActionButtons>
                </Col>
            </WapperHeader>
        </HeaderContainer>
    );
};

export default HeaderComponent;