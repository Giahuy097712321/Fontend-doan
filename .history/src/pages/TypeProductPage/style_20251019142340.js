import styled from 'styled-components'

export const WrapperTypeProductSection = styled.div`
  margin-top: 40px;
`

export const WrapperTypeProductTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #222;
  margin-bottom: 20px;
  text-align: center;
`

export const WapperTypeProduct = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 24px;
  justify-items: center;
`

export const WrapperProducts = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
  padding: 20px;
`

export const WrapperButtonMore = styled.div`` // nếu có nút xem thêm
