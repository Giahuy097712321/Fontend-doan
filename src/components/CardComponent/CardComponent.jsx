import React from 'react'
import {
    StyleNameProduct,
    WrapperCardStyle,
    WrapperDiscountText,
    WrapperPriceText,
    WrapperReportText,
    WrapperStyleTextSell,
    WrapperImage
} from './style'
import { StarFilled } from '@ant-design/icons'
import logo from '../../assets/images/logo.jpg'
import { useNavigate } from 'react-router-dom';
import { converPrice } from './../../utils';
import { message } from 'antd';

const CardComponent = (props) => {
    const { countInStock, description, image, name, price, rating, type, discount, selled, id } = props
    const navigate = useNavigate();

    const handleDetailsProduct = (id) => {
        if (!id) {
            message.error('Sản phẩm không khả dụng');
            return;
        }
        navigate(`/product-details/${id}`)
    }

    return (
        <WrapperCardStyle
            hoverable
            onClick={() => countInStock !== 0 && handleDetailsProduct(id)}
            disabled={countInStock === 0}
        >
            <WrapperImage>
                <img alt="product" src={image} />
                {discount > 0 && (
                    <WrapperDiscountText>-{discount}%</WrapperDiscountText>
                )}
            </WrapperImage>

            <StyleNameProduct>{name}</StyleNameProduct>

            <WrapperReportText>
                <span style={{ marginRight: '4px' }}>
                    {rating} <StarFilled style={{ fontSize: '12px', color: '#FFD700' }} />
                </span>
                <WrapperStyleTextSell>| Đã bán {selled || 1000}+</WrapperStyleTextSell>
            </WrapperReportText>

            <WrapperPriceText>{converPrice(price)}</WrapperPriceText>
        </WrapperCardStyle>
    )
}

export default CardComponent
