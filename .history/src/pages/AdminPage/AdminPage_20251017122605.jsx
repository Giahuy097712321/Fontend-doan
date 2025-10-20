import { Menu } from 'antd';
import React, { useState } from 'react';
import { getItem } from './../../utils';
import { MailOutlined, AppstoreOutlined, UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import HeaderComponent from './../../components/HeaderComponent/HeaderComponent';
import AdminUser from './../../components/AdminUser/AdminUser';
import AdminProduct from './../../components/AdminProduct/AdminProduct';
import AdminOrder from './../../components/AdminOrder/AdminOrder';

const AdminPage = () => {
    const items = [
        getItem('Người dùng', 'user', <UserOutlined />),
        getItem('Sản phẩm', 'product', <AppstoreOutlined />),
        getItem('Đơn hàng', 'order', <ShoppingCartOutlined />), // 🧾 Thêm mục Đơn hàng
    ];

    const [keySelected, setKeySelected] = useState('user');

    const renderPage = (key) => {
        switch (key) {
            case 'user':
                return <AdminUser />;
            case 'product':
                return <AdminProduct />;
            case 'order': // 🧾 Thêm case cho đơn hàng
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
            <div style={{ display: 'flex' }}>
                <Menu
                    mode="inline"
                    style={{
                        width: 256,
                        boxShadow: '1px 1px 2px #ccc',
                        height: '100vh',
                    }}
                    items={items}
                    onClick={handleOnclick}
                />
                <div style={{ flex: 1, padding: '15px' }}>{renderPage(keySelected)}</div>
            </div>
        </>
    );
};

export default AdminPage;
