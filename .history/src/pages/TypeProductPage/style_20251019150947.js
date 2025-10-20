import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const Wrapper = styled.div`
  cursor: pointer;
  background-color: #fff;
  border-radius: 10px;
  padding: 12px 18px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
    transform: translateY(-3px);
  }
`

const TypeProduct = ({ name }) => {
    const navigate = useNavigate()

    const handleClick = () => {
        // ✅ Mã hóa URL để giữ nguyên dấu tiếng Việt
        navigate(`/product/${encodeURIComponent(name)}`)
    }

    return <Wrapper onClick={handleClick}>{name}</Wrapper>
}

export default TypeProduct
