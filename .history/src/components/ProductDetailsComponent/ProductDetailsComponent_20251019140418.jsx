import { Col, Row, Rate } from 'antd';
import React, { useState } from 'react';
import { MinusOutlined, PlusOutlined, SafetyCertificateOutlined, TruckOutlined, SyncOutlined } from '@ant-design/icons';
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
    WrapperProductInfo
} from './style';
import { useQuery } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { converPrice, initFacebookSDK } from './../../utils';
import { message } from 'antd';
import LikeButtonComponent from './../LikeButtonComponent/LikeButtonComponent';
import CommentComponent from './../CommentComponent/CommentComponent';
import { useEffect, useMemo } from 'react';

const ProductDetailsComponent = ({ idProduct }) => {

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch()
    const [numProduct, setNumProduct] = useState(1);
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
                                        opacity: numProduct <= 1 ? 0.5 : 1
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
                                        cursor: 'pointer'
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
                                    width: '200px',
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
                            <ButtonComponent
                                variant="borderless"
                                size={40}
                                styleButton={{
                                    background: '#fff',
                                    height: '50px',
                                    width: '200px',
                                    border: '2px solid #d70018',
                                    borderRadius: '6px',
                                }}
                                textButton={'Mua ngay'}
                                styleTextButton={{
                                    color: '#d70018',
                                    fontSize: '16px',
                                    fontWeight: '600'
                                }}
                            />
                        </WrapperButtonGroup>
                    </WrapperProductInfo>
                </Col>
            </Row>

            {/* Phần bình luận */}
            <div style={{ marginTop: '20px' }}>
                <CommentComponent
                    datainer={
                        process.env.REACT_APP_IS_LOCAL === "true"
                            ? "https://developers.facebook.com/docs/plugins/comments#configurator"
                            : window.location.href
                    }
                    width="100%"
                    numPosts={5}
                />
            </div>
        </Loading>
    );
};

export default ProductDetailsComponent;