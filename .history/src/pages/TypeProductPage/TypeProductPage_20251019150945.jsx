import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as ProductService from '../../services/ProductService'
import CardComponent from '../../components/CardComponent/CardComponent'
import Loading from '../../components/LoadingComponent/Loading'
import { WrapperProducts } from './style'
import { useDebounce } from '../../hooks/useDebounce'
import { useSelector } from 'react-redux'

const TypeProductPage = () => {
  const { type } = useParams()
  const decodedType = decodeURIComponent(type || '') // ✅ Giải mã tên loại
  const searchProduct = useSelector((state) => state?.product?.search)
  const searchDebounce = useDebounce(searchProduct, 500)

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(8)
  const [total, setTotal] = useState(0)

  const fetchProductsByType = async () => {
    setLoading(true)
    try {
      const res = await ProductService.getProductType(decodedType, page, limit)
      if (res?.status === 'OK') {
        setProducts(res.data)
        setTotal(res.total)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductsByType()
    // eslint-disable-next-line
  }, [decodedType, page, limit, searchDebounce])

  return (
    <Loading isLoading={loading}>
      <div style={{ width: '1270px', margin: '0 auto', padding: '40px 0' }}>
        <h2 style={{ marginBottom: '20px' }}>Sản phẩm loại: {decodedType}</h2>
        <WrapperProducts>
          {products?.length > 0 ? (
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
            <p>Không có sản phẩm nào thuộc loại này.</p>
          )}
        </WrapperProducts>
      </div>
    </Loading>
  )
}

export default TypeProductPage
