import styled from "styled-components"
import { Col } from 'antd';

export const WrapperProducts = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-top: 0;
    width: 100%;
    
    /* Quan trọng: Đảm bảo grid container không bị giới hạn */
    grid-auto-rows: minmax(400px, auto);
    
    @media (max-width: 1200px) {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 15px;
    }
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
    margin-top: 20px;
    
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
    }
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
`

export const WrapperTypeProductSection = styled.div`
    background: #fff;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    margin-bottom: 20px;
`

export const WrapperTypeProductTitle = styled.h2`
    font-size: 24px;
    font-weight: 700;
    color: #d70018;
    margin-bottom: 20px;
    text-align: center;
`

export const WapperTypeProduct = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 30px;
    flex-wrap: wrap;
`