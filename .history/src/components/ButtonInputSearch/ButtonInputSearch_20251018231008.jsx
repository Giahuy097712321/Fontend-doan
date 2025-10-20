import React, { useState } from 'react'
import { Button } from 'antd'
import InputComponent from '../InputComponent/InputComponent'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import { SearchOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { searchProduct } from '../../redux/sildes/productSlide'
import { useNavigate } from 'react-router-dom'

const ButtonInputSearch = (props) => {
  const {
    size,
    placeholder,
    textButton,
    bordered,
    backgroundColorInput = '#f8f9fa', // Changed default background color
    backgroundColorButton = 'rgb(13,92,182)',
    colorButton = "#fff"
  } = props

  const [searchValue, setSearchValue] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchValue(value)
    // Real-time search as user types
    dispatch(searchProduct(value))
  }

  const handleSearch = () => {
    dispatch(searchProduct(searchValue))
    // Navigate to search results page if needed
    if (searchValue.trim() && !window.location.pathname.includes('/search')) {
      navigate(`/search?q=${encodeURIComponent(searchValue)}`)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <InputComponent
        size={size}
        placeholder={placeholder}
        bordered={bordered}
        value={searchValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        style={{
          backgroundColor: backgroundColorInput,
          borderRight: 'none',
          borderRadius: '8px 0 0 8px'
        }}
        {...props}
      />

      <ButtonComponent
        size={size}
        styleButton={{
          background: backgroundColorButton,
          border: !bordered && 'none',
          borderRadius: '0 8px 8px 0',
          height: size === 'large' ? '40px' : '32px'
        }}
        icon={<SearchOutlined style={{ color: colorButton }} />}
        textButton={textButton}
        styleTextButton={{ color: colorButton }}
        onClick={handleSearch}
      />
    </div>
  )
}

export default ButtonInputSearch