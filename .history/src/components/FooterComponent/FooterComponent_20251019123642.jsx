import React from 'react';
import { WrapperFooter, FooterTop, FooterBottom, FooterColumn, FooterTitle, FooterLink } from './style';
import { FacebookOutlined, YoutubeOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';

const FooterComponent = () => {
    return (
        <WrapperFooter>
            <FooterTop>
                <FooterColumn>
                    <FooterTitle>🏸 Về Chúng Tôi</FooterTitle>
                    <p>
                        Shop Cầu Lông HuySport chuyên cung cấp dụng cụ cầu lông chính hãng:
                        vợt, giày, quần áo, phụ kiện... Chúng tôi cam kết mang đến sản phẩm chất lượng và dịch vụ tốt nhất.
                    </p>
                </FooterColumn>

                <FooterColumn>
                    <FooterTitle>📞 Liên Hệ</FooterTitle>
                    <p><EnvironmentOutlined /> 123 Nguyễn Trãi, Quận 5, TP. HCM</p>
                    <p><PhoneOutlined /> 0909 888 999</p>
                    <p><MailOutlined /> huysport@gmail.com</p>
                </FooterColumn>

                <FooterColumn>
                    <FooterTitle>🔗 Chính Sách</FooterTitle>
                    <FooterLink>Chính sách bảo hành</FooterLink>
                    <FooterLink>Chính sách đổi trả</FooterLink>
                    <FooterLink>Chính sách giao hàng</FooterLink>
                    <FooterLink>Điều khoản sử dụng</FooterLink>
                </FooterColumn>

                <FooterColumn>
                    <FooterTitle>🌐 Kết Nối Với Chúng Tôi</FooterTitle>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                        <a href="https://facebook.com" target="_blank" rel="noreferrer"><FacebookOutlined style={{ fontSize: 24, color: '#1877f2' }} /></a>
                        <a href="https://youtube.com" target="_blank" rel="noreferrer"><YoutubeOutlined style={{ fontSize: 24, color: '#ff0000' }} /></a>
                    </div>
                </FooterColumn>
            </FooterTop>

            <FooterBottom>
                <p>© 2025 HuySport. All rights reserved.</p>
            </FooterBottom>
        </WrapperFooter>
    );
};

export default FooterComponent;
