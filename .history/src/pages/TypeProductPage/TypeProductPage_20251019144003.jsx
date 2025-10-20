import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as ProductService from '../../services/ProductService'
import Loading from '../../components/LoadingComponent/Loading'
import CardComponent from '../../components/CardComponent/CardComponent'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import {
  WrapperTypeProductSection,
  WrapperTypeProductTitle,
  WapperTypeProduct,
  WrapperProducts,
} from './style'

const TypeProductPage = () => {
  const { type } = useParams() // lấy loại sản phẩm từ URL (vd: /type/Điện thoại)
  const [products, setProducts] = useState([])
  const [typeProducts, setTypeProducts] = useState([])
  const [loading, setLoading] = useState(false)

  // 🧩 Lấy toàn bộ loại sản phẩm
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    if (res?.status === 'OK') setTypeProducts(res.data)
  }

  // 🧩 Lấy sản phẩm theo loại
  const fetchProductsByType = async (type) => {
    setLoading(true)
    try {
      // Nếu backend bạn chưa có hàm riêng -> dùng getAllProduct + filter type
      const res = await ProductService.getAllProduct()
      if (res?.status === 'OK') {
        const filtered = res.data.filter((p) => p.type === type)
        setProducts(filtered)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllTypeProduct()
  }, [])

  useEffect(() => {
    if (type) fetchProductsByType(type)
  }, [type])

  return (
    <Loading isLoading={loading}>
      <div style={{ width: '1270px', margin: '0 auto' }}>
        {/* 🧭 DANH MỤC */}
        <WrapperTypeProductSection>
          <WrapperTypeProductTitle>Danh mục sản phẩm</WrapperTypeProductTitle>
          <WapperTypeProduct>
            {typeProducts.map((item) => (
              <TypeProduct name={item} key={item} />
            ))}
          </WapperTypeProduct>
        </WrapperTypeProductSection>

        {/* 🛒 SẢN PHẨM THEO LOẠI */}
        <div style={{ backgroundColor: '#f8f9fb', padding: '40px 0', borderRadius: '16px' }}>
          <WrapperProducts>
            {products.length > 0 ? (
              products.map((product) => (
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
              ))
            ) : (
              <p style={{ textAlign: 'center', width: '100%', color: '#777' }}>
                Không có sản phẩm nào thuộc loại này
              </p>
            )}
          </WrapperProducts>
        </div>
      </div>
    </Loading>
  )
}

export default TypeProductPage
