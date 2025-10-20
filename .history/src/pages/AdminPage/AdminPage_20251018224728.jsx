// AdminPage.jsx
import { Menu, Layout, theme } from 'antd';
import React, { useState } from 'react';
import { getItem } from './../../utils';
import {
    UserOutlined,
    AppstoreOutlined,
    ShoppingCartOutlined,
    DashboardOutlined
} from '@ant-design/icons';
import HeaderComponent from './../../components/HeaderComponent/HeaderComponent';
import AdminUser from './../../components/AdminUser/AdminUser';
import AdminProduct from './../../components/AdminProduct/AdminProduct';
import AdminOrder from './../../components/AdminOrder/AdminOrder';

const { Sider, Content } = Layout;

const AdminPage = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const items = [
        getItem('Quản lý người dùng', 'user', <UserOutlined />),
        getItem('Quản lý sản phẩm', 'product', <AppstoreOutlined />),
        getItem('Quản lý đơn hàng', 'order', <ShoppingCartOutlined />),
    ];

    const [keySelected, setKeySelected] = useState('user');
    const [collapsed, setCollapsed] = useState(false);

    const renderPage = (key) => {
        switch (key) {
            case 'user':
                return <AdminUser />;
            case 'product':
                return <AdminProduct />;
            case 'order':
                return <AdminOrder />;
            default:
                return <></>;
        }
    };

    const handleOnclick = ({ key }) => {
        setKeySelected(key);
    };

    return (
        <>
            <HeaderComponent isHiddenSearch isHiddenCart />
            <Layout style={{ minHeight: 'calc(100vh - 64px)' }}>
                <Sider
                    theme="light"
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                    style={{
                        background: colorBgContainer,
                        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
                    }}
                    width={250}
                >
                    <div style={{
                        padding: '16px',
                        textAlign: 'center',
                        borderBottom: '1px solid #f0f0f0',
                        marginBottom: '8px'
                    }}>
                        <DashboardOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                        {!collapsed && (
                            <div style={{
                                fontWeight: '600',
                                color: '#1890ff',
                                marginTop: '8px',
                                fontSize: '16px'
                            }}>
                                ADMIN PANEL
                            </div>
                        )}
                    </div>

                    <Menu
                        mode="inline"
                        selectedKeys={[keySelected]}
                        style={{
                            border: 'none',
                            background: 'transparent',
                        }}
                        items={items}
                        onClick={handleOnclick}
                    />
                </Sider>

                <Layout>
                    <Content
                        style={{
                            margin: 0,
                            minHeight: 280,
                            background: '#f5f5f5',
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <div style={{
                            padding: '24px',
                            background: '#f5f5f5',
                            minHeight: '100%'
                        }}>
                            {renderPage(keySelected)}
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};

export default AdminPage;