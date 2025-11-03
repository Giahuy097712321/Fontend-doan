import styled from "styled-components"
import { Col } from 'antd';

export const WrapperProducts = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-top: 0;
    width: 100%;
    
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
    background: #ffffff;
    padding: 20px;
    border-radius: 8px;
    height: fit-content;
    border: 1px solid #e1e8ed;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`

export const WrapperHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    background: #ffffff;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #e1e8ed;
    margin-bottom: 0;
    margin-top: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
    }
`

export const WrapperCountText = styled.span`
    color: #7f8c8d;
    font-size: 14px;
    font-weight: 400;
`

export const FilterSection = styled.div`
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #ecf0f1;
    
    &:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
    }
`

export const WrapperTypeProductSection = styled.div`
    background: #ffffff;
    padding: 30px 24px;
    border-radius: 8px;
    border: 1px solid #e1e8ed;
    margin-bottom: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`

export const WrapperTypeProductTitle = styled.h2`
    font-size: 20px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 24px;
    text-align: center;
    letter-spacing: 0.5px;
`

export const WapperTypeProduct = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
    
    @media (max-width: 768px) {
        gap: 12px;
    }
    
    @media (max-width: 480px) {
        gap: 10px;
    }
`