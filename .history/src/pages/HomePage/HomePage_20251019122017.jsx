import React from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WrapperTypeProduct, WrapperButtonMore, WrapperProducts, WrapperTypeSection } from './style'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import slider1 from '../../assets/images/slider1.png'
import slider2 from '../../assets/images/slider2.png'
import slider3 from '../../assets/images/slider3.png'
import CardComponent from './../../components/CardComponent/CardComponent';
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../services/ProductService'
import { useSelector } from 'react-redux';
import { useRef, useState } from 'react';
import { useEffect } from 'react';
import Loading from './../../components/LoadingComponent/Loading';
import { useDebounce } from './../../hooks/useDebounce';
import ButtonComponent from './../../components/ButtonComponent/ButtonComponent';

const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
  const refSearch = useRef(false)
  const searchDebounce = useDebounce(searchProduct, 500)
  const [loading, setLoading] = useState(false)

  const [stateProducts, setStateProducts] = useState([])
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
    if (res?.status === 'OK') {
      setTypeProducts(res.data)
    }
  }
  const { isLoading, data: products, isPreViousData } = useQuery({
    queryKey: ['products', limit, searchDebounce],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000
    , keptPreviousData: true,
  })
  useEffect(() => {
    fetchAllTypeProduct()
  }, [])
  return (
    <Loading isLoading={isLoading || loading}>
      <div style={{ width: '1270px', margin: '0 auto' }}>
        {/* Phần danh mục sản phẩm được làm nổi bật */}
        <WrapperTypeSection>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#d70018',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            DANH MỤC SẢN PHẨM
          </h2>
          <WrapperTypeProduct>
            {typeProducts.map((item) => (
              <TypeProduct name={item} key={item} />
            ))}
          </WrapperTypeProduct>
        </WrapperTypeSection>

        <div className='body' style={{ width: '100%', backgroundColor: '#f5f5f5', padding: '20px 0' }}>

          <div
            id="container"
            style={{ width: '1270px', margin: '0 auto' }}
          >
            <SliderComponent arrImages={[slider1, slider2, slider3]} />

            <div style={{
              margin: '30px 0 15px 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 10px'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#333',
                margin: 0
              }}>
                SẢN PHẨM NỔI BẬT
              </h2>
              <span style={{
                color: '#d70018',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {products?.data?.length || 0} sản phẩm
              </span>
            </div>

            <WrapperProducts>
              {products?.data?.map((product) => {
                return (
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
                )
              })}
            </WrapperProducts >

            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <WrapperButtonMore
                textButton={isPreViousData ? 'load more' : "Xem thêm sản phẩm"}
                type="outline"
                styleButton={{
                  border: '1px solid #d70018',
                  color: `${products?.total === products?.data?.length ? '#ccc' : '#d70018'}`,
                  width: '240px',
                  height: '40px',
                  borderRadius: '6px',
                  backgroundColor: `${products?.total === products?.data?.length ? '#f5f5f5' : '#fff'}`,
                  fontWeight: 'bold'
                }}
                disabled={products?.total === products?.data?.length || products?.totalPage === 1}
                styleTextButton={{
                  fontWeight: 600,
                  color: products?.total === products?.data?.length ? '#999' : '#d70018',
                  fontSize: '14px'
                }}
                onClick={() => setLimit((prev) => prev + 6)}
              />
            </div>
          </div>
        </div>
      </div>
    </Loading>
  )
}
export default HomePage