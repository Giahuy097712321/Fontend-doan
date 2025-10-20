// style.js
import styled from "styled-components";

export const WrapperHeader = styled.h1`
    color: #333;
    font-size: 20px;
    margin-bottom: 24px;
`;

export const ChartContainer = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 24px;
`;

export const ChartCard = styled.div`
    flex: 1 1 45%;
    background: #fff;
    padding: 16px;
    border-radius: 16px;
    box-shadow: 0 6px 12px rgba(0,0,0,0.1);
    transition: transform 0.3s, box-shadow 0.3s;
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.15);
    }
`;

export const ChartTitle = styled.h3`
    text-align: center;
    margin-bottom: 16px;
    font-weight: bold;
`;

export const TableWrapper = styled.div`
    background: #fff;
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`;
