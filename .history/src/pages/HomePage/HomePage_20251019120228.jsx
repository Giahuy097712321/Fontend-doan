import React from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import {
  WapperTypeProduct,
  WrapperButtonMore,
  WrapperProducts,
  HomePageContainer,
  HeroSection,
  SectionTitle,
  ProductGrid,
  FeaturesSection,
  FeatureCard,
  BannerSection,
  LoadingContainer
} from './style'
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
import { CrownOutlined, RocketOutlined, SafetyCertificateOutlined, CustomerServiceOutlined } from '@ant-design/icons';

const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
  const refSearch = useRef(false)
  const searchDebounce = useDebounce(searchProduct, 500)
  const [loading, setLoading] = useState(false)

  const [stateProducts, setStateProducts] = useState([])
  const [limit, setLimit] = useState(8)
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

  const { isLoading, data: products, isPreviousData } = useQuery({
    queryKey: ['products', limit, searchDebounce],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true,
  })

  useEffect(() => {
    fetchAllTypeProduct()
  }, [])

  const features = [
    {
      icon: <RocketOutlined />,
      title: "Giao hàng siêu tốc",
      description: "Miễn phí giao hàng cho đơn từ 500K"
    },
    {
      icon: <SafetyCertificateOutlined />,
      title: "Bảo hành chính hãng",
      description: "Bảo hành 12-24 tháng toàn quốc"
    },
    {
      icon: <CustomerServiceOutlined />,
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ CSKH chuyên nghiệp"
    },
    {
      icon: <CrownOutlined />,
      title: "Sản phẩm chất lượng",
      description: "Cam kết hàng chính hãng 100%"
    }
  ]

  return (
    <Loading isLoading={isLoading || loading}>
      <HomePageContainer>
        {/* Hero Section với Slider */}
        <HeroSection>
          <div className="slider-container">
            <SliderComponent arrImages={[slider1, slider2, slider3]} />
          </div>
        </HeroSection>

        {/* Danh mục sản phẩm */}
        <div className="category-section">
          <SectionTitle>
            <span className="title-text">Danh Mục Nổi Bật</span>
            <div className="title-decoration"></div>
          </SectionTitle>
          <WapperTypeProduct>
            {typeProducts.map((item) => (
              <TypeProduct name={item} key={item} />
            ))}
          </WapperTypeProduct>
        </div>

        {/* Features Section */}
        <FeaturesSection>
          {features.map((feature, index) => (
            <FeatureCard key={index}>
              <div className="feature-icon">
                {feature.icon}
              </div>
              <div className="feature-content">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </FeatureCard>
          ))}
        </FeaturesSection>

        {/* Banner Section */}
        <BannerSection>
          <div className="banner-content">
            <h2>Ưu đãi đặc biệt cuối năm</h2>
            <p>Giảm giá lên đến 50% cho tất cả sản phẩm điện máy</p>
            <ButtonComponent
              textButton="Mua ngay"
              styleButton={{
                background: 'linear-gradient(135deg, #FF6B9D, #FF8E53)',
                border: 'none',
                color: 'white',
                padding: '12px 32px',
                borderRadius: '25px',
                fontWeight: '600',
                fontSize: '16px',
                marginTop: '20px'
              }}
              styleTextButton={{ color: 'white', fontWeight: '600' }}
            />
          </div>
        </BannerSection>

        {/* Sản phẩm */}
        <div className="products-section">
          <SectionTitle>
            <span className="title-text">Sản Phẩm Nổi Bật</span>
            <div className="title-decoration"></div>
          </SectionTitle>

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

          {/* Nút xem thêm */}
          {products?.data?.length > 0 && (
            <div className="load-more-section">
              <WrapperButtonMore
                textButton={isPreviousData ? 'Đang tải...' : "Xem thêm sản phẩm"}
                type="outline"
                styleButton={{
                  border: `2px solid ${products?.total === products?.data?.length ? '#ccc' : '#1890ff'}`,
                  color: `${products?.total === products?.data?.length ? '#ccc' : '#1890ff'}`,
                  width: '280px',
                  height: '48px',
                  borderRadius: '25px',
                  background: `${products?.total === products?.data?.length ? '#f5f5f5' : 'transparent'}`,
                  fontSize: '16px',
                  fontWeight: '600'
                }}
                disabled={products?.total === products?.data?.length || products?.totalPage === 1}
                styleTextButton={{
                  fontWeight: 600,
                  color: products?.total === products?.data?.length ? '#ccc' : '#1890ff'
                }}
                onClick={() => setLimit((prev) => prev + 8)}
              />
            </div>
          )}
        </div>

        {/* Không có sản phẩm */}
        {!isLoading && products?.data?.length === 0 && (
          <div className="no-products">
            <div className="no-products-content">
              <h3>Không tìm thấy sản phẩm phù hợp</h3>
              <p>Hãy thử tìm kiếm với từ khóa khác hoặc duyệt các danh mục sản phẩm</p>
            </div>
          </div>
        )}
      </HomePageContainer>
    </Loading>
  )
}

export default HomePage