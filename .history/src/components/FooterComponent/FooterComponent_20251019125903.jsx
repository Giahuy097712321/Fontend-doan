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
            <FooterTop>
                <FooterRow>
                    <FooterColumn>
                        <FooterTitle>DỊCH VỤ</FooterTitle>
                        <FooterLink href="/bao-hanh">Bảo hành</FooterLink>
                        <FooterLink href="/giao-hang">Giao hàng</FooterLink>
                        <FooterLink href="/tra-gop">Trả góp</FooterLink>
                    </FooterColumn>

                    <FooterColumn>
                        <FooterTitle>HỖ TRỢ</FooterTitle>
                        <FooterLink href="/lien-he">Liên hệ</FooterLink>
                        <FooterLink href="/huong-dan">Hướng dẫn mua</FooterLink>
                        <FooterLink href="/cua-hang">Cửa hàng</FooterLink>
                    </FooterColumn>
                </FooterRow>
            </FooterTop>

            <FooterDivider />

            <FooterBottom>
                <FooterSection>
                    <FooterTitle style={{ fontSize: '16px', marginBottom: '10px' }}>
                        CÔNG TY CỔ PHẦN THƯƠNG MẠI ĐIỆN MÁY VIỆT
                    </FooterTitle>
                    <FooterText>
                        © 2024 Điện Máy Việt. Tất cả các quyền được bảo lưu.
                    </FooterText>
                    <FooterText>
                        Giấy chứng nhận Đăng ký Kinh doanh số: 0123456789 do Sở Kế hoạch và Đầu tư TP.HCM cấp ngày 01/01/2020
                    </FooterText>
                </FooterSection>
            </FooterBottom>
        </FooterContainer>
    );
};

export default FooterComponent;