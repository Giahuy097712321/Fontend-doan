import React from 'react';
import {
    FooterContainer,
    FooterTop,
    FooterBottom,
    FooterSection,
    FooterTitle,
    FooterLink,
    FooterText,
    FooterDivider,
    SocialIcons,
    SocialIcon,
    PaymentMethods,
    PaymentIcon,
    FooterRow,
    FooterColumn
} from './style';
import { FacebookOutlined, YoutubeOutlined, TwitterOutlined, ZaloOutlined } from '@ant-design/icons';

const FooterComponent = () => {
    return (
        <FooterContainer>
            <FooterContent>
                {/* 🏸 Cột 1: Giới thiệu */}
                <FooterColumn>
                    <FooterTitle>VỀ CHÚNG TÔI</FooterTitle>
                    <FooterLink href="#">Giới thiệu cửa hàng</FooterLink>
                    <FooterLink href="#">Tuyển dụng</FooterLink>
                    <FooterLink href="#">Chính sách bảo mật</FooterLink>
                </FooterColumn>

                {/* 🛒 Cột 2: Hỗ trợ khách hàng */}
                <FooterColumn>
                    <FooterTitle>HỖ TRỢ KHÁCH HÀNG</FooterTitle>
                    <FooterLink href="#">Hướng dẫn mua hàng</FooterLink>
                    <FooterLink href="#">Chính sách đổi trả</FooterLink>
                    <FooterLink href="#">Chính sách bảo hành</FooterLink>
                    <FooterLink href="#">Chính sách vận chuyển</FooterLink>
                </FooterColumn>

                {/* ☎️ Cột 3: Liên hệ */}
                <FooterColumn>
                    <FooterTitle>LIÊN HỆ</FooterTitle>
                    <FooterText>Địa chỉ: 123 Nguyễn Văn Linh, Q.7, TP.HCM</FooterText>
                    <FooterText>Hotline: 0909 888 777</FooterText>
                    <FooterText>Email: support@caulongshop.vn</FooterText>

                    <SocialIcons>
                        <a href="https://facebook.com" target="_blank" rel="noreferrer">
                            <FacebookOutlined />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer">
                            <InstagramOutlined />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noreferrer">
                            <YoutubeOutlined />
                        </a>
                        {/* Zalo icon dùng ảnh riêng */}
                        <a href="https://zalo.me/0909888777" target="_blank" rel="noreferrer">
                            <img
                                src={require('../../assets/icons/zalo-icon.png')}
                                alt="Zalo"
                                style={{ width: 20, height: 20 }}
                            />
                        </a>
                    </SocialIcons>
                </FooterColumn>
            </FooterContent>

            <FooterBottom>
                © {new Date().getFullYear()} Cầu Lông Shop. All rights reserved.
            </FooterBottom>
        </FooterContainer>

    );
};

export default FooterComponent;