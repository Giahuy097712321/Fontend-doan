import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import {
  WrapperTypeProductSection,
  WrapperTypeProductTitle,
  WapperTypeProduct,
  WrapperProducts,
  WrapperButtonMore
} from './style'
import CardComponent from '../../components/CardComponent/CardComponent'
import * as ProductService from '../../services/ProductService'
import Loading from '../../components/LoadingComponent/Loading'

const TypeProductPage = () => {
  const { type } = useParams()
  const [products, setProducts] = useState([])
  const [typeProducts, setTypeProducts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAllTypeProduct()
  }, [])

  useEffect(() => {
    if (type) {
      fetchProductByType(type)
    }
  }, [type])

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    if (res?.status === 'OK') setTypeProducts(res.data)
  }

  const fetchProductByType = async (type) => {
    setLoading(true)
    const res = await ProductService.getAllTypeProduct(type)
    if (res?.status === 'OK') setProducts(res.data)
    setLoading(false)
  }

  return (
    <Loading isLoading={loading}>
      <div style={{ width: '1270px', margin: '0 auto' }}>

        {/* 🧭 DANH MỤC - GIỐNG HOME PAGE */}
        <WrapperTypeProductSection>
          <WrapperTypeProductTitle>Danh mục sản phẩm</WrapperTypeProductTitle>
          <WapperTypeProduct>
            {typeProducts.map((item) => (
              <TypeProduct
                key={item}
                name={item}
              />
            ))}
          </WapperTypeProduct>
        </WrapperTypeProductSection>

        {/* 🛒 SẢN PHẨM THEO DANH MỤC */}
        <div style={{ backgroundColor: '#f8f9fb', padding: '40px 0', borderRadius: '16px', marginTop: '30px' }}>
          <WrapperProducts>
            {products.map((product) => (
              <CardComponent
                key={product._id}
                countInStock={product.countInStock}
                description={product.description}
                image={product.image}
                name={product.name}
                price={product.price}
                rating={product.rating}
                type={product.type}
                selled={product.selled}
                discount={product.discount}
                id={product._id}
              />
            ))}
          </WrapperProducts>
        </div>
      </div>
    </Loading>
  )
}

export default TypeProductPage
