import styled from "styled-components"
import { Col } from 'antd';

export const WrapperProducts = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 0;
    width: 100%;
    justify-content: flex-start;
    
    /* Đảm bảo mỗi card có chiều rộng cố định */
    & > * {
        flex: 0 0 calc(33.333% - 14px); /* 3 items per row với gap */
        min-width: 280px;
        max-width: calc(33.333% - 14px);
        box-sizing: border-box;
        
        @media (max-width: 1200px) {
            flex: 0 0 calc(50% - 10px);
            max-width: calc(50% - 10px);
        }
        
        @media (max-width: 768px) {
            flex: 0 0 100%;
            max-width: 100%;
        }
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