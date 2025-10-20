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
    SocialIcon
} from './style';
import { FacebookOutlined, YoutubeOutlined, MailOutlined, TikTokOutlined } from '@ant-design/icons';

const FooterComponent = () => {
    return (
        <FooterContainer>
            <FooterTop>
                <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                    <FooterTitle>GIỚI THIỆU</FooterTitle>
                    <FooterText>
                        Đây là website demo về cửa hàng điện máy được xây dựng với mục đích học tập và trình diễn.
                        Cảm ơn bạn đã ghé thăm!
                    </FooterText>

                    <FooterTitle style={{ marginTop: '20px' }}>LIÊN HỆ VỚI TÔI</FooterTitle>
                    <SocialIcons style={{ justifyContent: 'center', marginTop: '15px' }}>
                        <SocialIcon href="https://www.facebook.com/gia.huy.301836" target="_blank" color="#1877F2">
                            <FacebookOutlined />
                        </SocialIcon>
                        <SocialIcon href="https://www.tiktok.com/@giahuybuibiubbiu?lang=vi-VN" target="_blank" color="#000000">
                            <TikTokOutlined />
                        </SocialIcon>
                        <SocialIcon href="https://youtube.com/your-channel" target="_blank" color="#FF0000">
                            <YoutubeOutlined />
                        </SocialIcon>

                    </SocialIcons>
                </div>
            </FooterTop>

            <FooterDivider />

            <FooterBottom>
                <FooterSection>
                    <FooterText>
                        © 2024 Demo Website. Được tạo ra với sự đam mê lập trình.
                    </FooterText>
                    <FooterText style={{ fontSize: '12px', marginTop: '5px' }}>
                        Liên hệ: your-email@gmail.com | Theo dõi trên mạng xã hội
                    </FooterText>
                </FooterSection>
            </FooterBottom>
        </FooterContainer>
    );
};

export default FooterComponent;