import React from 'react'
import { useNavigate } from 'react-router-dom'

const TypeProduct = ({ name }) => {
  const navigate = useNavigate()

  const handleNavigateType = (type) => {
    const path = type.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s/g, '_')
    navigate(`/product/${path}`, { state: type })
  }

  return (
    <div
      style={{
        padding: '14px 28px',
        borderRadius: '8px',
        background: '#ffffff',
        color: '#2c3e50',
        border: '1px solid #e1e8ed',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        minWidth: '120px',
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        letterSpacing: '0.3px'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-1px)'
        e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)'
        e.target.style.borderColor = '#3498db'
        e.target.style.color = '#3498db'
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)'
        e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)'
        e.target.style.borderColor = '#e1e8ed'
        e.target.style.color = '#2c3e50'
      }}
      onClick={() => handleNavigateType(name)}
    >
      {name}
    </div>
  )
}

export default TypeProduct