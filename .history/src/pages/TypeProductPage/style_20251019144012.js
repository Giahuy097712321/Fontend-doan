import styled from 'styled-components'

export const WrapperTypeProductSection = styled.div`
  margin-top: 20px;
`

export const WrapperTypeProductTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
`

export const WapperTypeProduct = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 30px;
`

export const WrapperProducts = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 18px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`
