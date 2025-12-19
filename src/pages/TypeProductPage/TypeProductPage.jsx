import React, { useState, useEffect, useCallback } from 'react'
import NavBarComponent from './../../components/NavbarComponent/NavbarComponent';
import CardComponent from './../../components/CardComponent/CardComponent';
import { Row, Col, Slider, Select, Button } from 'antd';
import {
  WrapperProducts,
  WrapperNavbar,
  WrapperHeader,
  WrapperCountText,
  FilterSection,
  WrapperTypeProductSection,
  WrapperTypeProductTitle,
  WapperTypeProduct
} from './style';
import { useLocation } from 'react-router-dom';
import * as ProductService from '../../services/ProductService'
import Loading from './../../components/LoadingComponent/Loading';
import { useSelector } from 'react-redux';
import { useDebounce } from './../../hooks/useDebounce';
import { FilterOutlined, DownOutlined, ReloadOutlined } from '@ant-design/icons';
import TypeProduct from '../../components/TypeProduct/TypeProduct';

const { Option } = Select;

const TypeProductPage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
  const searchDebounce = useDebounce(searchProduct, 500)
  const { state } = useLocation()

  const [allProducts, setAllProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [sortOption, setSortOption] = useState('default')
  const [priceRange, setPriceRange] = useState([0, 50000000])
  const [selectedEfficiency, setSelectedEfficiency] = useState(0)
  const [typeProducts, setTypeProducts] = useState([])

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    if (res?.status === 'OK') setTypeProducts(res.data)
  }

  // Fetch products từ API
  const fetchProductType = async (type) => {
    setLoading(true)
    try {
      const res = await ProductService.getProductType(type)
      if (res?.status === 'OK') {
        setAllProducts(res?.data)
        setFilteredProducts(res?.data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Áp dụng tất cả filter và sort - DÙNG useCallback
  const applyFiltersAndSort = useCallback(() => {
    let result = [...allProducts]

    // Filter theo search
    if (searchDebounce) {
      result = result.filter(product =>
        product?.name?.toLowerCase()?.includes(searchDebounce?.toLowerCase())
      )
    }

    // Filter theo khoảng giá
    result = result.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    // Filter theo độ tiết kiệm điện
    if (selectedEfficiency > 0) {
      result = result.filter(product =>
        (product.efficiency || product.rating || 0) >= selectedEfficiency
      )
    }

    // Sort sản phẩm
    switch (sortOption) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'name_asc':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name_desc':
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'rating':
        result.sort((a, b) => (b.efficiency || b.rating || 0) - (a.efficiency || a.rating || 0))
        break
      default:
        // Mặc định giữ nguyên thứ tự
        break
    }

    setFilteredProducts(result)
  }, [allProducts, searchDebounce, priceRange, selectedEfficiency, sortOption])

  // Reset tất cả filter
  const resetFilters = () => {
    setSortOption('default')
    setPriceRange([0, 50000000])
    setSelectedEfficiency(0)
    setFilteredProducts(allProducts)
  }

  useEffect(() => {
    fetchAllTypeProduct()
    if (state) {
      fetchProductType(state)
    }
  }, [state])

  useEffect(() => {
    applyFiltersAndSort()
  }, [applyFiltersAndSort]) // CHỈ CẦN applyFiltersAndSort VÌ NÓ ĐÃ CÓ TẤT CẢ DEPENDENCIES

  const handleSortChange = (value) => {
    setSortOption(value)
  }

  const handlePriceChange = (value) => {
    setPriceRange(value)
  }

  const handleEfficiencyChange = (rating) => {
    setSelectedEfficiency(rating === selectedEfficiency ? 0 : rating)
  }

  return (
    <Loading isLoading={loading}>
      <div style={{
        width: '100%',
        background: '#f8f9fa',
        minHeight: '100vh',
        padding: '16px 0'
      }}>
        <div style={{
          maxWidth: '1270px',
          margin: '0 auto',
          padding: '0 12px'
        }}>

          {/* 🧭 DANH MỤC SẢN PHẨM */}
          <WrapperTypeProductSection>
            <WrapperTypeProductTitle>Danh mục sản phẩm</WrapperTypeProductTitle>
            <WapperTypeProduct>
              {typeProducts.map((item) => (
                <TypeProduct name={item} key={item} />
              ))}
            </WapperTypeProduct>
          </WrapperTypeProductSection>

          {/* Header Section */}
          <WrapperHeader>
            <div>
              <h1 style={{
                fontSize: '22px',
                fontWeight: '600',
                color: '#2c3e50',
                marginBottom: '6px'
              }}>
                {state || 'Tất cả sản phẩm'}
              </h1>
              <WrapperCountText>
                {filteredProducts?.length || 0} sản phẩm
              </WrapperCountText>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontWeight: '400', color: '#7f8c8d', fontSize: '14px' }}>Sắp xếp:</span>
              <Select
                value={sortOption}
                onChange={handleSortChange}
                style={{ width: 180 }}
                suffixIcon={<DownOutlined />}
              >
                <Option value="default">Mặc định</Option>
                <Option value="price_asc">Giá thấp đến cao</Option>
                <Option value="price_desc">Giá cao đến thấp</Option>
                <Option value="name_asc">Tên A-Z</Option>
                <Option value="name_desc">Tên Z-A</Option>
                <Option value="rating">Tiết kiệm điện cao nhất</Option>
              </Select>
            </div>
          </WrapperHeader>

          <Row gutter={[24, 24]} style={{ marginTop: '20px' }}>
            {/* Sidebar Filter */}
            <Col xs={24} md={6}>
              <WrapperNavbar>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                  paddingBottom: '16px',
                  borderBottom: '2px solid #f0f0f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FilterOutlined style={{ color: '#d70018' }} />
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      margin: 0,
                      color: '#333'
                    }}>
                      Bộ lọc
                    </h3>
                  </div>
                  <Button
                    type="text"
                    icon={<ReloadOutlined />}
                    onClick={resetFilters}
                    style={{ color: '#d70018' }}
                  >
                    Reset
                  </Button>
                </div>

                {/* Price Range Filter */}
                <FilterSection>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '12px',
                    color: '#333'
                  }}>
                    Khoảng giá
                  </h4>
                  <div style={{ padding: '0 8px' }}>
                    <Slider
                      range
                      min={0}
                      max={50000000}
                      step={1000000}
                      value={priceRange}
                      onChange={handlePriceChange}
                      tooltip={{
                        formatter: (value) => `${(value / 1000000).toFixed(0)}tr`
                      }}
                    />
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '8px',
                      fontSize: '12px',
                      color: '#666'
                    }}>
                      <span>0đ</span>
                      <span>50.000.000đ</span>
                    </div>
                  </div>
                </FilterSection>

                {/* Rating Filter */}
                <FilterSection>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '12px',
                    color: '#333'
                  }}>
                    Độ tiết kiệm điện
                  </h4>
                  <NavBarComponent
                    selectedEfficiency={selectedEfficiency}
                    onEfficiencyChange={handleEfficiencyChange}
                  />
                </FilterSection>
              </WrapperNavbar>
            </Col>

            {/* Product Grid */}
            <Col xs={24} md={18}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '600px'
              }}>
                <WrapperProducts>
                  {filteredProducts?.map((product) => (
                    <div key={product._id} style={{ display: 'flex' }}>
                      <CardComponent
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
                    </div>
                  ))}
                </WrapperProducts>

                {filteredProducts?.length === 0 && !loading && (
                  <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    color: '#666',
                    background: '#fff',
                    borderRadius: '12px',
                    marginTop: '20px'
                  }}>
                    <h3 style={{ color: '#333', marginBottom: '8px' }}>Không tìm thấy sản phẩm phù hợp</h3>
                    <p>Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác</p>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Loading>
  )
}

export default TypeProductPage