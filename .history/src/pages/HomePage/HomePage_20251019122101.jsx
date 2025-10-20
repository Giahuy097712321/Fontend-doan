import React from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WapperTypeProduct, WrapperButtonMore, WrapperProducts } from './style'
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
        <WapperTypeProduct>
          {typeProducts.map((item) => (
            <TypeProduct name={item} key={item} />
          ))}
        </WapperTypeProduct>
        <div className='body' style={{ width: '100%', backgroundColor: '#efefef', }}>

          <div
            id="container"
            style={{ height: '1000px', width: '1270px', margin: '0 auto' }}
          >
            <SliderComponent arrImages={[slider1, slider2, slider3]} />
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
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <WrapperButtonMore
                textButton={isPreViousData ? 'load more' : "Xem thêm"}
                type="outline"
                styleButton={{
                  border: '1px solid rgb(11, 116, 229)',
                  color: `${products?.total === products?.data?.length ? '#ccc' : 'rgb(11, 116, 229)'}`,
                  width: '240px',
                  height: '38px',
                  borderRadius: '4px'
                }}
                disabled={products?.total === products?.data?.length || products?.totalPage === 1}
                styleTextButton={{ fontWeight: 500, color: products?.total === products?.data?.length && '#fff' }}
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
