import React, { useState, useEffect } from 'react'
import NavBarComponent from './../../components/NavbarComponent/NavbarComponent';
import CardComponent from './../../components/CardComponent/CardComponent';
import { Row, Col, Pagination, Slider, Select, Button } from 'antd';
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
  const [selectedTypes, setSelectedTypes] = useState([])
  const [selectedRating, setSelectedRating] = useState(0)
  const [typeProducts, setTypeProducts] = useState([])

  const [paginate, setPaginate] = useState({
    page: 0,
    limit: 12,
    total: 1,
  })

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    if (res?.status === 'OK') setTypeProducts(res.data)
  }

  // Fetch products từ API
  const fetchProductType = async (type, page, limit) => {
    setLoading(true)
    try {
      const res = await ProductService.getProductType(type, page, limit)
      if (res?.status === 'OK') {
        setAllProducts(res?.data)
        setFilteredProducts(res?.data)
        setPaginate({ ...paginate, total: res?.totalPage })
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Áp dụng tất cả filter và sort
  const applyFiltersAndSort = () => {
    let result = [...allProducts]

    // Filter theo search
    if (searchDebounce) {
      result = result.filter(product =>
        product?.name?.toLowerCase()?.includes(searchDebounce?.toLowerCase())
      )
    }

    // Filter theo loại sản phẩm
    if (selectedTypes.length > 0) {
      result = result.filter(product =>
        selectedTypes.includes(product.type)
      )
    }

    // Filter theo khoảng giá
    result = result.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    // Filter theo rating
    if (selectedRating > 0) {
      result = result.filter(product =>
        product.rating >= selectedRating
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
        result.sort((a, b) => b.rating - a.rating)
        break
      default:
        // Mặc định giữ nguyên thứ tự
        break
    }

    setFilteredProducts(result)
  }

  // Reset tất cả filter
  const resetFilters = () => {
    setSortOption('default')
    setPriceRange([0, 50000000])
    setSelectedTypes([])
    setSelectedRating(0)
    setFilteredProducts(allProducts)
  }

  useEffect(() => {
    fetchAllTypeProduct()
    if (state) {
      fetchProductType(state, paginate.page, paginate.limit)
    }
  }, [state, paginate.page, paginate.limit])

  useEffect(() => {
    applyFiltersAndSort()
  }, [searchDebounce, selectedTypes, priceRange, selectedRating, sortOption, allProducts])

  const onChange = (current, pageSize) => {
    setPaginate({ ...paginate, page: current - 1, limit: pageSize })
  }

  const handleSortChange = (value) => {
    setSortOption(value)
  }

  const handlePriceChange = (value) => {
    setPriceRange(value)
  }

  const handleTypeChange = (values) => {
    setSelectedTypes(values)
  }

  const handleRatingChange = (rating) => {
    setSelectedRating(rating === selectedRating ? 0 : rating)
  }

  return (
    <Loading isLoading={loading}>
      <div style={{
        width: '100%',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ed 100%)',
        minHeight: '100vh',
        padding: '20px 0'
      }}>
        <div style={{
          maxWidth: '1270px',
          margin: '0 auto',
          padding: '0 15px'
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
                fontSize: '28px',
                fontWeight: '700',
                color: '#333',
                marginBottom: '8px'
              }}>
                {state || 'Tất cả sản phẩm'}
              </h1>
              <WrapperCountText>
                {filteredProducts?.length || 0} sản phẩm
              </WrapperCountText>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontWeight: '500', color: '#666' }}>Sắp xếp:</span>
              <Select
                value={sortOption}
                onChange={handleSortChange}
                style={{ width: 200 }}
                suffixIcon={<DownOutlined />}
              >
                <Option value="default">Mặc định</Option>
                <Option value="price_asc">Giá thấp đến cao</Option>
                <Option value="price_desc">Giá cao đến thấp</Option>
                <Option value="name_asc">Tên A-Z</Option>
                <Option value="name_desc">Tên Z-A</Option>
                <Option value="rating">Đánh giá cao nhất</Option>
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

                {/* Product Type Filter */}
                <FilterSection>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '12px',
                    color: '#333'
                  }}>
                    Danh mục
                  </h4>
                  <Select
                    mode="multiple"
                    placeholder="Chọn loại sản phẩm"
                    value={selectedTypes}
                    onChange={handleTypeChange}
                    style={{ width: '100%' }}
                    optionLabelProp="label"
                  >
                    {typeProducts.map(type => (
                      <Option key={type} value={type} label={type}>
                        {type}
                      </Option>
                    ))}
                  </Select>
                </FilterSection>

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
                    Đánh giá
                  </h4>
                  <NavBarComponent
                    selectedRating={selectedRating}
                    onRatingChange={handleRatingChange}
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

                {/* Pagination */}
                {filteredProducts?.length > 0 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '32px',
                    padding: '20px 0'
                  }}>
                    <Pagination
                      current={paginate.page + 1}
                      total={paginate.total * 10}
                      onChange={onChange}
                      pageSize={paginate.limit}
                      showSizeChanger
                      showQuickJumper
                      showTotal={(total, range) =>
                        `${range[0]}-${range[1]} của ${total} sản phẩm`
                      }
                    />
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