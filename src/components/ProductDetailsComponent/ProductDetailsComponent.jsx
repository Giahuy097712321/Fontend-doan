// src/components/ProductDetailsComponent/ProductDetailsComponent.jsx
import { Col, Row, Rate, Tabs } from 'antd';
import React, { useState } from 'react';
import { MinusOutlined, PlusOutlined, SafetyCertificateOutlined, TruckOutlined, SyncOutlined, FileTextOutlined, InfoCircleOutlined } from '@ant-design/icons';
import * as ProductService from '../../services/ProductService';
import Loading from './../LoadingComponent/Loading';
import ButtonComponent from './../ButtonComponent/ButtonComponent';
import { addOrderProduct } from '../../redux/sildes/orderSlide';
import {
    WrapprerStyleImageSmall,
    WrapperStyleNameProduct,
    WrapperStyleTextSell,
    WrapperPriceProduct,
    WrapperPriceTextProduct,
    WrapperAddressProduct,
    WrapperQuanlityProduct,
    WrapperInputNumber,
    WrapperInfoSection,
    WrapperPolicyItem,
    WrapperButtonGroup,
    WrapperProductImage,
    WrapperProductInfo,
    WrapperDescription,
    WrapperTabsContainer,
    WrapperEmptyDescription
} from './style';
import { useQuery } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { converPrice, initFacebookSDK } from './../../utils';
import { message } from 'antd';
import LikeButtonComponent from './../LikeButtonComponent/LikeButtonComponent';
import CommentComponent from './../CommentComponent/CommentComponent';
import { useEffect } from 'react';

const ProductDetailsComponent = ({ idProduct }) => {

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch()
    const [numProduct, setNumProduct] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const user = useSelector((state) => state.user)
    const onChange = (value) => {
        if (value >= 1) setNumProduct(Number(value));
    };

    const fetchGetDetailsProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1];
        if (id) {
            const res = await ProductService.getDetailsProduct(id);
            return res.data;
        }
    };

    const { isLoading, data: productDetails } = useQuery({
        queryKey: ['product-details', idProduct],
        queryFn: fetchGetDetailsProduct,
        enabled: !!idProduct,
    });

    const handleChangeCount = (type) => {
        if (type === 'increase') {
            setNumProduct((prev) => prev + 1);
        } else if (type === 'decrease') {
            setNumProduct((prev) => (prev > 1 ? prev - 1 : 1));
        }
    };

    useEffect(() => {
        initFacebookSDK();
    }, [])

    const handleAddOrderProduct = () => {
        if (!user?.id) {
            navigate('/sign-in', { state: location?.pathname })
        } else {
            dispatch(addOrderProduct({
                orderItem: {
                    name: productDetails?.name,
                    amount: numProduct,
                    image: productDetails?.image,
                    price: productDetails?.price,
                    product: productDetails?._id,
                    discount: productDetails?.discount || 0,
                }
            }));
            message.success('Sản phẩm đã được thêm vào giỏ hàng!');
        }
    }

    // Format mô tả thành các đoạn văn
    const formatDescription = (description) => {
        if (!description) {
            return (
                <WrapperEmptyDescription>
                    <InfoCircleOutlined className="empty-icon" />
                    <p>Chưa có mô tả cho sản phẩm này</p>
                </WrapperEmptyDescription>
            );
        }

        // Tách description thành các đoạn dựa trên dấu xuống dòng
        const paragraphs = description.split('\n').filter(para => para.trim() !== '');

        return (
            <div className="description-content">
                {paragraphs.map((paragraph, index) => (
                    <p key={index}>
                        {paragraph}
                    </p>
                ))}
            </div>
        );
    };

    const tabItems = [
        {
            key: 'description',
            label: (
                <span>
                    <FileTextOutlined />
                    Mô tả sản phẩm
                </span>
            ),
            children: (
                <WrapperDescription>
                    {formatDescription(productDetails?.description)}

                    {/* Thông số kỹ thuật nếu có */}
                    {productDetails?.specifications && Object.keys(productDetails.specifications).length > 0 && (
                        <div className="specifications">
                            <h3>Thông số kỹ thuật</h3>
                            <div className="specs-list">
                                {Object.entries(productDetails.specifications).map(([key, value]) => (
                                    <div key={key} className="spec-item">
                                        <span className="spec-key">{key}:</span>
                                        <span className="spec-value">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </WrapperDescription>
            ),
        },
        {
            key: 'comments',
            label: `Bình luận (${productDetails?.commentCount || 0})`,
            children: (
                <CommentComponent
                    datainer={
                        process.env.REACT_APP_IS_LOCAL === "true"
                            ? "https://developers.facebook.com/docs/plugins/comments#configurator"
                            : window.location.href
                    }
                    width="100%"
                    numPosts={5}
                />
            ),
        },
    ];

    return (
        <Loading isLoading={isLoading}>
            <Row style={{ padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                {/* Phần hình ảnh */}
                <Col span={10} style={{ paddingRight: '20px' }}>
                    <WrapperProductImage
                        src={productDetails?.image}
                        alt="image product"
                        preview={false}
                    />
                </Col>

                {/* Phần thông tin sản phẩm */}
                <Col span={14}>
                    <WrapperProductInfo>
                        <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>

                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                            <Rate
                                allowHalf
                                value={productDetails?.rating}
                                style={{ color: '#ffd700', fontSize: '16px', marginRight: '8px' }}
                            />
                            <WrapperStyleTextSell> | Đã bán {productDetails?.selled || '10,000'}+</WrapperStyleTextSell>
                        </div>

                        <WrapperPriceProduct>
                            <WrapperPriceTextProduct>
                                {converPrice(productDetails?.price)}
                                {productDetails?.discount > 0 && (
                                    <span style={{ fontSize: '16px', color: '#d70018', marginLeft: '10px' }}>
                                        -{productDetails?.discount}%
                                    </span>
                                )}
                            </WrapperPriceTextProduct>
                        </WrapperPriceProduct>

                        {/* Thông tin giao hàng */}
                        <WrapperAddressProduct>
                            <span style={{ fontWeight: '500' }}>Giao đến </span>
                            <span className="address">{user?.address || 'Chưa chọn địa chỉ'}</span>
                            <span className="change-address"> - Đổi địa chỉ</span>
                        </WrapperAddressProduct>

                        {/* Chính sách bán hàng */}
                        <WrapperInfoSection>
                            <WrapperPolicyItem>
                                <SafetyCertificateOutlined style={{ color: '#d70018' }} />
                                <span>Bảo hành 12 tháng chính hãng</span>
                            </WrapperPolicyItem>
                            <WrapperPolicyItem>
                                <TruckOutlined style={{ color: '#d70018' }} />
                                <span>Giao hàng miễn phí toàn quốc</span>
                            </WrapperPolicyItem>
                            <WrapperPolicyItem>
                                <SyncOutlined style={{ color: '#d70018' }} />
                                <span>Đổi trả trong 30 ngày</span>
                            </WrapperPolicyItem>
                        </WrapperInfoSection>

                        <LikeButtonComponent
                            datailref={process.env.REACT_APP_IS_LOCAL ? "https://developers.facebook.com/docs/plugins/" : window.location.href}
                        />

                        {/* Phần số lượng */}
                        <div style={{
                            margin: '20px 0',
                            padding: '15px 0',
                            borderTop: '1px solid #f0f0f0',
                            borderBottom: '1px solid #f0f0f0'
                        }}>
                            <div style={{ marginBottom: '12px', fontWeight: '500' }}>Số lượng</div>
                            <WrapperQuanlityProduct>
                                <button
                                    style={{
                                        border: 'none',
                                        background: 'transparent',
                                        cursor: numProduct <= 1 ? 'not-allowed' : 'pointer',
                                        opacity: numProduct <= 1 ? 0.5 : 1,
                                        padding: '4px 8px',
                                        borderRadius: '4px'
                                    }}
                                    onClick={() => handleChangeCount('decrease')}
                                    disabled={numProduct <= 1}
                                >
                                    <MinusOutlined style={{ color: '#000', fontSize: '16px' }} />
                                </button>
                                <WrapperInputNumber
                                    min={1}
                                    value={numProduct}
                                    onChange={onChange}
                                    size="small"
                                />
                                <button
                                    style={{
                                        border: 'none',
                                        background: 'transparent',
                                        cursor: 'pointer',
                                        padding: '4px 8px',
                                        borderRadius: '4px'
                                    }}
                                    onClick={() => handleChangeCount('increase')}
                                >
                                    <PlusOutlined style={{ color: '#000', fontSize: '16px' }} />
                                </button>
                            </WrapperQuanlityProduct>
                        </div>

                        {/* Nhóm nút hành động */}
                        <WrapperButtonGroup>
                            <ButtonComponent
                                variant="borderless"
                                size={40}
                                styleButton={{
                                    background: 'linear-gradient(135deg, #d70018 0%, #ff4757 100%)',
                                    height: '50px',
                                    width: '100%',
                                    border: 'none',
                                    borderRadius: '6px',
                                    boxShadow: '0 4px 12px rgba(215, 0, 24, 0.3)'
                                }}
                                onClick={handleAddOrderProduct}
                                textButton={'Thêm vào giỏ hàng'}
                                styleTextButton={{
                                    color: '#fff',
                                    fontSize: '16px',
                                    fontWeight: '600'
                                }}
                            />
                        </WrapperButtonGroup>
                    </WrapperProductInfo>
                </Col>
            </Row>

            {/* Phần mô tả và bình luận - Sử dụng Tabs */}
            <div style={{ marginTop: '20px', background: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <WrapperTabsContainer>
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={tabItems}
                        size="large"
                    />
                </WrapperTabsContainer>
            </div>
        </Loading>
    );
};

export default ProductDetailsComponent;