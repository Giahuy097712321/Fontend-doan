import React from 'react'
import { useNavigate } from 'react-router-dom'

const TypeProduct = ({ name }) => {
  const navigate = useNavigate()

  const handleNavigateType = (type) => {
    // Tạo URL không dấu, không khoảng trắng
    const path = type.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s/g, '_')
    // Chuyển trang và truyền state
    navigate(`/product/${path}`, { state: type })
  }

  return (
    <div
      style={{ padding: '0 10px', cursor: 'pointer' }}
      onClick={() => handleNavigateType(name)}
    >
      {name}
    </div>
  )
}

export default TypeProduct
