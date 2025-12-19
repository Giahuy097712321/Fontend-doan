import React, { useRef, useState, useEffect } from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import {
  HomeContainer,
  WrapperTypeProductSection,
  WrapperTypeProductTitle,
  WapperTypeProduct,
  WrapperButtonMore,
  WrapperProducts,
  WrapperSliderSection,
  ProductSection,
  SectionHeader,
  SectionTitle,
  SectionSubtitle,
  FeaturesSection,
  FeatureItem,
  BannerSection,
  TabContainer,
  TabButton,
  QuickActions,
  QuickActionButton,
  HotDealSection,
  CountdownTimer,
  FilterSection,
  SortSelect
} from './style'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import slider4 from '../../assets/images/silder4.jpg'
import slider5 from '../../assets/images/slider5.jpg'
import slider8 from '../../assets/images/slider8.png'
import CardComponent from './../../components/CardComponent/CardComponent';
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../services/ProductService'
import { useSelector } from 'react-redux';
import Loading from './../../components/LoadingComponent/Loading';
import { useDebounce } from './../../hooks/useDebounce';
import { computeEfficiency } from '../../utils';
import {
  CrownOutlined,
  SafetyCertificateOutlined,
  RocketOutlined,
  CustomerServiceOutlined,
  FireOutlined,
  StarOutlined,
  EyeOutlined,
  ThunderboltOutlined,
  GiftOutlined,
  TrophyOutlined,
  FilterOutlined
} from '@ant-design/icons';

const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
  const searchDebounce = useDebounce(searchProduct, 500)
  const [loading, setLoading] = useState(false)
  const [limit, setLimit] = useState(50) // Tăng limit để hiển thị nhiều sản phẩm hơn
  const [typeProducts, setTypeProducts] = useState([])
  const [activeTab, setActiveTab] = useState('featured')
  const [sortBy, setSortBy] = useState('default')
  const [hotDealTime, setHotDealTime] = useState(24 * 60 * 60) // 24 giờ

  // Thêm ref để cuộn đến phần sản phẩm
  const productSectionRef = useRef(null)

  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1]
    const search = context?.queryKey && context?.queryKey[2]
    const sort = context?.queryKey && context?.queryKey[3]
    let res = await ProductService.getAllProduct(search, limit)

    // Tính độ tiết kiệm điện cho mỗi sản phẩm trên frontend
    if (res?.data && Array.isArray(res.data)) {
      res.data = res.data.map(p => ({ ...p, efficiency: computeEfficiency(p) }))
    }

    // Sắp xếp sản phẩm
    if (sort && res?.data) {
      switch (sort) {
        case 'price_asc':
          res.data.sort((a, b) => a.price - b.price)
          break
        case 'price_desc':
          res.data.sort((a, b) => b.price - a.price)
          break
        case 'rating':
          res.data.sort((a, b) => (b.efficiency || b.rating || 0) - (a.efficiency || a.rating || 0))
          break
        case 'sold':
          res.data.sort((a, b) => b.selled - a.selled)
          break
        default:
          break
      }
    }

    return res
  }

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    if (res?.status === 'OK') setTypeProducts(res.data)
  }

  const { isLoading, data: products, isPreviousData } = useQuery({
    queryKey: ['products', limit, searchDebounce, sortBy],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
    keptPreviousData: true,
  })

  useEffect(() => {
    fetchAllTypeProduct()

    // Countdown timer
    const timer = setInterval(() => {
      setHotDealTime(prev => prev > 0 ? prev - 1 : 0)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Hàm cuộn đến phần sản phẩm
  const scrollToProductSection = () => {
    if (productSectionRef.current) {
      productSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  // Hàm xử lý khi click vào tab
  const handleTabClick = (tab) => {
    setActiveTab(tab)
    // Cuộn đến phần sản phẩm sau khi đổi tab
    setTimeout(() => {
      scrollToProductSection()
    }, 100)
  }

  // Hàm xử lý khi click vào quick action
  const handleQuickActionClick = (action) => {
    let targetTab = 'all'

    switch (action) {
      case 'Khuyến mãi':
        targetTab = 'hot'
        break
      case 'Deal sốc':
        targetTab = 'hot'
        break
      case 'Bán chạy':
        targetTab = 'bestseller'
        break
      case 'Mới về':
        targetTab = 'all'
        break
      case 'Đang xem':
        targetTab = 'featured'
        break
      default:
        targetTab = 'all'
    }

    setActiveTab(targetTab)
    // Cuộn đến phần sản phẩm
    setTimeout(() => {
      scrollToProductSection()
    }, 100)
  }

  // Hàm xử lý nút mua hàng trong banner
  const handleBuyNow = () => {
    setActiveTab('all')
    // Cuộn đến phần sản phẩm
    setTimeout(() => {
      scrollToProductSection()
    }, 100)
  }

  // Lọc sản phẩm theo tiêu chí mới - LẤY TẤT CẢ SẢN PHẨM
  const featuredProducts = products?.data?.filter(product => (product.efficiency || product.rating) === 5) || []
  const hotDealProducts = products?.data?.filter(product => product.discount >= 15) || [] // Từ 15% trở lên
  const bestSellingProducts = products?.data?.filter(product => product.selled > 10) || [] // Bán trên 10 sản phẩm

  // Hiển thị sản phẩm theo tab - HIỂN THỊ TẤT CẢ SẢN PHẨM
  const displayProducts = activeTab === 'featured' ? featuredProducts :
    activeTab === 'hot' ? hotDealProducts :
      activeTab === 'bestseller' ? bestSellingProducts :
        products?.data || []

  const features = [
    {
      icon: <SafetyCertificateOutlined />,
      title: 'Chính hãng 100%',
      description: 'Cam kết hàng chính hãng, đầy đủ tem bảo hành'
    },
    {
      icon: <RocketOutlined />,
      title: 'Giao hàng nhanh',
      description: 'Miễn phí giao hàng toàn quốc trong 24h'
    },
    {
      icon: <CustomerServiceOutlined />,
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ tư vấn chuyên nghiệp, nhiệt tình'
    },
    {
      icon: <CrownOutlined />,
      title: 'Bảo hành dài hạn',
      description: 'Bảo hành từ 12-24 tháng tại trung tâm'
    }
  ]

  const quickActions = [
    { icon: <GiftOutlined />, label: 'Khuyến mãi', color: '#e74c3c' },
    { icon: <ThunderboltOutlined />, label: 'Deal sốc', color: '#f39c12' },
    { icon: <TrophyOutlined />, label: 'Bán chạy', color: '#2ecc71' },
    { icon: <StarOutlined />, label: 'Mới về', color: '#9b59b6' },
    { icon: <EyeOutlined />, label: 'Đang xem', color: '#3498db' }
  ]

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Loading isLoading={isLoading || loading}>
      <HomeContainer>

        {/* 🎞 SLIDER BANNER CHÍNH */}
        <WrapperSliderSection>
          <SliderComponent arrImages={[slider4, slider5, slider8]} />
        </WrapperSliderSection>

        {/* ⚡ QUICK ACTIONS */}
        <QuickActions>
          {quickActions.map((action, index) => (
            <QuickActionButton
              key={index}
              color={action.color}
              onClick={() => handleQuickActionClick(action.label)}
            >
              <div className="action-icon">{action.icon}</div>
              <span>{action.label}</span>
            </QuickActionButton>
          ))}
        </QuickActions>

        {/* ✨ TÍNH NĂNG NỔI BẬT */}
        <FeaturesSection>
          {features.map((feature, index) => (
            <FeatureItem key={index}>
              <div className="feature-icon">
                {feature.icon}
              </div>
              <div className="feature-content">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </FeatureItem>
          ))}
        </FeaturesSection>

        {/* 🔥 DEAL SỐC - HIỂN THỊ TẤT CẢ SẢN PHẨM KHUYẾN MÃI */}
        <HotDealSection>
          <div className="deal-header">
            <FireOutlined className="fire-icon" />
            <h2>Deal Sốc Trong Ngày</h2>
            <CountdownTimer>
              ⏳ Kết thúc sau: {formatTime(hotDealTime)}
            </CountdownTimer>
          </div>
          <WrapperProducts>
            {hotDealProducts.map((product) => (
              <CardComponent
                key={product._id}
                countInStock={product.countInStock}
                description={product.description}
                image={product.image}
                name={product.name}
                price={product.price}
                efficiency={product.efficiency ?? product.rating}
                type={product.type}
                selled={product.selled}
                discount={product.discount}
                id={product._id}
              />
            ))}
          </WrapperProducts>
          {hotDealProducts.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: 'white',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              marginTop: '20px'
            }}>
              <h3 style={{ color: 'white', marginBottom: '8px' }}>
                Hiện chưa có deal sốc nào
              </h3>
              <p>Hãy quay lại sau để không bỏ lỡ ưu đãi hấp dẫn!</p>
            </div>
          )}
        </HotDealSection>

        {/* 🧭 DANH MỤC SẢN PHẨM */}
        <WrapperTypeProductSection>
          <SectionHeader>
            <SectionTitle>Danh Mục Sản Phẩm</SectionTitle>
            <SectionSubtitle>Khám phá đa dạng sản phẩm gia dụng điện tử chất lượng</SectionSubtitle>
          </SectionHeader>
          <WapperTypeProduct>
            {typeProducts.map((item) => (
              <TypeProduct name={item} key={item} />
            ))}
          </WapperTypeProduct>
        </WrapperTypeProductSection>

        {/* 🛒 SẢN PHẨM - Thêm ref vào đây */}
        <ProductSection ref={productSectionRef}>
          <SectionHeader>
            <SectionTitle>Sản Phẩm</SectionTitle>
            <SectionSubtitle>
              {activeTab === 'featured'
                ? `Những sản phẩm có độ tiết kiệm điện 5/5 (${featuredProducts.length} sản phẩm)`
                : activeTab === 'hot'
                  ? `Sản phẩm khuyến mãi từ 15% trở lên (${hotDealProducts.length} sản phẩm)`
                  : activeTab === 'bestseller'
                    ? `Sản phẩm bán chạy (trên 10 sản phẩm) (${bestSellingProducts.length} sản phẩm)`
                    : `Tất cả sản phẩm chất lượng (${products?.data?.length || 0} sản phẩm)`
              }
            </SectionSubtitle>
          </SectionHeader>

          {/* FILTER & SORT BAR */}
          <FilterSection>
            <TabContainer>
              <TabButton
                active={activeTab === 'featured'}
                onClick={() => handleTabClick('featured')}
              >
                ⭐ Nổi bật ({featuredProducts.length})
              </TabButton>
              <TabButton
                active={activeTab === 'bestseller'}
                onClick={() => handleTabClick('bestseller')}
              >
                🏆 Bán chạy ({bestSellingProducts.length})
              </TabButton>
              <TabButton
                active={activeTab === 'hot'}
                onClick={() => handleTabClick('hot')}
              >
                🔥 Khuyến mãi ({hotDealProducts.length})
              </TabButton>
              <TabButton
                active={activeTab === 'all'}
                onClick={() => handleTabClick('all')}
              >
                📦 Tất cả ({products?.data?.length || 0})
              </TabButton>
            </TabContainer>

            <div className="filter-controls">
              <SortSelect
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Mặc định</option>
                <option value="price_asc">Giá thấp đến cao</option>
                <option value="price_desc">Giá cao đến thấp</option>
                <option value="rating">Tiết kiệm điện cao nhất</option>
                <option value="sold">Bán chạy nhất</option>
              </SortSelect>
            </div>
          </FilterSection>

          <WrapperProducts>
            {displayProducts.map((product) => (
              <CardComponent
                key={product._id}
                countInStock={product.countInStock}
                description={product.description}
                image={product.image}
                name={product.name}
                price={product.price}
                efficiency={product.efficiency ?? product.rating}
                type={product.type}
                selled={product.selled}
                discount={product.discount}
                id={product._id}
              />
            ))}
          </WrapperProducts>

          {displayProducts.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666',
              background: '#f8f9fa',
              borderRadius: '8px',
              marginTop: '20px'
            }}>
              <h3 style={{ color: '#333', marginBottom: '8px' }}>
                Chưa có sản phẩm nào trong danh mục này
              </h3>
              <p>Hãy khám phá các danh mục khác</p>
            </div>
          )}

          {/* HIỂN THỊ NÚT XEM THÊM CHO TẤT CẢ CÁC TAB KHI CÓ NHIỀU SẢN PHẨM */}
          {products?.data?.length < (products?.total || 0) && (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
              <WrapperButtonMore
                textButton={isPreviousData ? 'Đang tải...' : "Xem thêm sản phẩm"}
                type="outline"
                styleButton={{
                  border: '2px solid #2c5aa0',
                  color: `${products?.total === products?.data?.length ? '#999' : '#2c5aa0'}`,
                  width: '240px',
                  height: '48px',
                  borderRadius: '8px',
                  background: 'white',
                  fontSize: '15px',
                  fontWeight: '600',
                }}
                disabled={products?.total === products?.data?.length || products?.totalPage === 1}
                styleTextButton={{
                  fontWeight: 600,
                  color: products?.total === products?.data?.length ? '#999' : '#2c5aa0'
                }}
                onClick={() => setLimit((prev) => prev + 12)}
              />
            </div>
          )}
        </ProductSection>

        {/* 📢 BANNER QUẢNG CÁO */}
        <BannerSection>
          <div className="banner-content">
            <h2>Ưu đãi đặc biệt cuối năm</h2>
            <p>Giảm giá lên đến 50% cho tất cả sản phẩm gia dụng điện tử</p>
            <button className="banner-button" onClick={handleBuyNow}>
              Mua ngay
            </button>
          </div>
        </BannerSection>

      </HomeContainer>
    </Loading>
  )
}

export default HomePage