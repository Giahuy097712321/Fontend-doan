import { Col, Row, Rate } from 'antd';
import React, { useState } from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import * as ProductService from '../../services/ProductService';
import Loading from './../LoadingComponent/Loading';
import ButtonComponent from './../ButtonComponent/ButtonComponent';
import { addOrderProduct } from '../../redux/sildes/orderSlide';
import {
    WrapprerStyleImageSmall,
    WrapperStyleColImage,
    WrapperStyleNameProduct,
    WrapperStyleTextSell,
    WrapperPriceProduct,
    WrapperPriceTextProduct,
    WrapperAddressProduct,
    WrapperQuanlityProduct,
    WrapperInputNumber,
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
            setNumProduct((prev) => (prev > 1 ? prev - 1 : 1)); // ✅ không giảm dưới 1
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
            // ✅ Hiển thị thông báo
            message.success('Sản phẩm đã được thêm vào giỏ hàng!');
        }
        console.log('productDetails', productDetails, user)
    }

    return (
        <Loading isLoading={isLoading}>
            <Row style={{ padding: '16px', background: '#fff', borderRadius: '4px' }}>
                <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '8px' }}>
                    <WrapprerStyleImageSmall
                        src={productDetails?.image}
                        alt="image product"
                        preview={false}
                    />
                </Col>
                <Col span={14} style={{ paddingLeft: '10px' }}>
                    <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
                    <div>
                        <Rate
                            allowHalf
                            value={productDetails?.rating}
                            style={{ color: 'yellow', fontSize: '12px', marginRight: '4px' }}
                        />
                        <WrapperStyleTextSell> | Đã bán 10.000+</WrapperStyleTextSell>
                    </div>
                    <WrapperPriceProduct>
                        <WrapperPriceTextProduct>{converPrice(productDetails?.price)}</WrapperPriceTextProduct>
                    </WrapperPriceProduct>
                    <WrapperAddressProduct>
                        <span>Giao đến- </span>
                        <span className="address">{user?.address}</span>
                        <span className="change-address">-Đổi địa chỉ</span>
                    </WrapperAddressProduct>
                    <LikeButtonComponent datailref={process.env.REACT_APP_IS_LOCAL ? "https://developers.facebook.com/docs/plugins/" : window.location.href} />

                    {/* ✅ Phần số lượng đã fix */}
                    <div
                        style={{
                            margin: '10px 0 20px',
                            padding: '10px 0',
                            borderTop: '1px solid #e5e5e5',
                            borderBottom: '1px solid #e5e5e5',
                        }}
                    >
                        <div style={{ marginBottom: '10px' }}>Số lượng</div>
                        <WrapperQuanlityProduct>
                            <button
                                style={{ border: 'none', background: 'transparent' }}
                                onClick={() => handleChangeCount('decrease')}
                            >
                                <MinusOutlined style={{ color: '#000', fontSize: '20px' }} />
                            </button>
                            <WrapperInputNumber
                                min={1}
                                value={numProduct}
                                onChange={onChange}
                                size="small"
                            />
                            <button
                                style={{ border: 'none', background: 'transparent' }}
                                onClick={() => handleChangeCount('increase')}
                            >
                                <PlusOutlined style={{ color: '#000', fontSize: '20px' }} />
                            </button>
                        </WrapperQuanlityProduct>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <ButtonComponent
                            variant="borderless"
                            size={40}
                            styleButton={{
                                background: 'rgb(255, 57, 69)',
                                height: '48px',
                                width: '220px',
                                border: 'none',
                                borderRadius: '4px',
                            }}
                            onClick={handleAddOrderProduct}
                            textButton={'Chọn mua'}
                            styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                        />
                        <ButtonComponent
                            variant="borderless"
                            size={40}
                            styleButton={{
                                background: '#fff',
                                height: '48px',
                                width: '220px',
                                border: '1px solid rgb(13,92,182)',
                                borderRadius: '4px',
                            }}
                            textButton={'Mua trả sau'}
                            styleTextButton={{ color: 'rgb(13,92,182)', fontSize: '15px' }}
                        />
                    </div>
                </Col>

            </Row>
            <CommentComponent datainer={
                process.env.REACT_APP_IS_LOCAL === "true"
                    ? "https://developers.facebook.com/docs/plugins/comments#configurator"
                    : window.location.href
            } width="100%" numPosts={5} />
        </Loading>
    );
};

export default ProductDetailsComponent;
