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
                        <FooterTitle>VỀ CHÚNG TÔI</FooterTitle>
                        <FooterLink href="#">Giới thiệu công ty</FooterLink>
                        <FooterLink href="#">Tuyển dụng</FooterLink>
                        <FooterLink href="#">Góp ý, khiếu nại</FooterLink>
                        <FooterLink href="#">Tìm siêu thị</FooterLink>
                        <FooterLink href="#">Chính sách bảo mật</FooterLink>
                    </FooterColumn>

                    <FooterColumn>
                        <FooterTitle>HỖ TRỢ KHÁCH HÀNG</FooterTitle>
                        <FooterLink href="#">Hướng dẫn mua hàng</FooterLink>
                        <FooterLink href="#">Chính sách trả góp</FooterLink>
                        <FooterLink href="#">Chính sách bảo hành</FooterLink>
                        <FooterLink href="#">Vận chuyển và lắp đặt</FooterLink>
                        <FooterLink href="#">Chính sách đổi trả</FooterLink>
                    </FooterColumn>

                    <FooterColumn>
                        <FooterTitle>TIN TỨC & CẬP NHẬT</FooterTitle>
                        <FooterLink href="#">Tin khuyến mãi</FooterLink>
                        <FooterLink href="#">Đánh giá sản phẩm</FooterLink>
                        <FooterLink href="#">Video sản phẩm</FooterLink>
                        <FooterLink href="#">Hướng dẫn sử dụng</FooterLink>
                        <FooterLink href="#">Tin công nghệ</FooterLink>
                    </FooterColumn>

                    <FooterColumn>
                        <FooterTitle>LIÊN HỆ</FooterTitle>
                        <FooterText>
                            📞 Tổng đài: 1800.1060 (Miễn phí)
                        </FooterText>
                        <FooterText>
                            🕒 7:30 - 22:00 (T2 - CN)
                        </FooterText>
                        <FooterText>
                            📧 Email: cskh@dienmay.com
                        </FooterText>
                        <FooterText>
                            🏢 Địa chỉ: 123 Nguyễn Văn Linh, Quận 7, TP.HCM
                        </FooterText>

                        <FooterTitle style={{ marginTop: '15px' }}>KẾT NỐI VỚI CHÚNG TÔI</FooterTitle>
                        <SocialIcons>
                            <SocialIcon href="#" color="#1877F2">
                                <FacebookOutlined />
                            </SocialIcon>
                            <SocialIcon href="#" color="#FF0000">
                                <YoutubeOutlined />
                            </SocialIcon>
                            <SocialIcon href="#" color="#1DA1F2">
                                <TwitterOutlined />
                            </SocialIcon>
                            <SocialIcon href="#" color="#0068FF">

                            </SocialIcon>
                        </SocialIcons>
                    </FooterColumn>

                    <FooterColumn>
                        <FooterTitle>PHƯƠNG THỨC THANH TOÁN</FooterTitle>
                        <PaymentMethods>
                            <PaymentIcon>💳</PaymentIcon>
                            <PaymentIcon>🏦</PaymentIcon>
                            <PaymentIcon>📱</PaymentIcon>
                            <PaymentIcon>💰</PaymentIcon>
                            <PaymentIcon>💸</PaymentIcon>
                        </PaymentMethods>

                        <FooterTitle style={{ marginTop: '15px' }}>CHỨNG NHẬN</FooterTitle>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <div style={{
                                width: '80px',
                                height: '40px',
                                backgroundColor: '#f5f5f5',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                color: '#666'
                            }}>
                                BỘ CÔNG THƯƠNG
                            </div>
                            <div style={{
                                width: '80px',
                                height: '40px',
                                backgroundColor: '#f5f5f5',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                color: '#666'
                            }}>
                                DMCA
                            </div>
                        </div>
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