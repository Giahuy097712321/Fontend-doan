import React, { useRef, useState, useEffect } from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import {
  WrapperTypeProductSection,
  WrapperTypeProductTitle,
  WapperTypeProduct,
  WrapperButtonMore,
  WrapperProducts,
  WrapperSliderSection
} from './style'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import slider1 from '../../assets/images/slider1.png'
import slider2 from '../../assets/images/slider2.png'
import slider3 from '../../assets/images/slider3.png'
import CardComponent from './../../components/CardComponent/CardComponent';
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../services/ProductService'
import { useSelector } from 'react-redux';
import Loading from './../../components/LoadingComponent/Loading';
import { useDebounce } from './../../hooks/useDebounce';

const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
  const refSearch = useRef(false)
  const searchDebounce = useDebounce(searchProduct, 500)
  const [loading, setLoading] = useState(false)
  const [limit, setLimit] = useState(6)
  const [typeProducts, setTypeProducts] = useState([])

  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1]
    const search = context?.queryKey && context?.queryKey[2]
    const res = await ProductService.getAllProduct(search, limit)
    return res
  }

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    if (res?.status === 'OK') setTypeProducts(res.data)
  }

  const { isLoading, data: products, isPreViousData } = useQuery({
    queryKey: ['products', limit, searchDebounce],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
    keptPreviousData: true,
  })

  useEffect(() => {
    fetchAllTypeProduct()
  }, [])

  return (
    <Loading isLoading={isLoading || loading}>
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

        {/* 🎞 SLIDER */}
        <WrapperSliderSection>
          <SliderComponent arrImages={[slider1, slider2, slider3]} />
        </WrapperSliderSection>

        {/* 🛒 SẢN PHẨM */}
        <div style={{ backgroundColor: '#f8f9fb', padding: '40px 0', borderRadius: '16px' }}>
          <WrapperProducts>
            {products?.data?.map((product) => (
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

          {/* Xem thêm */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
            <WrapperButtonMore
              textButton={isPreViousData ? 'Đang tải...' : "Xem thêm sản phẩm"}
              type="outline"
              styleButton={{
                border: '1px solid #0b74e5',
                color: `${products?.total === products?.data?.length ? '#ccc' : '#0b74e5'}`,
                width: '240px',
                height: '42px',
                borderRadius: '8px',
                background: 'white',
                transition: 'all 0.3s ease',
              }}
              disabled={products?.total === products?.data?.length || products?.totalPage === 1}
              styleTextButton={{ fontWeight: 600, color: products?.total === products?.data?.length && '#fff' }}
              onClick={() => setLimit((prev) => prev + 6)}
            />
          </div>
        </div>
      </div>
    </Loading>
  )
}

export default HomePage
