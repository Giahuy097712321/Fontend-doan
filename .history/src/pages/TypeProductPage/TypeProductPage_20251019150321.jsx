import React, { useState, useEffect } from 'react'
import { Row, Col, Pagination, Slider, Select, Button, Rate } from 'antd'
import { FilterOutlined, DownOutlined, ReloadOutlined } from '@ant-design/icons'
import { WrapperProducts, WrapperNavbar, WrapperHeader, WrapperCountText, FilterSection } from './style'
import CardComponent from './../../components/CardComponent/CardComponent'
import Loading from './../../components/LoadingComponent/Loading'
import * as ProductService from '../../services/ProductService'
import { useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { useDebounce } from './../../hooks/useDebounce'

const { Option } = Select

const TypeProductPage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
  const searchDebounce = useDebounce(searchProduct, 500)
  const { type } = useParams()
  const decodedType = decodeURIComponent(type || '')
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [sortOption, setSortOption] = useState('default')
  const [priceRange, setPriceRange] = useState([0, 50000000])
  const [selectedType, setSelectedType] = useState(decodedType)
  const [selectedRating, setSelectedRating] = useState(0)
  const [paginate, setPaginate] = useState({ page: 1, limit: 12, total: 0 })
  const [typeProducts, setTypeProducts] = useState([])

  useEffect(() => {
    if (decodedType) setSelectedType(decodedType)
  }, [decodedType])


  // 🧠 Lấy danh mục sản phẩm (API thật)
  const fetchAllTypeProduct = async () => {
    try {
      const res = await ProductService.getAllTypeProduct()
      if (res?.status === 'OK') {
        const types = res.data.map((item) => ({
          value: item,
          label: item,
        }))
        setTypeProducts(types)
      }
    } catch (error) {
      console.error('Error fetching product types:', error)
    }
  }

  // 🧠 Lấy sản phẩm theo danh mục
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await ProductService.getAllProduct('', paginate.limit * 10)
      if (res?.status === 'OK') {
        let filtered = res.data
        if (selectedType) {
          filtered = filtered.filter(
            (p) => p.type?.toLowerCase() === selectedType.toLowerCase()
          )
        }
        setProducts(filtered)
        setPaginate((prev) => ({ ...prev, total: filtered.length }))
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  // ⚡ Khi URL param "type" thay đổi → cập nhật selectedType
  useEffect(() => {
    if (type) {
      setSelectedType(type)
    }
  }, [type])

  // ⚡ Gọi API khi selectedType hoặc trang đổi
  useEffect(() => {
    fetchProducts()
  }, [selectedType, paginate.page, paginate.limit])

  // ⚡ Lấy danh mục khi mount
  useEffect(() => {
    fetchAllTypeProduct()
  }, [])

  // ⚡ Khi chọn danh mục khác trong Select → đổi URL
  useEffect(() => {
    if (selectedType && selectedType !== type) {
      navigate(`/product/${selectedType}`)
    }
  }, [selectedType])

  // 🧮 Lọc & sắp xếp
  const filteredAndSortedProducts = () => {
    let result = [...products]

    if (searchDebounce) {
      result = result.filter((item) =>
        item?.name?.toLowerCase().includes(searchDebounce.toLowerCase())
      )
    }

    result = result.filter(
      (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
    )

    if (selectedRating > 0) {
      result = result.filter((item) => Math.floor(item.rating) >= selectedRating)
    }

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
        break
    }

    return result
  }

  const handlePageChange = (page, pageSize) => {
    setPaginate((prev) => ({ ...prev, page, limit: pageSize }))
  }

  const handleReset = () => {
    setSelectedType('')
    setSelectedRating(0)
    setPriceRange([0, 50000000])
    setSortOption('default')
  }

  return (
    <Loading isLoading={loading}>
      <div
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, #f9fafb 0%, #eef1f5 100%)',
          minHeight: '100vh',
          padding: '30px 0',
        }}
      >
        <div style={{ maxWidth: 1270, margin: '0 auto', padding: '0 15px' }}>
          {/* Header */}
          <WrapperHeader>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>
                {selectedType || 'Tất cả sản phẩm'}
              </h1>
              <WrapperCountText>
                {filteredAndSortedProducts().length} sản phẩm
              </WrapperCountText>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>Sắp xếp:</span>
              <Select
                value={sortOption}
                onChange={setSortOption}
                style={{ width: 200 }}
                suffixIcon={<DownOutlined />}
              >
                <Option value="default">Mặc định</Option>
                <Option value="price_asc">Giá tăng dần</Option>
                <Option value="price_desc">Giá giảm dần</Option>
                <Option value="name_asc">Tên A-Z</Option>
                <Option value="name_desc">Tên Z-A</Option>
                <Option value="rating">Đánh giá cao nhất</Option>
              </Select>
            </div>
          </WrapperHeader>

          <Row gutter={[24, 24]} style={{ marginTop: 20 }}>
            {/* Bộ lọc */}
            <Col xs={24} md={6}>
              <WrapperNavbar>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '2px solid #f0f0f0',
                    paddingBottom: 10,
                    marginBottom: 20,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FilterOutlined style={{ color: '#d70018' }} />
                    <h3 style={{ fontSize: 18, fontWeight: 600 }}>Bộ lọc</h3>
                  </div>
                  <Button
                    type="text"
                    icon={<ReloadOutlined />}
                    onClick={handleReset}
                    style={{ color: '#d70018' }}
                  >
                    Reset
                  </Button>
                </div>

                <FilterSection>
                  <h4>Danh mục</h4>
                  <Select
                    placeholder="Chọn loại sản phẩm"
                    value={selectedType || undefined}
                    onChange={(value) => setSelectedType(value)}
                    style={{ width: '100%' }}
                    suffixIcon={<DownOutlined />}
                  >
                    {typeProducts.map((t) => (
                      <Option key={t.value} value={t.value}>
                        {t.label}
                      </Option>
                    ))}
                  </Select>
                </FilterSection>

                <FilterSection>
                  <h4>Khoảng giá</h4>
                  <Slider
                    range
                    min={0}
                    max={50000000}
                    step={1000000}
                    value={priceRange}
                    onChange={setPriceRange}
                    tooltip={{
                      formatter: (v) => `${(v / 1000000).toFixed(0)} triệu`,
                    }}
                  />
                </FilterSection>

                <FilterSection>
                  <h4>Đánh giá</h4>
                  {[5, 4, 3, 2, 1].map((rate) => (
                    <div
                      key={rate}
                      onClick={() =>
                        setSelectedRating(rate === selectedRating ? 0 : rate)
                      }
                      style={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: 6,
                        color: rate <= selectedRating ? '#faad14' : '#999',
                      }}
                    >
                      <Rate disabled value={rate} />
                    </div>
                  ))}
                </FilterSection>
              </WrapperNavbar>
            </Col>

            {/* Danh sách sản phẩm */}
            <Col xs={24} md={18}>
              <WrapperProducts>
                {filteredAndSortedProducts().length > 0 ? (
                  filteredAndSortedProducts().map((p) => (
                    <CardComponent
                      key={p._id}
                      id={p._id}
                      name={p.name}
                      image={p.image}
                      price={p.price}
                      rating={p.rating}
                      discount={p.discount}
                      selled={p.selled}
                    />
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: 50 }}>
                    <h3>Không có sản phẩm phù hợp</h3>
                    <p>Hãy thử điều chỉnh lại bộ lọc hoặc tìm kiếm khác.</p>
                  </div>
                )}
              </WrapperProducts>

              {filteredAndSortedProducts().length > 0 && (
                <div
                  style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}
                >
                  <Pagination
                    current={paginate.page}
                    total={paginate.total}
                    onChange={handlePageChange}
                    pageSize={paginate.limit}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} của ${total} sản phẩm`
                    }
                  />
                </div>
              )}
            </Col>
          </Row>
        </div>
      </div>
    </Loading>
  )
}

export default TypeProductPage
