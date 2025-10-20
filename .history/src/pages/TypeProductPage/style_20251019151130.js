import styled from "styled-components"
import { Col } from 'antd';

export const WrapperProducts = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    margin-top: 0;
`

export const WrapperNavbar = styled(Col)`
    background: #fff;
    padding: 24px;
    border-radius: 12px;
    height: fit-content;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid #f0f0f0;
`

export const WrapperHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    background: #fff;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    margin-bottom: 0;
`

export const WrapperCountText = styled.span`
    color: #666;
    font-size: 14px;
    font-weight: 400;
`

export const FilterSection = styled.div`
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
    }
`const Wrapper = styled.div`
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